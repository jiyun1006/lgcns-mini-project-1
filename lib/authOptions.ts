import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { EXPIRES_IN_SECONDS, signAccessToken } from "@/lib/accessJwt";
import { springAuthLogin } from "@/service/spring/springAuthService";
import { makeLoginId, toLoginEmail } from "@/lib/loginId";
import { prisma } from "@/lib/prisma";
import { matchApiUrl } from "@/config/apiuri";
import { springFetch } from "@/lib/fetchClients";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: EXPIRES_IN_SECONDS },
  pages: { signIn: "/login" },
  events: {
    // 로그아웃하면 강사님 서버의 토큰도 못 쓰게 해요. 실패해도 우리 로그아웃은 그대로 돼요
    async signOut({ token }) {
      if (!token?.springAccessToken) return;
      await springFetch.post<null>(matchApiUrl.auth.logout, undefined, {
        headers: { Authorization: `Bearer ${token.springAccessToken}` },
      });
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Login ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const loginEmail = await toLoginEmail(credentials.email);
        if (!loginEmail) throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
        const result = await springAuthLogin(loginEmail, credentials.password);

        if (!result.ok) throw new Error(result.message);
        const data = result.data;

        // 🔀 Spring 회원을 팀 Mongo User에도 둔다 (있으면 그대로, 없으면 만들기)
        const mongoUser = await prisma.user.upsert({
          where: { email: data.email },
          update: {},
          create: {
            email: data.email,
            name: data.name || data.email,
            loginId: await makeLoginId(data.email),
          },
          select: { id: true },
        });

        return {
          id: mongoUser.id,
          email: data.email,
          name: data.name,
          profileImageUrl: data.avatarUrl ?? "",
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresIn: data.expiresIn,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "credentials" && user) {
        token.springAccessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessToken = await signAccessToken({
          id: user.id,
          email: user.email ?? "",
          name: user.name ?? "",
        });
        token.expiresIn = user.expiresIn;
        token.id = user.id;
        token.email = user.email ?? token.email;
        token.name = user.name ?? token.name;
        token.profileImageUrl = user.profileImageUrl;
        return token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken ?? "";
      session.expiresIn = token.expiresIn ?? EXPIRES_IN_SECONDS;
      session.user = {
        id: token.id ?? "",
        email: token.email ?? "",
        name: token.name ?? "",
        profileImageUrl: token.profileImageUrl ?? "",
      };
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};

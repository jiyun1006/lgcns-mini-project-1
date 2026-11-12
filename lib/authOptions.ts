import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { EXPIRES_IN_SECONDS, signAccessToken } from "@/lib/accessJwt";
import { springAuthLogin } from "@/service/spring/springAuthService";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: EXPIRES_IN_SECONDS },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Login ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const result = await springAuthLogin(credentials.email, credentials.password);
        if (!result.ok) throw new Error(result.message);
        const data = result.data;

        return {
          id: String(data.userId),
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

import "next-auth";
import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    springAccessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
    id?: string;
    profileImageUrl?: string;
  }
}

declare module "next-auth" {
  interface Session {
    accessToken: string;
    expiresIn: number;
    user: {
      id: string;
      email: string;
      name: string;
      profileImageUrl?: string;
    };
  }
  interface User {
    profileImageUrl?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
  }
}

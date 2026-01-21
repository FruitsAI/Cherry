import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminSection = nextUrl.pathname.startsWith("/admin");
      
      if (isAdminSection) {
        if (isLoggedIn && auth?.user?.role === "admin") return true;
        return false; 
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.role && session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  providers: [], // Providers added in auth.ts
} satisfies NextAuthConfig;

/**
 * 🍒 Cherry - NextAuth.js 基础配置
 *
 * 定义认证系统的基础配置，包括页面路由、会话策略和回调函数。
 * 此配置被 auth.ts 引用，与 providers 分离以支持 Edge Runtime。
 *
 * @file src/auth.config.ts
 *
 * @description
 * 配置项：
 * - pages: 自定义登录页面路由
 * - session: JWT 会话策略
 * - callbacks.authorized: 路由权限验证（Admin 需要 admin 角色）
 * - callbacks.jwt: 将用户角色添加到 JWT token
 * - callbacks.session: 将角色从 token 同步到 session
 */

import type { NextAuthConfig } from "next-auth";

/**
 * NextAuth 基础配置对象
 *
 * @description
 * authorized 回调用于中间件权限验证，
 * 确保只有 admin 角色可以访问 /admin/* 路由。
 */
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
        token.id = user.id; // 保存用户 ID 到 token
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.role) {
          session.user.role = token.role as string;
        }
        if (token.id) {
          session.user.id = token.id as string; // 传递用户 ID 到 session
        }
      }
      return session;
    },
  },
  providers: [], // Providers added in auth.ts
} satisfies NextAuthConfig;

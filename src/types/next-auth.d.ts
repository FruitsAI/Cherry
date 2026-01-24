/**
 * 🍒 Cherry - NextAuth.js 类型扩展
 *
 * 扩展 NextAuth.js 的默认类型定义，添加自定义字段。
 *
 * @file src/types/next-auth.d.ts
 *
 * @description
 * 扩展内容：
 * - Session.user.role: 用户角色（admin/user）
 * - JWT.role: JWT 令牌中的角色字段
 */

import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's role. */
      role: string
    } & DefaultSession["user"]
  }

  interface User {
    role?: string
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** The user's role. */
    role: string
  }
}

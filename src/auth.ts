/**
 * 🍒 Cherry - NextAuth.js 认证配置
 *
 * 配置并导出 NextAuth.js 处理程序和辅助函数。
 * 支持 GitHub、Google OAuth 和用户名密码登录。
 *
 * @file src/auth.ts
 *
 * @description
 * 认证方式：
 * - GitHub OAuth
 * - Google OAuth
 * - Credentials（用户名 + 密码，bcrypt 哈希验证）
 *
 * 导出：
 * - handlers: API 路由处理程序
 * - signIn: 登录函数
 * - signOut: 登出函数
 * - auth: 获取当前会话
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { authConfig } from "./auth.config";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

/**
 * NextAuth.js 配置和导出
 *
 * 使用 DrizzleAdapter 将会话存储到 PostgreSQL
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db),
  providers: [
    GitHub,
    Google,
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsedCredentials = z
          .object({ username: z.string(), password: z.string() })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data;
          
          const user = await db.query.users.findFirst({
            where: eq(users.username, username),
          });

          if (!user || null) return null;
          
          // Password check only if user has password (might be OAuth user without password)
           if (user.passwordHash) {
             const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
             if (passwordsMatch) {
               return {
                 ...user,
                 id: user.id.toString(),
                 role: user.role || 'user',
               };
             }
           }
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});


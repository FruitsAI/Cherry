/**
 * 🍒 Cherry - 数据库 Schema 定义
 *
 * 使用 Drizzle ORM 定义 PostgreSQL 数据库表结构。
 * 包含 NextAuth.js 适配器所需的表和业务数据表。
 *
 * @file src/db/schema.ts
 *
 * @description
 * 表结构：
 * - users: 用户表（支持 OAuth 和用户名密码登录）
 * - accounts: OAuth 账户表
 * - sessions: 会话表
 * - verificationTokens: 验证令牌表
 * - branches: 分支/分类表
 * - commits: 链接表
 */

import { pgTable, text, serial, integer, jsonb, timestamp, primaryKey, boolean } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import type { AdapterAccount } from "next-auth/adapters"

/**
 * 用户表
 *
 * 支持 OAuth 和用户名密码两种登录方式。
 * NextAuth.js 适配器要求的标准字段 + 自定义扩展字段。
 */
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  // Custom fields
  username: text('username').unique(), // Optional for OAuth users
  passwordHash: text('password_hash'), // Optional for OAuth users
  siteConfig: jsonb('site_config').default({}),
  role: text('role').default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const accounts = pgTable(
  "accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ]
)

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  ]
)

// 分支表 (分类)
export const branches = pgTable('branches', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), // e.g. "feature/AI"
  icon: text('icon').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Commits 表 (链接)
export const commits = pgTable('commits', {
  id: serial('id').primaryKey(),
  hash: text('hash').unique().notNull(), // 兼容旧版 hash (如 a1b2c3d)
  message: text('message').notNull(),    // 链接标题
  url: text('url').notNull(),
  // 使用 SQL 数组存储标签
  tags: text('tags').array().default(sql`ARRAY[]::text[]`), 
  branchId: integer('branch_id').references(() => branches.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  
  // 统计字段
  visitCount: integer('visit_count').default(0),
  lastVisited: timestamp('last_visited'),
});

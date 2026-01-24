/**
 * 🍒 Cherry - 数据库连接入口
 *
 * 创建并导出 Drizzle ORM 数据库实例。
 * 使用 Vercel Postgres 作为数据库连接。
 *
 * @file src/db/index.ts
 *
 * @description
 * 使用方法：
 * import { db } from '@/db';
 * const result = await db.query.users.findFirst();
 */

import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';

/** Drizzle ORM 数据库实例，配置了完整的 Schema */
export const db = drizzle(sql, { schema });

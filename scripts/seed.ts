/**
 * 🍒 Cherry - 数据库种子脚本
 *
 * 从 JSON 文件读取初始数据并填充到 PostgreSQL 数据库中。
 * 用于首次部署或重置数据库时初始化数据。
 *
 * @description
 * 执行流程：
 * 1. 读取 src/data/data.json 文件
 * 2. 创建/更新管理员用户和站点配置
 * 3. 填充分支 (Branches) 和提交 (Commits) 数据
 *
 * @usage
 * ```bash
 * npx tsx scripts/seed.ts
 * # 或
 * npm run seed
 * ```
 *
 * @requires POSTGRES_URL 环境变量必须配置
 * @default 默认管理员密码为 password123
 */

import { db } from '../src/db';
import { users, branches, commits } from '../src/db/schema';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// 加载环境变量 (.env 文件)
dotenv.config();

/**
 * 执行数据库种子填充
 *
 * @description
 * 该函数是幂等的 (Idempotent)：
 * - 如果用户已存在，会更新密码和配置而非重复创建
 * - 如果分支已存在，会复用现有 ID
 * - 如果提交已存在（通过 hash 判断），会跳过插入
 *
 * @throws {Error} 数据库连接失败或数据格式错误时抛出异常
 */
async function seed() {
  console.log('Seeding database...');

  try {
    // 读取 JSON 数据文件
    const dataPath = path.join(process.cwd(), 'src', 'data', 'data.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(rawData);

    // ═══════════════════════════════════════════════════════════════════════
    // 第一步：初始化用户和站点配置
    // ═══════════════════════════════════════════════════════════════════════
    console.log('Seeding site config...');

    // 检查用户是否已存在，避免重复创建
    const existingUser = await db.select().from(users).where(eq(users.username, data.site_config.user_name));

    // 使用 bcrypt 哈希密码，salt rounds = 10 提供足够安全性
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    if (existingUser.length === 0) {
      // 用户不存在：创建新管理员账户
      await db.insert(users).values({
        username: data.site_config.user_name,
        name: data.site_config.user_name,  // OAuth 兼容：同步用户名到 name 字段
        email: `${data.site_config.user_name}@example.com`,  // 占位邮箱
        passwordHash: hashedPassword,
        siteConfig: data.site_config,  // JSON 格式存储站点配置
        role: 'admin',  // 赋予管理员权限
      });
    } else {
      // 用户已存在：更新密码和配置（便于开发调试和密码重置）
      await db.update(users)
          .set({ 
              passwordHash: hashedPassword,
              siteConfig: data.site_config,
              role: 'admin',  // 强制确保管理员角色
          })
          .where(eq(users.username, data.site_config.user_name));
      console.log('Updated existing user password.');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 第二步：填充分支 (Branches) 和提交 (Commits)
    // ═══════════════════════════════════════════════════════════════════════
    console.log('Seeding branches and commits...');

    for (const [index, branchData] of data.branches.entries()) {
      let branchId: number;

      // 检查分支是否已存在（通过名称匹配）
      const existingBranch = await db.select().from(branches).where(eq(branches.name, branchData.name));
      
      if (existingBranch.length > 0) {
        // 分支已存在：复用现有 ID
        branchId = existingBranch[0].id;
      } else {
        // 分支不存在：插入新分支，使用遍历索引作为排序顺序
        const [newBranch] = await db.insert(branches).values({
          name: branchData.name,
          icon: branchData.icon,
          sortOrder: index,
        }).returning();  // 返回插入的记录以获取自增 ID
        branchId = newBranch.id;
      }

      // 遍历该分支下的所有提交
      for (const commitData of branchData.commits) {
        // 通过 hash 判断提交是否已存在（hash 是唯一标识）
        const existingCommit = await db.select().from(commits).where(eq(commits.hash, commitData.hash));

        if (existingCommit.length === 0) {
          // 提交不存在：插入新提交，关联到当前分支
          await db.insert(commits).values({
            hash: commitData.hash,
            message: commitData.message,
            url: commitData.url,
            tags: commitData.tags || [],  // 默认空数组
            branchId: branchId,
          });
        }
        // 如果提交已存在则跳过，保持幂等性
      }
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

// 执行种子脚本
seed();

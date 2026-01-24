/**
 * 🍒 Cherry - 用户查询调试脚本
 *
 * 用于检查特定用户是否存在于数据库中。
 * 主要用于开发调试和部署后验证。
 *
 * @usage
 * ```bash
 * npx tsx scripts/check-user.ts
 * ```
 *
 * @requires POSTGRES_URL 环境变量必须配置
 */

import "dotenv/config";
import { db } from "../src/db";
import { users } from "../src/db/schema";
import { eq } from "drizzle-orm";

/**
 * 查询并打印用户信息
 *
 * @description 查询用户名为 'willxue' 的用户，输出其 ID、用户名和角色信息
 */
async function main() {
  console.log("Checking user 'willxue'...");

  // 使用 Drizzle Query API 查询单个用户
  const user = await db.query.users.findFirst({
    where: eq(users.username, "willxue"),
  });

  if (user) {
    console.log("User found:");
    console.log("ID:", user.id);
    console.log("Username:", user.username);
    console.log("Role:", user.role);
  } else {
    console.log("User 'willxue' NOT found.");
  }
}

// 执行查询，捕获错误并确保进程正常退出
main().catch(console.error).finally(() => process.exit(0));


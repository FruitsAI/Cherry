/**
 * 🍒 Cherry Admin - 分支管理 Server Actions
 *
 * 管理后台分支（分类）的 CRUD 操作。
 * 所有操作都需要 admin 权限验证。
 *
 * @file src/app/admin/branches/actions.ts
 *
 * @description
 * 功能：
 * - getBranches: 获取所有分支
 * - createBranch: 创建新分支
 * - updateBranch: 更新分支信息
 * - deleteBranch: 删除分支（需无链接）
 * - reorderBranches: 批量更新排序
 */
'use server';

import { cache } from 'react';
import { db } from "@/db";
import { branches, commits } from "@/db/schema";
import { asc, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

/**
 * 检查用户权限
 *
 * @throws 非 admin 用户抛出 Unauthorized 错误
 */
async function checkAuth() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error("Unauthorized");
  }
}

export const getBranches = cache(async () => {
  await checkAuth();
  return await db.select().from(branches).orderBy(asc(branches.sortOrder));
});

export async function createBranch(data: { name: string; icon: string }) {
  await checkAuth();
  
  // Get max sort order to append to end
  const existing = await db.select({ maxOrder: sql<number>`max(${branches.sortOrder})` }).from(branches);
  const nextOrder = (existing[0]?.maxOrder ?? -1) + 1;

  await db.insert(branches).values({
    name: data.name,
    icon: data.icon,
    sortOrder: nextOrder,
  });
  
  revalidatePath('/admin/branches');
}

export async function updateBranch(id: number, data: { name: string; icon: string }) {
  await checkAuth();
  
  await db.update(branches)
    .set({ name: data.name, icon: data.icon })
    .where(eq(branches.id, id));

  revalidatePath('/admin/branches');
}

export async function deleteBranch(id: number) {
  await checkAuth();
  
  // Check if branch has commits
  const branchCommits = await db.select().from(commits).where(eq(commits.branchId, id));
  if (branchCommits.length > 0) {
    throw new Error("Cannot delete branch containing links. Move or delete links first.");
  }

  await db.delete(branches).where(eq(branches.id, id));
  revalidatePath('/admin/branches');
}

export async function reorderBranches(items: { id: number; sortOrder: number }[]) {
  await checkAuth();

  // Use Promise.all for parallel execution
  await Promise.all(
    items.map((item) =>
      db.update(branches)
        .set({ sortOrder: item.sortOrder })
        .where(eq(branches.id, item.id))
    )
  );
  
  revalidatePath('/admin/branches');
}

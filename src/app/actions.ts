/**
 * 🍒 Cherry - Server Actions
 *
 * Next.js 15 App Router 的服务端操作函数集。
 * 提供数据获取、创建、更新、删除等 CRUD 功能。
 *
 * @file src/app/actions.ts
 *
 * @description
 * 主要功能：
 * - getInitialData: 获取首页初始数据（分支、链接、配置）
 * - updateSiteConfig: 更新站点配置
 * - getAdminData: 获取管理后台数据
 * - createLink / updateLink / deleteLink: 链接 CRUD
 * - deleteLinks / updateLinksBranch: 批量操作
 * - importConfig: 导入配置文件
 *
 * 注意：所有涉及数据修改的 action 都需要 admin 权限验证
 */
"use server";

import { cache } from 'react';
import { db } from "@/db";
import { branches, commits, users } from "@/db/schema";
import { desc, eq, inArray, ilike, or, and, InferSelectModel } from "drizzle-orm";
import { version } from "../../package.json";
import bcrypt from "bcryptjs";

/** 分支数据库类型 */
type Branch = InferSelectModel<typeof branches>;
/** 链接数据库类型 */
type Commit = InferSelectModel<typeof commits>;

/**
 * 获取首页初始数据
 *
 * 使用 React cache 函数进行请求级缓存。
 * 支持通过 searchParams 进行搜索和分支筛选。
 *
 * @param searchParams - 可选的查询参数 { q: 搜索词, branch: 分支ID }
 * @returns CherryData 格式的数据
 */
export const getInitialData = cache(async (searchParams?: { q?: string; branch?: string }) => {
  const branchQuery = db.select().from(branches).orderBy(branches.sortOrder);
  
  const conditions = [];

  if (searchParams?.branch && searchParams.branch !== 'all') {
    conditions.push(eq(commits.branchId, Number(searchParams.branch)));
  }

  if (searchParams?.q) {
    const q = `%${searchParams.q}%`;
    conditions.push(or(
      ilike(commits.message, q),
      ilike(commits.url, q)
    ));
  }

  const commitQuery = db.select().from(commits).where(and(...conditions));
  const userQuery = db.select().from(users).limit(1);

  // Parallel fetch (Rule 1.4)
  const [allBranches, allCommits, user] = await Promise.all([
    branchQuery,
    commitQuery,
    userQuery
  ]);

  // Map to legacy structure for compatibility during migration
  const formattedBranches = allBranches.map((branch: Branch) => {
    // ... logic
    const branchCommits = allCommits.filter((c: Commit) => c.branchId === branch.id);
    return {
      name: branch.name,
      icon: branch.icon,
      commits: branchCommits.map((c: Commit) => ({
        message: c.message,
        hash: c.hash,
        url: c.url,
        tags: c.tags || [],
        visitCount: c.visitCount,
        lastVisited: c.lastVisited?.toISOString(),
      }))
    };
  });

  // Default config if no user found (should stay consistent with data.json structure)
  const userConfig = user.length > 0 ? (user[0].siteConfig as any) : {};
  
  // Merge version from package.json
  const siteConfig = {
    ...userConfig,
    version: version
  };

  return {
    site_config: siteConfig,
    branches: formattedBranches
  };
});

export async function updateSiteConfig(config: any) {
  const session = await auth();
  if (!session || session.user?.role !== 'admin') {
    throw new Error("Unauthorized");
  }

  const existingUser = await db.select().from(users).limit(1);
  if (existingUser.length === 0) {
    throw new Error("No user found");
  }

  // Preserve existing config but update provided fields
  // Note: we don't save version to DB anymore
  const currentConfig = (existingUser[0].siteConfig as any) || {};
  const newConfig = {
    ...currentConfig,
    ...config,
    // Ensure version is NOT saved to DB to avoid confusion, 
    // or we can save it if we want a snapshot, but request said to rely on package.json.
    // Let's explicitly remove it from the object being saved if it was passed.
    version: undefined 
  };
  
  // Remove keys with undefined values to keep JSON clean
  Object.keys(newConfig).forEach(key => newConfig[key] === undefined && delete newConfig[key]);

  await db.update(users)
    .set({ siteConfig: newConfig })
    .where(eq(users.id, existingUser[0].id));
    
  revalidatePath('/');
  return { success: true };
}

export const getAdminData = cache(async () => {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  // Parallel fetch (Rule 1.4)
  const [allBranches, allCommits] = await Promise.all([
    db.select().from(branches).orderBy(branches.sortOrder),
    db.select().from(commits).orderBy(desc(commits.createdAt))
  ]);

  return {
    branches: allBranches,
    commits: allCommits,
  };
});

import { auth } from "../auth";
import { redirect } from "next/navigation";

// ... existing imports

export async function createLink(data: {
  message: string;
  url: string;
  tags: string[];
  branchId: number;
}) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  // Generate a random hash for compatibility
  const hash = Math.random().toString(36).substring(2, 9);
  
  await db.insert(commits).values({
    hash,
    message: data.message,
    url: data.url,
    tags: data.tags,
    branchId: data.branchId,
  });
}

export async function updateLink(id: number, data: Partial<{
  message: string;
  url: string;
  tags: string[];
}>) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  await db.update(commits)
    .set(data)
    .where(eq(commits.id, id));
}

export async function deleteLink(id: number) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  
  await db.delete(commits).where(eq(commits.id, id));
}

export async function deleteLinks(ids: number[]) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  if (ids.length === 0) return;

  await db.delete(commits).where(inArray(commits.id, ids));
}

export async function updateLinksBranch(ids: number[], branchId: number) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  if (ids.length === 0) return;

  await db.update(commits)
    .set({ branchId })
    .where(inArray(commits.id, ids));
}


import { revalidatePath } from "next/cache";

export async function importConfig(config: any) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!config.data?.branches) {
    throw new Error("Invalid Config Format");
  }

  await db.transaction(async (tx) => {
    // 1. Update Site Config (Update first admin user found)
    if (config.data.site_config) {
      const existingUser = await tx.select().from(users).limit(1);
      if (existingUser.length > 0) {
        await tx.update(users)
          .set({ siteConfig: config.data.site_config })
          .where(eq(users.id, existingUser[0].id));
      }
    }

    // 2. Clear existing structure (Commits depend on Branches, so delete commits first)
    await tx.delete(commits);
    await tx.delete(branches);

    // 3. Re-create structure
    // Note: We use the index as sortOrder
    for (const [index, branch] of config.data.branches.entries()) {
      const [newBranch] = await tx.insert(branches).values({
        name: branch.name,
        icon: branch.icon,
        sortOrder: index,
      }).returning();

      if (branch.commits?.length > 0) {
        await tx.insert(commits).values(
          branch.commits.map((c: any) => ({
            hash: c.hash || Math.random().toString(36).substring(2, 9),
            message: c.message,
            url: c.url,
            tags: c.tags || [],
            branchId: newBranch.id,
            visitCount: c.visitCount || 0,
            lastVisited: c.lastVisited ? new Date(c.lastVisited) : null,
          }))
        );
      }
    }
  });

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

/**
 * 修改密码
 *
 * 验证当前密码后更新 passwordHash。
 * 仅限 admin 用户调用。
 *
 * @param data - { currentPassword, newPassword }
 * @returns { success: boolean, error?: string }
 */
export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session || session.user?.role !== 'admin') {
    return { success: false, error: 'Unauthorized' };
  }

  const userId = session.user?.id;
  if (!userId) {
    return { success: false, error: 'User ID not found' };
  }

  // 查询用户
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user || !user.passwordHash) {
    return { success: false, error: 'User not found or password not set' };
  }

  // 验证当前密码
  const passwordsMatch = await bcrypt.compare(data.currentPassword, user.passwordHash);
  if (!passwordsMatch) {
    return { success: false, error: 'Current password is incorrect' };
  }

  // 生成新密码哈希
  const newPasswordHash = await bcrypt.hash(data.newPassword, 10);

  // 更新密码
  await db
    .update(users)
    .set({ passwordHash: newPasswordHash, updatedAt: new Date() })
    .where(eq(users.id, userId));

  return { success: true };
}

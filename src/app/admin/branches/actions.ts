'use server';

import { db } from "@/db";
import { branches, commits } from "@/db/schema";
import { asc, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

// Check authentication and role
async function checkAuth() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error("Unauthorized");
  }
}

export async function getBranches() {
  await checkAuth();
  return await db.select().from(branches).orderBy(asc(branches.sortOrder));
}

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

  // Transaction recommended but simple loop for now
  for (const item of items) {
    await db.update(branches)
      .set({ sortOrder: item.sortOrder })
      .where(eq(branches.id, item.id));
  }
  
  revalidatePath('/admin/branches');
}

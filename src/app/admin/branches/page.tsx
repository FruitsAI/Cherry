/**
 * 🍒 Cherry Admin - 分支管理页面
 *
 * 管理后台的分支（分类）管理界面。
 * 支持拖拽排序、新增、编辑、删除分支。
 *
 * @file src/app/admin/branches/page.tsx
 */

import { Suspense } from "react";
import { getBranches } from "./actions";
import { BranchList } from "../../../components/admin/branch-list";

/** 分支计数组件 */
function BranchesCount({ count }: { count: number }) {
  return (
    <div className="font-code text-sm text-[var(--cherry-muted)]">
      {count} Branches Found
    </div>
  );
}

function BranchesTable({ branches }: { branches: any[] }) {
  // Note: Drag and drop description moved here to be part of the table logic
  return (
    <div className="terminal-card border-[var(--cherry-amber)] glow-amber p-6">
      <p className="font-code text-sm text-[var(--cherry-muted)] mb-6">
        Drag and drop to reorder branches. Changes are saved automatically.
      </p>
      
      <BranchList initialBranches={branches} />
    </div>
  );
}

export default async function BranchesPage() {
  const branches = await getBranches();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-pixel text-2xl text-[var(--cherry-text)] glow-text">
          BRANCH MANAGEMENT
        </h2>
        <BranchesCount count={branches.length} />
      </div>

      <BranchesTable branches={branches} />
    </div>
  );
}

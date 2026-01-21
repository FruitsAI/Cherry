import { getBranches } from "./actions";
import { BranchList } from "../../../components/admin/branch-list";

export default async function BranchesPage() {
  const branches = await getBranches();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-pixel text-2xl text-[var(--cherry-text)] glow-text">
          CATEGORY MANAGEMENT
        </h2>
        <div className="font-code text-sm text-[var(--cherry-muted)]">
          {branches.length} Categories Found
        </div>
      </div>

      <div className="terminal-card border-[var(--cherry-amber)] glow-amber p-6">
        <p className="font-code text-sm text-[var(--cherry-muted)] mb-6">
          Drag and drop to reorder categories. Changes are saved automatically.
        </p>
        
        <BranchList initialBranches={branches} />
      </div>
    </div>
  );
}

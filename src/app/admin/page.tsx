import { getAdminData } from "../actions";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { LinkManager } from "../../components/admin/LinkManager";
import { IconDisplay } from "../../components";
import { ConfigManager } from "../../components/admin/ConfigManager";

export default async function AdminPage() {
  const data = await getAdminData();

  const totalLinks = data.commits.length;
  const totalVisits = data.commits.reduce((sum, c) => sum + (c.visitCount || 0), 0);
  const mostActiveBranch = data.branches.length > 0 ? data.branches[0].name : 'N/A'; // Simplified

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="terminal-card border-[var(--cherry-green)] glow-green p-6">
        <h2 className="font-pixel text-xl text-[var(--cherry-green)] mb-2">SYSTEM STATUS: OPERATIONAL</h2>
        <p className="font-code text-[var(--cherry-muted)] text-sm">
          Welcome back, Administrator. System is running at 100% capacity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black/40 border border-[var(--cherry-green)]/30 p-4 rounded backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2 text-[var(--cherry-green)]">
            <IconDisplay icon="pixels/folder.svg" className="text-xl" />
            <span className="font-pixel text-sm">TOTAL LINKS</span>
          </div>
          <div className="font-pixel text-3xl text-[var(--cherry-text)]">{totalLinks}</div>
        </div>
        
        <div className="bg-black/40 border border-[var(--cherry-pink)]/30 p-4 rounded backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2 text-[var(--cherry-pink)]">
            <IconDisplay icon="pixels/heart.svg" className="text-xl" />
            <span className="font-pixel text-sm">TOTAL VISITS</span>
          </div>
          <div className="font-pixel text-3xl text-[var(--cherry-text)]">{totalVisits}</div>
        </div>

        <div className="bg-black/40 border border-[var(--cherry-amber)]/30 p-4 rounded backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2 text-[var(--cherry-amber)]">
            <IconDisplay icon="pixels/settings.svg" className="text-xl" />
            <span className="font-pixel text-sm">ACTIVE BRANCH</span>
          </div>
          <div className="font-pixel text-3xl text-[var(--cherry-text)] truncate">{mostActiveBranch}</div>
        </div>
      </div>

      {/* Link Manager Section */}
      <div>
        <h3 className="font-pixel text-lg text-[var(--cherry-red)] glow-red mb-4 flex items-center gap-2">
          <span className="inline-block w-2 h-4 bg-[var(--cherry-red)] mr-2" />
          DATABASE ENTRIES
        </h3>
        <LinkManager initialBranches={data.branches} initialCommits={data.commits} />
      </div>

      {/* Configuration Management */}
      <div>
          <ConfigManager data={data} />
      </div>
    </div>
  );
}

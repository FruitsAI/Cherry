/**
 * 🍒 Cherry Admin - 链接管理组件
 *
 * 管理后台的核心 CRUD 组件，用于管理所有链接（Commits）。
 * 支持搜索、筛选、分页、批量操作等功能。
 *
 * @file src/components/admin/link-manager.tsx
 *
 * @description
 * 功能：
 * - 链接列表展示（表格形式）
 * - 搜索过滤（标题/URL）
 * - 分支筛选
 * - 分页浏览
 * - 单条/批量删除
 * - 批量移动到其他分支
 * - 新增/编辑链接（Modal）
 */
"use client";

import { RiAddLine } from "@remixicon/react";
import { useState } from 'react';
import { deleteLink, createLink, updateLink, deleteLinks, updateLinksBranch } from '../../app/actions';
import { LinkModal } from './link-modal';
import { IconDisplay } from '../ui/icon-display';
import { ConfirmModal } from '../ui/confirm-modal';

/** 分支数据类型 */
interface Branch {
  id: number;
  name: string;
  icon: string;
  sortOrder: number;
  createdAt: Date;
}

/** 链接（Commit）数据类型 */
interface Commit {
  id: number;
  hash: string;
  message: string;
  url: string;
  tags: string[] | null;
  branchId: number;
  createdAt: Date;
  visitCount: number | null;
  lastVisited: Date | null;
}

/** LinkManager 组件 Props */
interface LinkManagerProps {
  /** 所有分支数据 */
  initialBranches: Branch[];
  /** 所有链接数据 */
  initialCommits: Commit[];
}

/**
 * 链接管理组件
 *
 * @description
 * 渲染带有搜索、筛选、分页功能的链接表格，
 * 支持批量操作和单条编辑/删除。
 */
export function LinkManager({ initialBranches, initialCommits }: LinkManagerProps) {
  const [commits, setCommits] = useState(initialCommits);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState<number | 'all'>('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Commit | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Batch Selection State
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isBatchMoveOpen, setIsBatchMoveOpen] = useState(false); // To show branch selector for move

  // Confirm Modal State
  const [confirmState, setConfirmState] = useState<{
      isOpen: boolean;
      type: 'single' | 'batch' | null;
      id?: number;
  }>({ isOpen: false, type: null });

  const filteredCommits = commits.filter(commit => {
    const matchesSearch = commit.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          commit.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch = selectedBranchId === 'all' || commit.branchId === selectedBranchId;
    return matchesSearch && matchesBranch;
  });

  // Calculate Pagination
  const totalPages = Math.ceil(filteredCommits.length / ITEMS_PER_PAGE);
  const paginatedCommits = filteredCommits.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
  }

  // Batch Logic
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredCommits.map(c => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  const handleBatchDeleteClick = () => {
      setConfirmState({ isOpen: true, type: 'batch' });
  };

  const handleDeleteClick = (id: number) => {
      setConfirmState({ isOpen: true, type: 'single', id });
  };

  const handleConfirmAction = async () => {
    if (confirmState.type === 'batch') {
        await deleteLinks(selectedIds);
        setCommits(prev => prev.filter(c => !selectedIds.includes(c.id)));
        setSelectedIds([]);
    } else if (confirmState.type === 'single' && confirmState.id) {
        await deleteLink(confirmState.id);
        setCommits(prev => prev.filter(c => c.id !== confirmState.id));
    }
    setConfirmState({ isOpen: false, type: null });
  };

  const handleBatchMove = async (targetBranchId: number) => {
    await updateLinksBranch(selectedIds, targetBranchId);
    setCommits(prev => prev.map(c => selectedIds.includes(c.id) ? { ...c, branchId: targetBranchId } : c));
    setSelectedIds([]);
    setIsBatchMoveOpen(false);
  };

  // Single Item Logic (Replaced by handleDeleteClick and handleConfirmAction)

  const handleEdit = (commit: Commit) => {
    setEditingLink(commit);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingLink(null);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    window.location.reload(); 
  };

  return (
    <div className="space-y-6 relative">
      {/* Batch Actions Toolbar */}
      {selectedIds.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[var(--cherry-bg)] border border-[var(--cherry-green)] shadow-lg shadow-[var(--cherry-green)]/20 p-4 rounded z-50 flex items-center gap-6 animate-in slide-in-from-bottom-4">
              <div className="font-pixel text-[var(--cherry-green)]">
                  {selectedIds.length} SELECTED
              </div>
              <div className="h-6 w-px bg-[var(--cherry-muted)]/50" />
              <div className="flex items-center gap-3">
                  {/* Delete */}
                  <button 
                      onClick={handleBatchDeleteClick}
                      className="text-[var(--cherry-red)] hover:text-red-400 font-pixel text-sm flex items-center gap-2 px-3 py-1.5 border border-[var(--cherry-red)]/30 rounded hover:bg-[var(--cherry-red)]/10"
                  >
                      DELETE
                  </button>

                  {/* Move */}
                  <div className="relative">
                      {!isBatchMoveOpen ? (
                          <button 
                              onClick={() => setIsBatchMoveOpen(true)}
                              className="text-[var(--cherry-amber)] hover:text-amber-300 font-pixel text-sm flex items-center gap-2 px-3 py-1.5 border border-[var(--cherry-amber)]/30 rounded hover:bg-[var(--cherry-amber)]/10"
                          >
                              MOVE TO...
                          </button>
                      ) : (
                          <div className="flex items-center gap-2">
                             <select
                                autoFocus
                                className="bg-[var(--cherry-bg-secondary)] text-[var(--cherry-text)] border border-[var(--cherry-muted)] rounded p-1 text-sm font-code"
                                onChange={(e) => {
                                    if(e.target.value) handleBatchMove(Number(e.target.value));
                                }}
                                onBlur={() => setIsBatchMoveOpen(false)}
                                defaultValue=""
                             >
                                <option value="" disabled>Select Branch</option>
                                {initialBranches.map(b => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                             </select>
                             <button onClick={() => setIsBatchMoveOpen(false)} className="text-[var(--cherry-muted)] hover:text-[var(--cherry-text)]">✕</button>
                          </div>
                      )}
                  </div>
              </div>
              <button onClick={() => setSelectedIds([])} className="text-xs text-[var(--cherry-muted)] hover:text-[var(--cherry-text)] underline">
                  Clear
              </button>
          </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[var(--card-bg)] p-4 rounded border border-[var(--cherry-green)]/30 backdrop-blur-sm">
        <div className="flex flex-1 gap-4 w-full">
          <input
            type="text"
            autoComplete="off"
            placeholder="Search links..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="input-retro flex-1 px-3 py-2 bg-[var(--cherry-bg-secondary)]/40 border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-text)] font-code text-sm"
          />
          <select
            value={selectedBranchId}
            onChange={(e) => { setSelectedBranchId(e.target.value === 'all' ? 'all' : Number(e.target.value)); setCurrentPage(1); }}
            className="input-retro px-3 py-2 bg-[var(--cherry-bg-secondary)]/40 border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-text)] font-code text-sm"
          >
            <option value="all">All Branches</option>
            {initialBranches.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
          <button
            onClick={handleAdd}
            className="button-retro px-4 py-2 bg-[var(--cherry-green)] text-[var(--cherry-bg)] rounded font-code text-sm hover:bg-[var(--cherry-green)]/90 transition-colors flex items-center gap-2"
          >
            <RiAddLine className="text-xl" />
            <span>Add New Link</span>
          </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded border border-[var(--cherry-green)]/30 bg-[var(--card-bg)] backdrop-blur-sm">
        <table className="w-full text-left font-code text-sm">
          <thead className="bg-[var(--cherry-green)]/10 text-[var(--cherry-green)]">
            <tr>
              <th className="p-3 border-b border-[var(--cherry-green)]/20 w-[40px]">
                <input 
                    type="checkbox" 
                    className="accent-[var(--cherry-green)]"
                    checked={filteredCommits.length > 0 && selectedIds.length === filteredCommits.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th className="p-3 border-b border-[var(--cherry-green)]/20">Title</th>
              <th className="p-3 border-b border-[var(--cherry-green)]/20">URL</th>
              <th className="p-3 border-b border-[var(--cherry-green)]/20">Branch</th>
              <th className="p-3 border-b border-[var(--cherry-green)]/20">Tags</th>
              <th className="p-3 border-b border-[var(--cherry-green)]/20 text-right">Visits</th>
              <th className="p-3 border-b border-[var(--cherry-green)]/20 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--cherry-green)]/10">
            {paginatedCommits.map(commit => {
                const branch = initialBranches.find(b => b.id === commit.branchId);
                const isSelected = selectedIds.includes(commit.id);
                return (
                  <tr key={commit.id} className={`hover:bg-[var(--cherry-green)]/5 transition-colors group ${isSelected ? 'bg-[var(--cherry-green)]/10' : ''}`}>
                    <td className="p-3">
                        <input 
                            type="checkbox" 
                            className="accent-[var(--cherry-green)]"
                            checked={isSelected}
                            onChange={(e) => handleSelectOne(commit.id, e.target.checked)}
                        />
                    </td>
                    <td className="p-3 font-medium text-[var(--cherry-text)]">{commit.message}</td>
                    <td className="p-3 text-[var(--cherry-muted)] truncate max-w-[200px]" title={commit.url}>{commit.url}</td>
                    <td className="p-3">
                        <span className="flex items-center gap-1 text-[var(--cherry-pink)]">
                            {branch?.name}
                        </span>
                    </td>
                    <td className="p-3">
                        <div className="flex gap-1 flex-wrap">
                            {commit.tags?.map(tag => (
                                <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-[var(--cherry-bg-secondary)] border border-[var(--cherry-muted)] text-[var(--cherry-muted)]">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </td>
                    <td className="p-3 text-right text-[var(--cherry-amber)] font-pixel">{commit.visitCount}</td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(commit)}
                          className="text-[var(--cherry-green)] hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(commit.id)}
                          className="text-[var(--cherry-red)] hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
            })}
             {filteredCommits.length === 0 && (
                <tr>
                    <td colSpan={7} className="p-8 text-center text-[var(--cherry-muted)]">
                        No links found matching your criteria.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 bg-[var(--card-bg)] rounded border border-[var(--cherry-green)]/30 backdrop-blur-sm">
           <div className="text-sm text-[var(--cherry-muted)] font-code">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredCommits.length)} of {filteredCommits.length} entries
           </div>
           <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-[var(--cherry-bg-secondary)]/40 border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-text)] disabled:opacity-30 hover:bg-[var(--cherry-green)]/10 font-code text-sm transition-colors"
              >
                Previous
              </button>
              <div className="px-2 text-[var(--cherry-green)] font-pixel text-lg">
                 {currentPage} / {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-[var(--cherry-bg-secondary)]/40 border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-text)] disabled:opacity-30 hover:bg-[var(--cherry-green)]/10 font-code text-sm transition-colors"
              >
                Next
              </button>
           </div>
        </div>
      )}

      <LinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        branches={initialBranches}
        initialData={editingLink ? { ...editingLink, tags: editingLink.tags || [] } : null}
        onSuccess={handleSuccess}
      />

      <ConfirmModal 
        isOpen={confirmState.isOpen}
        title={confirmState.type === 'batch' ? 'DELETE LINKS' : 'DELETE LINK'}
        message={confirmState.type === 'batch' 
            ? `Are you sure you want to delete ${selectedIds.length} selected links? This action cannot be undone.`
            : "Are you sure you want to delete this link? This action cannot be undone."
        }
        confirmText="CONFIRM DELETE"
        isDangerous={true}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmState({ isOpen: false, type: null })}
      />
    </div>
  );
}

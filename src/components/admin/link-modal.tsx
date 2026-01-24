/**
 * 🍒 Cherry Admin - 链接编辑弹窗
 *
 * 用于新增或编辑链接的模态对话框。
 * 使用 createPortal 渲染到 document.body。
 *
 * @file src/components/admin/link-modal.tsx
 *
 * @description
 * 表单字段：
 * - URL: 链接地址
 * - Title: 链接标题
 * - Branch: 所属分支（编辑时禁用）
 * - Tags: 标签（逗号分隔）
 */
"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createLink, updateLink } from '../../app/actions';

/** LinkModal 组件 Props */
interface LinkModalProps {
  /** 是否显示弹窗 */
  isOpen: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 分支列表（用于下拉选择） */
  branches: Array<{ id: number; name: string }>;
  /** 编辑模式的初始数据（null 表示新增） */
  initialData?: {
    id: number;
    url: string;
    message: string;
    branchId: number;
    tags: string[];
  } | null;
  /** 保存成功回调 */
  onSuccess: () => void;
}

/**
 * 链接编辑弹窗组件
 *
 * @description
 * 根据 initialData 判断是新增还是编辑模式，
 * 调用相应的 Server Action 保存数据。
 */
export function LinkModal({ isOpen, onClose, branches, initialData, onSuccess }: LinkModalProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [branchId, setBranchId] = useState<number>(branches[0]?.id || 0);
  const [tags, setTags] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setUrl(initialData.url);
      setTitle(initialData.message);
      setBranchId(initialData.branchId);
      setTags(initialData.tags?.join(', ') || '');
    } else {
      setUrl('');
      setTitle('');
      setBranchId(branches[0]?.id || 0);
      setTags('');
    }
    setError(null);
  }, [initialData, branches, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    try {
      const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      
      if (initialData) {
        await updateLink(initialData.id, {
          url,
          message: title,
          tags: tagArray,
        });
      } else {
        await createLink({
          url,
          message: title,
          tags: tagArray,
          branchId,
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to save link. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  if (!isOpen) return null;
  
  // Ensure we are on client
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[var(--cherry-bg-secondary)]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="terminal-card max-w-lg w-full mx-4 p-6 border-[var(--cherry-red)] flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 shadow-2xl">
        <h2 className="font-pixel text-2xl text-[var(--cherry-red)] glow-red mb-6">
          {initialData ? 'EDIT LINK' : 'ADD NEW LINK'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-code text-[var(--cherry-amber)] mb-2">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="input-retro w-full px-3 py-2 bg-[var(--cherry-bg)] border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-text)] font-code text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-code text-[var(--cherry-amber)] mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="input-retro w-full px-3 py-2 bg-[var(--cherry-bg)] border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-text)] font-code text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-code text-[var(--cherry-amber)] mb-2">Branch</label>
             {/* Disable branch change on edit if complex, but simple version allows it */}
            <select
              value={branchId}
              onChange={(e) => setBranchId(Number(e.target.value))}
              className="input-retro w-full px-3 py-2 bg-[var(--cherry-bg)] border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-text)] font-code text-sm"
              disabled={!!initialData} // Simplified: prevent moving branches for now
            >
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-code text-[var(--cherry-amber)] mb-2">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="input-retro w-full px-3 py-2 bg-[var(--cherry-bg)] border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-text)] font-code text-sm"
            />
          </div>

          {error && <div className="text-red-500 text-sm font-code">{error}</div>}

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="button-retro flex-1 px-4 py-2 bg-[var(--cherry-green)] text-[var(--cherry-bg)] rounded font-code text-sm disabled:opacity-50"
            >
              {isPending ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="button-retro px-4 py-2 bg-[var(--cherry-bg-secondary)] border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-green)] font-code text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

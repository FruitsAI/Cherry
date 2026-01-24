/**
 * 🍒 Cherry Admin - 分支表单对话框
 *
 * 用于新增或编辑分支的模态对话框。
 * 支持设置分支名称和图标（Emoji 或 SVG 路径）。
 *
 * @file src/components/admin/branch-form-dialog.tsx
 *
 * @description
 * 表单字段：
 * - Name: 分支名称
 * - Icon: 图标（Emoji 或 pixels/*.svg）
 */
"use client";

import { useState, useEffect } from "react";
import { createPortal } from 'react-dom';
import { createBranch, updateBranch } from "@/app/admin/branches/actions";
import { IconDisplay } from "@/components/ui/icon-display";

/** BranchFormDialog 组件 Props */
interface BranchFormDialogProps {
  /** 编辑模式的初始数据 */
  branch?: { id: number; name: string; icon: string };
  /** 受控模式：是否打开 */
  open?: boolean;
  /** 受控模式：状态变更回调 */
  onOpenChange?: (open: boolean) => void;
  /** 自定义触发器元素 */
  trigger?: React.ReactNode;
}

/**
 * 分支表单对话框组件
 */
export function BranchFormDialog({ branch, open, onOpenChange, trigger }: BranchFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
  });
  const [loading, setLoading] = useState(false);

  // Sync internal state with props
  useEffect(() => {
    if (open !== undefined) setIsOpen(open);
  }, [open]);

  useEffect(() => {
    if (branch) {
      setFormData({ name: branch.name, icon: branch.icon });
    } else {
      setFormData({ name: "", icon: "" });
    }
  }, [branch, isOpen]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (branch) {
        await updateBranch(branch.id, formData);
      } else {
        await createBranch(formData);
      }
      handleOpenChange(false);
    } catch (error) {
      console.error(error);
      alert("Failed to save branch");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return trigger ? (
      <div onClick={() => handleOpenChange(true)}>{trigger}</div>
    ) : (
      <button
        onClick={() => handleOpenChange(true)}
        className="px-4 py-2 border border-[var(--cherry-green)] text-[var(--cherry-green)] hover:bg-[var(--cherry-green)] hover:text-white rounded transition-colors font-pixel text-sm"
      >
        + ADD CATEGORY
      </button>
    );
  }

  // Ensure modal context (only when open)
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--cherry-bg-secondary)]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[var(--cherry-bg)] border border-[var(--cherry-green)] rounded-lg shadow-[0_0_20px_rgba(0,255,0,0.2)] p-6 space-y-6 animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between border-b border-[var(--cherry-green)]/30 pb-4">
          <h3 className="font-pixel text-xl text-[var(--cherry-text)] glow-text">
            {branch ? "EDIT CATEGORY" : "NEW CATEGORY"}
          </h3>
          <button
            onClick={() => handleOpenChange(false)}
            className="text-[var(--cherry-muted)] hover:text-[var(--cherry-red)] transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="font-code text-sm text-[var(--cherry-green)] block">NAME</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[var(--cherry-bg-secondary)]/40 border border-[var(--cherry-green)]/50 rounded px-3 py-2 text-[var(--cherry-text)] focus:border-[var(--cherry-green)] focus:outline-none transition-colors font-pixel"
              placeholder="e.g. Frontend"
            />
          </div>

          <div className="space-y-2">
            <label className="font-code text-sm text-[var(--cherry-green)] block">ICON (Emoji or Path)</label>
            <div className="flex gap-4">
                 <input
                type="text"
                required
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="flex-1 bg-[var(--cherry-bg-secondary)]/40 border border-[var(--cherry-green)]/50 rounded px-3 py-2 text-[var(--cherry-text)] focus:border-[var(--cherry-green)] focus:outline-none transition-colors font-code"
                placeholder="e.g. ⚛️ or pixels/folder.svg"
                />
                <div className="w-10 h-10 flex items-center justify-center bg-[var(--cherry-green)]/10 rounded border border-[var(--cherry-green)]/20">
                     {formData.icon ? (
                         formData.icon.startsWith("pixels/") ? 
                            <IconDisplay icon={formData.icon} className="w-6 h-6" /> : 
                            <span className="text-xl">{formData.icon}</span>
                     ) : (
                         <span className="text-xl opacity-20">?</span>
                     )}
                </div>
            </div>
            <p className="text-xs text-[var(--cherry-muted)] font-code">
                Support emojis or SVG paths starting with "pixels/"
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="px-4 py-2 text-[var(--cherry-muted)] hover:text-[var(--cherry-text)] font-pixel text-sm transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[var(--cherry-green)] text-[var(--cherry-bg)] hover:bg-[var(--cherry-green)]/90 rounded font-pixel text-sm disabled:opacity-50 transition-colors"
            >
              {loading ? "SAVING..." : "SAVE"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

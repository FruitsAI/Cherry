/**
 * 🍒 Cherry UI - 确认弹窗组件
 *
 * 通用的确认对话框，用于危险操作（如删除）前的二次确认。
 * 使用 createPortal 渲染到 document.body，避免 z-index 问题。
 *
 * @file src/components/ui/confirm-modal.tsx
 *
 * @description
 * 特性：
 * - 模态遮罩层（点击外部不关闭）
 * - ESC 键关闭
 * - 危险模式：红色边框和按钮
 * - 正常模式：绿色边框和按钮
 */

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/** ConfirmModal 组件 Props */
interface ConfirmModalProps {
  /** 是否显示弹窗 */
  isOpen: boolean;
  /** 弹窗标题 */
  title: string;
  /** 提示信息 */
  message: string;
  /** 确认按钮文字 */
  confirmText?: string;
  /** 取消按钮文字 */
  cancelText?: string;
  /** 是否为危险操作（影响颜色） */
  isDangerous?: boolean;
  /** 确认回调 */
  onConfirm: () => void;
  /** 取消回调 */
  onCancel: () => void;
}

/**
 * 确认弹窗组件
 *
 * @description
 * 渲染全屏遮罩和居中的对话框，
 * 支持键盘交互和动画效果。
 */
export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        ref={modalRef}
        className={`w-full max-w-md bg-[var(--cherry-bg)] border ${isDangerous ? 'border-[var(--cherry-red)] box-shadow-[0_0_20px_rgba(255,0,85,0.2)]' : 'border-[var(--cherry-green)] box-shadow-[0_0_20px_rgba(46,204,113,0.2)]'} rounded p-6 shadow-2xl animate-in zoom-in-95 duration-200`}
        role="dialog"
        aria-modal="true"
      >
        <h3 className={`text-xl font-pixel mb-4 flex items-center gap-2 ${isDangerous ? 'text-[var(--cherry-red)]' : 'text-[var(--cherry-green)]'}`}>
          <span className="animate-blink">_</span>
          {title}
        </h3>
        
        <p className="text-[var(--cherry-text)] font-code text-sm mb-8 leading-relaxed opacity-90">
          {message}
        </p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 font-code text-sm text-[var(--cherry-muted)] hover:text-[var(--cherry-text)] transition-colors border border-transparent hover:border-[var(--cherry-muted)]/30 rounded"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-6 py-2 font-pixel tracking-wide text-lg rounded shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
              isDangerous 
                ? 'bg-[var(--cherry-red)] text-white hover:bg-red-600 shadow-red-900/20' 
                : 'bg-[var(--cherry-green)] text-black hover:bg-green-500 shadow-green-900/20'
            }`}
          >
             [' {confirmText} ']
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

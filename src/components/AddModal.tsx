import { useState, useRef, useEffect } from 'react';
import { IconDisplay } from './IconDisplay';
import { useTranslation } from 'react-i18next';

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  branches: Array<{ name: string; icon: string }>;
}

export function AddModal({ isOpen, onClose, branches }: AddModalProps) {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(branches[0]?.name || '');
  const [tags, setTags] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  // 聚焦 URL 输入框
  useEffect(() => {
    if (isOpen && urlInputRef.current) {
      urlInputRef.current.focus();
    }
  }, [isOpen]);

  // 生成 JSON 片段
  const generateJson = () => {
    if (!url || !title) {
      setMessage({ type: 'error', text: t('modal.add.message_error') });
      return;
    }

    // 生成随机 hash
    const hash = Math.random().toString(16).slice(2, 9);

    // 解析标签
    const tagArray = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    // 生成 commit 对象
    const commit = {
      message: title,
      hash: hash,
      url: url,
      tags: tagArray.length > 0 ? tagArray : ['new'],
    };

    // 格式化为 JSON 字符串（2 空格缩进）
    const jsonString = JSON.stringify(commit, null, 2);

    // 复制到剪贴板
    navigator.clipboard
      .writeText(jsonString)
      .then(() => {
        setMessage({ type: 'success', text: t('modal.add.message_success') });
      })
      .catch((err) => {
        console.error('Copy failed:', err);
        setMessage({ type: 'error', text: t('modal.add.copy_error') });
      });
  };

  // 重置表单
  const resetForm = () => {
    setUrl('');
    setTitle('');
    setTags('');
    setMessage(null);
    if (urlInputRef.current) {
      urlInputRef.current.focus();
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div
        className="terminal-card max-w-lg w-full mx-4 p-6 border-[var(--cherry-red)] flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题 */}
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <h2 className="font-pixel text-2xl text-[var(--cherry-red)] glow-red flex items-center gap-2">
            <IconDisplay icon="/pixels/add.svg" className="text-2xl" imageClassName="w-8 h-8" /> {t('modal.add.title').toUpperCase()}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--cherry-muted)] hover:text-[var(--cherry-red)] transition-colors"
          >
            [ESC]
          </button>
        </div>

        {/* 表单 - 可滚动 */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {/* URL 输入 */}
          <div>
            <label className="block text-sm font-code text-[var(--cherry-amber)] mb-2">
              {t('modal.add.url')}
            </label>
            <input
              ref={urlInputRef}
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="input-retro w-full px-3 py-2 bg-[var(--cherry-bg)] border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-text)] font-code text-sm"
            />
          </div>

          {/* 标题输入 */}
          <div>
            <label className="block text-sm font-code text-[var(--cherry-amber)] mb-2">
              {t('modal.add.title_input')}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('modal.add.title_input')}
              className="input-retro w-full px-3 py-2 bg-[var(--cherry-bg)] border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-text)] font-code text-sm"
            />
          </div>

          {/* Branch 选择 */}
          <div>
            <label className="block text-sm font-code text-[var(--cherry-amber)] mb-2">
              {t('header.branch')}
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="input-retro w-full px-3 py-2 bg-[var(--cherry-bg)] border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-text)] font-code text-sm"
            >
              {branches.map((branch) => (
                <option key={branch.name} value={branch.name}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          {/* 标签输入 */}
          <div>
            <label className="block text-sm font-code text-[var(--cherry-amber)] mb-2">
              {t('modal.add.tags')}
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="tools, dev, daily"
              className="input-retro w-full px-3 py-2 bg-[var(--cherry-bg)] border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-text)] font-code text-sm"
            />
          </div>

          {/* 消息提示 */}
          {message && (
            <div
              className={`px-3 py-2 rounded text-sm font-code ${
                message.type === 'success'
                  ? 'bg-[var(--cherry-green)]/10 text-[var(--cherry-green)] border border-[var(--cherry-green)]/30'
                  : 'bg-[var(--cherry-red)]/10 text-[var(--cherry-red)] border border-[var(--cherry-red)]/30'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* 按钮组 */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={generateJson}
              className="button-retro flex-1 px-4 py-2 bg-[var(--cherry-green)] text-[var(--cherry-bg)] rounded font-code text-sm"
            >
              {t('modal.add.generate_copy')}
            </button>
            <button
              onClick={resetForm}
              className="button-retro px-4 py-2 bg-[var(--cherry-bg-secondary)] border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-green)] font-code text-sm"
            >
              {t('modal.add.reset')}
            </button>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="mt-6 pt-4 border-t border-[var(--cherry-green)]/30 flex-shrink-0">
          <p className="text-xs text-[var(--cherry-muted)] font-code">
            💡 {t('modal.add.tip_instruction')}
          </p>
        </div>
      </div>
    </div>
  );
}
/**
 * 🍒 Cherry Admin - 设置表单组件
 *
 * 站点配置的编辑表单。
 * 支持修改 slogan 和快捷链接列表。
 *
 * @file src/components/admin/settings-form.tsx
 *
 * @description
 * 表单字段：
 * - Slogan: 首页标语
 * - Shortcuts: 快捷链接（可增删）
 *   - Name: 链接名称
 *   - URL: 链接地址
 *   - Icon: 图标路径
 */
"use client";

import { useState } from 'react';
import { updateSiteConfig } from '../../app/actions';

/** 快捷链接类型 */
interface Shortcut {
  name: string;
  url: string;
  icon: string;
}

/** 站点配置类型 */
interface SiteConfig {
  slogan: string;
  theme?: string;
  shortcuts: Shortcut[];
  version?: string;
}

/** SettingsForm 组件 Props */
interface SettingsFormProps {
  /** 初始配置数据 */
  initialConfig: SiteConfig;
  /** 当前版本号 */
  initialVersion: string;
}

/**
 * 设置表单组件
 */
export function SettingsForm({ initialConfig, initialVersion }: SettingsFormProps) {
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<SiteConfig>(initialConfig);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSiteConfig(config);
      alert('Settings saved!');
    } catch (err) {
      alert('Failed to save settings: ' + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleShortcutChange = (index: number, field: keyof Shortcut, value: string) => {
    setConfig((prev) => {
      const newShortcuts = [...prev.shortcuts];
      newShortcuts[index] = { ...newShortcuts[index], [field]: value };
      return { ...prev, shortcuts: newShortcuts };
    });
  };

  const addShortcut = () => {
    setConfig((prev) => ({
      ...prev,
      shortcuts: [...prev.shortcuts, { name: '', url: '', icon: '' }],
    }));
  };

  const removeShortcut = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      shortcuts: prev.shortcuts.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* General Info */}
      <div className="terminal-card bg-[var(--cherry-bg-secondary)]/40 p-6 space-y-4">
        <h2 className="text-xl text-[var(--cherry-red)] mb-4 border-b border-[var(--cherry-red)]/30 pb-2">General</h2>
        
        <div>
          <label className="block text-[var(--cherry-muted)] mb-2">Slogan</label>
          <input
            type="text"
            autoComplete="off"
            spellCheck={false}
            value={config.slogan || ''}
            onChange={(e) => {
              const val = e.target.value;
              setConfig((prev) => ({ ...prev, slogan: val }));
            }}
            className="w-full bg-[var(--cherry-bg-secondary)]/50 border border-[var(--cherry-green)]/30 p-2 text-[var(--cherry-green)] focus:border-[var(--cherry-green)] focus:outline-none rounded"
          />
        </div>

        <div>
           <label className="block text-[var(--cherry-muted)] mb-2">System Version (Auto-detected)</label>
           <div className="text-[var(--cherry-green)] font-bold font-mono">
             {initialVersion || 'Unknown'}
           </div>
           <p className="text-xs text-[var(--cherry-muted)]/50 mt-1">Read from package.json</p>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="terminal-card bg-[var(--cherry-bg-secondary)]/40 p-6 space-y-4">
        <div className="flex justify-between items-center mb-4 border-b border-[var(--cherry-red)]/30 pb-2">
          <h2 className="text-xl text-[var(--cherry-red)]">Shortcuts</h2>
          <button
            type="button"
            onClick={addShortcut}
            className="px-3 py-1 text-sm bg-[var(--cherry-green)]/10 text-[var(--cherry-green)] border border-[var(--cherry-green)]/50 rounded hover:bg-[var(--cherry-green)]/20"
          >
            + Add New
          </button>
        </div>

        {config.shortcuts.map((shortcut, idx) => (
          <div key={idx} className="grid grid-cols-12 gap-4 items-end bg-[var(--cherry-bg-secondary)]/30 p-4 rounded border border-[var(--cherry-muted)]/10">
            <div className="col-span-3">
              <label className="block text-xs text-[var(--cherry-muted)] mb-1">Name</label>
              <input
                type="text"
                value={shortcut.name}
                onChange={(e) => handleShortcutChange(idx, 'name', e.target.value)}
                className="w-full bg-[var(--cherry-bg-secondary)]/50 border border-[var(--cherry-green)]/30 p-2 text-sm text-[var(--cherry-green)] rounded"
              />
            </div>
            <div className="col-span-4">
              <label className="block text-xs text-[var(--cherry-muted)] mb-1">URL</label>
              <input
                type="text"
                value={shortcut.url}
                onChange={(e) => handleShortcutChange(idx, 'url', e.target.value)}
                className="w-full bg-[var(--cherry-bg-secondary)]/50 border border-[var(--cherry-green)]/30 p-2 text-sm text-[var(--cherry-green)] rounded"
              />
            </div>
            <div className="col-span-4">
              <label className="block text-xs text-[var(--cherry-muted)] mb-1">Icon Path (e.g. pixels/x.svg)</label>
              <input
                type="text"
                value={shortcut.icon}
                onChange={(e) => handleShortcutChange(idx, 'icon', e.target.value)}
                className="w-full bg-[var(--cherry-bg-secondary)]/50 border border-[var(--cherry-green)]/30 p-2 text-sm text-[var(--cherry-green)] rounded"
              />
            </div>
            <div className="col-span-1">
               <button
                  type="button"
                  onClick={() => removeShortcut(idx)}
                  className="w-full p-2 text-[var(--cherry-red)] hover:bg-[var(--cherry-red)]/10 rounded"
                  title="Remove"
                >
                  🗑️
                </button>
            </div>
          </div>
        ))}

        {config.shortcuts.length === 0 && (
           <p className="text-center text-[var(--cherry-muted)] py-4">No shortcuts configured.</p>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={saving}
          className={`px-6 py-3 bg-[var(--cherry-green)] text-black font-bold rounded shadow-[0_0_15px_rgba(0,255,0,0.3)] hover:shadow-[0_0_25px_rgba(0,255,0,0.5)] transition-all ${saving ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
        >
          {saving ? 'Saving...' : 'SAVE SETTINGS'}
        </button>
      </div>
    </form>
  );
}

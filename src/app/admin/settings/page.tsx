"use client";

import { useState, useEffect } from 'react';
import { getInitialData, updateSiteConfig } from '../../actions';

interface Shortcut {
  name: string;
  url: string;
  icon: string;
}

interface SiteConfig {
  slogan: string;
  theme?: string;
  shortcuts: Shortcut[];
  version?: string; // We'll display this but not edit it
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<SiteConfig>({
    slogan: '',
    shortcuts: [],
  });
  
  const [version, setVersion] = useState<string>('');

  useEffect(() => {
    getInitialData().then((data) => {
      if (data.site_config) {
        // Separate version for display
        const { version: ver, ...rest } = data.site_config;
        setVersion(ver || '');
        setConfig(rest as SiteConfig);
      }
      setLoading(false);
    });
  }, []);

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
    const newShortcuts = [...config.shortcuts];
    newShortcuts[index] = { ...newShortcuts[index], [field]: value };
    setConfig({ ...config, shortcuts: newShortcuts });
  };

  const addShortcut = () => {
    setConfig({
      ...config,
      shortcuts: [...config.shortcuts, { name: '', url: '', icon: '' }],
    });
  };

  const removeShortcut = (index: number) => {
    const newShortcuts = config.shortcuts.filter((_, i) => i !== index);
    setConfig({ ...config, shortcuts: newShortcuts });
  };

  if (loading) {
    return <div className="p-8 text-[var(--cherry-green)] font-pixel">Loading settings...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto text-[var(--cherry-text)] font-pixel">
      <h1 className="text-3xl text-[var(--cherry-green)] mb-8 title-glow">Site Settings</h1>
      
      <form onSubmit={handleSave} className="space-y-8">
        {/* General Info */}
        <div className="terminal-card bg-black/40 p-6 space-y-4">
          <h2 className="text-xl text-[var(--cherry-red)] mb-4 border-b border-[var(--cherry-red)]/30 pb-2">General</h2>
          
          <div>
            <label className="block text-[var(--cherry-muted)] mb-2">Slogan</label>
            <input
              type="text"
              value={config.slogan || ''}
              onChange={(e) => setConfig({ ...config, slogan: e.target.value })}
              className="w-full bg-black/50 border border-[var(--cherry-green)]/30 p-2 text-[var(--cherry-green)] focus:border-[var(--cherry-green)] focus:outline-none rounded"
            />
          </div>

          <div>
             <label className="block text-[var(--cherry-muted)] mb-2">System Version (Auto-detected)</label>
             <div className="text-[var(--cherry-green)] font-bold font-mono">
               {version || 'Unknown'}
             </div>
             <p className="text-xs text-[var(--cherry-muted)]/50 mt-1">Read from package.json</p>
          </div>
        </div>

        {/* Shortcuts */}
        <div className="terminal-card bg-black/40 p-6 space-y-4">
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
            <div key={idx} className="grid grid-cols-12 gap-4 items-end bg-black/30 p-4 rounded border border-[var(--cherry-muted)]/10">
              <div className="col-span-3">
                <label className="block text-xs text-[var(--cherry-muted)] mb-1">Name</label>
                <input
                  type="text"
                  value={shortcut.name}
                  onChange={(e) => handleShortcutChange(idx, 'name', e.target.value)}
                  className="w-full bg-black/50 border border-[var(--cherry-green)]/30 p-2 text-sm text-[var(--cherry-green)] rounded"
                />
              </div>
              <div className="col-span-4">
                <label className="block text-xs text-[var(--cherry-muted)] mb-1">URL</label>
                <input
                  type="text"
                  value={shortcut.url}
                  onChange={(e) => handleShortcutChange(idx, 'url', e.target.value)}
                  className="w-full bg-black/50 border border-[var(--cherry-green)]/30 p-2 text-sm text-[var(--cherry-green)] rounded"
                />
              </div>
              <div className="col-span-4">
                <label className="block text-xs text-[var(--cherry-muted)] mb-1">Icon Path (e.g. pixels/x.svg)</label>
                <input
                  type="text"
                  value={shortcut.icon}
                  onChange={(e) => handleShortcutChange(idx, 'icon', e.target.value)}
                  className="w-full bg-black/50 border border-[var(--cherry-green)]/30 p-2 text-sm text-[var(--cherry-green)] rounded"
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
    </div>
  );
}

"use client";

import { useState, useEffect } from 'react';
import { createLink, updateLink } from '../../app/actions';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  branches: Array<{ id: number; name: string }>;
  initialData?: {
    id: number;
    url: string;
    message: string;
    branchId: number;
    tags: string[];
  } | null;
  onSuccess: () => void;
}

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

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="terminal-card max-w-lg w-full mx-4 p-6 border-[var(--cherry-red)] flex flex-col max-h-[85vh]">
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
    </div>
  );
}

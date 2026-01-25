/**
 * 🍒 Cherry Admin - 密码修改表单组件
 *
 * 管理员密码修改的表单组件。
 * 支持当前密码验证和新密码确认。
 *
 * @file src/components/admin/password-form.tsx
 *
 * @description
 * 表单字段：
 * - currentPassword: 当前密码（用于身份验证）
 * - newPassword: 新密码
 * - confirmPassword: 确认新密码
 *
 * 验证规则：
 * - 所有字段必填
 * - 新密码最少 6 位
 * - 两次输入密码需一致
 */
"use client";

import { useState } from 'react';
import { changePassword } from '@/app/actions';

/**
 * 密码修改表单组件
 */
export function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  /**
   * 表单提交处理
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // 前端验证
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setSaving(true);
    try {
      const result = await changePassword({
        currentPassword,
        newPassword,
      });

      if (result.success) {
        setSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(result.error || 'Failed to change password');
      }
    } catch (err) {
      setError('An error occurred: ' + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-md">
      {/* Password Change Form */}
      <div className="terminal-card bg-[var(--cherry-bg-secondary)]/40 p-6 space-y-4">
        <h2 className="text-xl text-[var(--cherry-red)] mb-4 border-b border-[var(--cherry-red)]/30 pb-2">
          Security
        </h2>

        {/* Error Message */}
        {error && (
          <div className="bg-[var(--cherry-red)]/10 border border-[var(--cherry-red)]/50 text-[var(--cherry-red)] px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-[var(--cherry-green)]/10 border border-[var(--cherry-green)]/50 text-[var(--cherry-green)] px-4 py-3 rounded">
            Password changed successfully!
          </div>
        )}

        {/* Current Password */}
        <div>
          <label className="block text-[var(--cherry-muted)] mb-2">Current Password</label>
          <input
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full bg-[var(--cherry-bg-secondary)]/50 border border-[var(--cherry-green)]/30 p-2 text-[var(--cherry-green)] focus:border-[var(--cherry-green)] focus:outline-none rounded"
          />
        </div>

        {/* New Password */}
        <div>
          <label className="block text-[var(--cherry-muted)] mb-2">New Password</label>
          <input
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-[var(--cherry-bg-secondary)]/50 border border-[var(--cherry-green)]/30 p-2 text-[var(--cherry-green)] focus:border-[var(--cherry-green)] focus:outline-none rounded"
          />
          <p className="text-xs text-[var(--cherry-muted)]/50 mt-1">Minimum 6 characters</p>
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-[var(--cherry-muted)] mb-2">Confirm New Password</label>
          <input
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-[var(--cherry-bg-secondary)]/50 border border-[var(--cherry-green)]/30 p-2 text-[var(--cherry-green)] focus:border-[var(--cherry-green)] focus:outline-none rounded"
          />
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={saving}
          className={`px-6 py-3 bg-[var(--cherry-green)] text-black font-bold rounded shadow-[0_0_15px_rgba(0,255,0,0.3)] hover:shadow-[0_0_25px_rgba(0,255,0,0.5)] transition-all ${
            saving ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
          }`}
        >
          {saving ? 'Saving...' : 'CHANGE PASSWORD'}
        </button>
      </div>
    </form>
  );
}

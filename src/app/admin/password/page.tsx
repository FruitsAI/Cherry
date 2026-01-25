/**
 * 🍒 Cherry Admin - 修改密码页面
 *
 * 管理后台的密码修改界面。
 * 允许管理员安全地更新登录密码。
 *
 * @file src/app/admin/password/page.tsx
 */

import { PasswordForm } from '@/components/admin/password-form';

export const metadata = {
  title: 'Password | Cherry Admin',
};

/**
 * 密码修改页面
 */
export default function AdminPasswordPage() {
  return (
    <div className="text-[var(--cherry-text)] font-pixel">
      <h1 className="text-3xl text-[var(--cherry-green)] mb-8 title-glow">Change Password</h1>
      <PasswordForm />
    </div>
  );
}

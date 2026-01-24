/**
 * 🍒 Cherry Admin - 站点设置页面
 *
 * 管理后台的站点配置界面。
 * 允许修改 site_config 中的各项设置。
 *
 * @file src/app/admin/settings/page.tsx
 */

import { Suspense } from 'react';
import { getInitialData } from '../../actions';
import { SettingsForm } from '../../../components/admin/settings-form';

export const metadata = {
  title: 'Settings | Cherry Admin',
};

/**
 * 设置页面
 */
export default async function AdminSettingsPage() {
  const data = await getInitialData();
  
  if (!data.site_config) {
    return (
      <div className="text-[var(--cherry-text)] font-pixel p-8">
        <h1 className="text-3xl text-[var(--cherry-red)] mb-4">Error</h1>
        <p>Failed to load configuration.</p>
      </div>
    );
  }

  // Separate version from the rest of the config
  const { version: ver, ...rest } = data.site_config;
  const initialConfig = {
    ...rest,
    shortcuts: rest.shortcuts || [],
  };

  return (
    <div className="text-[var(--cherry-text)] font-pixel">
      <h1 className="text-3xl text-[var(--cherry-green)] mb-8 title-glow">Site Settings</h1>
      
      <SettingsForm 
        initialConfig={initialConfig as any} 
        initialVersion={ver || ''} 
      />
    </div>
  );
}

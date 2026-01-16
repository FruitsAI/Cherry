import { useEffect } from 'react';

type Theme = 'dark' | 'light';

interface ThemeToggleProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function ThemeToggle({ theme, onThemeChange }: ThemeToggleProps) {
  // 应用主题到 HTML 元素
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }

    // 保存到 localStorage
    localStorage.setItem('cherry-theme', theme);
  }, [theme]);

  const handleToggle = () => {
    onThemeChange(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={handleToggle}
      className="button-retro p-2 border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-green)] hover:border-[var(--cherry-green)] transition-all"
      title={theme === 'dark' ? '切换到亮色主题' : '切换到暗色主题'}
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
}
import { useEffect } from 'react';
import { IconDisplay } from './IconDisplay';

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
      root.classList.remove('dark');
    } else {
      root.removeAttribute('data-theme');
      root.classList.add('dark');
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
      className="p-1 rounded cursor-pointer text-[var(--cherry-green)] hover:text-[var(--cherry-amber)] hover:scale-110 active:scale-95 hover:rotate-12 transition-all duration-300"
      title={theme === 'dark' ? '切换到亮色主题' : '切换到暗色主题'}
    >
      <IconDisplay 
        icon={theme === 'dark' ? '/pixels/theme_dark.svg' : '/pixels/theme_light.svg'} 
        className="text-xl"
        imageClassName="w-6 h-6"
      />
    </button>
  );
}
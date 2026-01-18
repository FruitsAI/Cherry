import { useTranslation } from 'react-i18next';

interface FooterProps {
  version?: string;
}

export function Footer({ version = '{version}' }: FooterProps) {
  const { t } = useTranslation();

  return (
    <footer className="py-1 border-t border-[var(--cherry-green)]/20 text-center bg-[var(--cherry-bg-secondary)]/50 backdrop-blur-sm">
      <p className="text-xs text-[var(--cherry-muted)] font-code">
        <span className="text-[var(--cherry-green)]">🍒</span> {t('footer.version', { version: version.replace('v', '') })}
        {' '}|{' '}
        <span className="text-[var(--cherry-amber)]">{t('app.slogan')}</span>
        {' '}|{' '}
        <a
          href="https://github.com/FruitsAI/Cherry"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--cherry-red)]"
        >
          {t('header.fork')}
        </a>
      </p>
    </footer>
  );
}

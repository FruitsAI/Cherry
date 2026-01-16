interface FooterProps {
  version?: string;
}

export function Footer({ version = 'v0.8.0' }: FooterProps) {
  return (
    <footer className="py-1 border-t border-[var(--cherry-green)]/20 text-center bg-[var(--cherry-bg-secondary)]/50 backdrop-blur-sm">
      <p className="text-xs text-[var(--cherry-muted)] font-code">
        <span className="text-[var(--cherry-green)]">🍒</span> Cherry {version}
        {' '}|{' '}
        <span className="text-[var(--cherry-amber)]">Cherry-pick the web</span>
        {' '}|{' '}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--cherry-red)]"
        >
          Fork on GitHub
        </a>
      </p>
    </footer>
  );
}

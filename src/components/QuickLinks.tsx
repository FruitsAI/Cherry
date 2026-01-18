import type { Shortcut } from '../types';
import { IconDisplay } from './IconDisplay';

interface QuickLinksProps {
  shortcuts?: Shortcut[];
}

export function QuickLinks({ shortcuts }: QuickLinksProps) {
  if (!shortcuts || shortcuts.length === 0) return null;

  return (
    <div className="mt-0 flex flex-wrap justify-center gap-6 animate-fade-in-up animate-delay-300">
      {shortcuts.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-2 text-[var(--cherry-muted)] hover:text-[var(--cherry-text)] transition-all duration-300 hover:-translate-y-1"
        >
          <div className="w-12 h-12 flex items-center justify-center bg-[var(--cherry-bg-secondary)] border border-[var(--cherry-green)]/20 rounded-xl group-hover:border-[var(--cherry-green)] group-hover:shadow-[0_0_15px_rgba(46,204,113,0.2)] transition-all">
            <IconDisplay 
              icon={link.icon} 
              className="text-2xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] group-hover:scale-110 transition-transform duration-300"
              imageClassName="w-8 h-8"
            />
          </div>
          <span className="text-xs font-code opacity-70 group-hover:opacity-100 transition-opacity">
            {link.name}
          </span>
        </a>
      ))}
    </div>
  );
}

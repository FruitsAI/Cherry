import { useState, useEffect } from 'react';

interface HeroProps {
  slogan: string;
}

export function Hero({ slogan }: HeroProps) {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const fullText = `> ${slogan}`;

  // 打字机效果
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 80);

    return () => clearInterval(timer);
  }, [fullText]);

  // 光标闪烁
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <section className="text-center">
      {/* 像素风 Cherry 图标 */}
      <div className="mb-4 flex justify-center animate-fade-in-up">
        <div className="relative animate-float">
          <img
            src="./cherry.svg"
            alt="Cherry"
            loading="lazy"
            className="icon-retro w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 drop-shadow-[0_0_15px_rgba(255,0,85,0.6)]"
          />
          {/* 辉光效果 */}
          <div className="absolute inset-0 bg-[var(--cherry-red)] opacity-30 blur-2xl rounded-full animate-pulse" />
        </div>
      </div>

      {/* 标题 */}
      <h1 className="font-pixel text-3xl sm:text-4xl md:text-5xl text-[var(--cherry-red)] glow-red mb-2 animate-fade-in-up animate-delay-100">
        🍒 CHERRY
      </h1>

      {/* 打字机 Slogan */}
      <div className="font-code text-lg sm:text-xl text-[var(--cherry-green)] glow-green animate-fade-in-up animate-delay-200 mb-4">
        <span>{displayText}</span>
        <span
          className={`inline-block w-3 h-6 bg-[var(--cherry-green)] ml-1 ${
            showCursor ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* 帮助提示 */}
      <p className="hidden sm:block mt-2 text-xs sm:text-sm text-[var(--cherry-muted)] font-code animate-fade-in-up animate-delay-300 px-4">
        Press <kbd className="px-2 py-1 bg-[var(--cherry-bg-secondary)] border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-green)]">/</kbd> to search
        {' '} | {' '}
        <kbd className="px-2 py-1 bg-[var(--cherry-bg-secondary)] border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-green)]">j</kbd>
        <kbd className="px-2 py-1 bg-[var(--cherry-bg-secondary)] border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-green)]">k</kbd> to navigate
        {' '} | {' '}
        <kbd className="px-2 py-1 bg-[var(--cherry-bg-secondary)] border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-green)]">?</kbd> for help
        {' '} | {' '}
        <kbd className="px-2 py-1 bg-[var(--cherry-bg-secondary)] border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-green)]">A</kbd> to add
      </p>
    </section>
  );
}


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
    <section className="pt-24 pb-8 px-4 text-center">
      {/* 像素风 Cherry 图标 */}
      <div className="mb-6 flex justify-center">
        <div className="relative">
          <img
            src="./cherry.svg"
            alt="Cherry"
            className="w-24 h-24 md:w-32 md:h-32 drop-shadow-[0_0_10px_rgba(255,0,85,0.5)]"
          />
          {/* 辉光效果 */}
          <div className="absolute inset-0 bg-[var(--cherry-red)] opacity-20 blur-xl rounded-full" />
        </div>
      </div>

      {/* 标题 */}
      <h1 className="font-pixel text-4xl md:text-6xl text-[var(--cherry-red)] glow-red mb-4">
        🍒 CHERRY
      </h1>

      {/* 打字机 Slogan */}
      <div className="font-code text-xl md:text-2xl text-[var(--cherry-green)] glow-green">
        <span>{displayText}</span>
        <span
          className={`inline-block w-3 h-6 bg-[var(--cherry-green)] ml-1 ${
            showCursor ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* 帮助提示 */}
      <p className="mt-6 text-sm text-[var(--cherry-muted)] font-code">
        Press <kbd className="px-2 py-1 bg-[var(--cherry-bg-secondary)] border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-green)]">/</kbd> to search
        {' '} | {' '}
        <kbd className="px-2 py-1 bg-[var(--cherry-bg-secondary)] border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-green)]">j</kbd>
        <kbd className="px-2 py-1 bg-[var(--cherry-bg-secondary)] border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-green)]">k</kbd> to navigate
        {' '} | {' '}
        <kbd className="px-2 py-1 bg-[var(--cherry-bg-secondary)] border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-green)]">?</kbd> for help
      </p>
    </section>
  );
}


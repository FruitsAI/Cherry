/**
 * 🍒 Cherry - 当前时间组件
 *
 * 页头显示的实时时钟，每秒更新一次。
 * 格式：HH:MM:SS（24小时制）
 *
 * @file src/components/layout/current-time.tsx
 */
"use client";

import { useState, useEffect } from 'react';

/**
 * 当前时间组件
 *
 * @description
 * 使用 setInterval 每秒更新时间显示。
 * 组件卸载时自动清理定时器。
 */
export function CurrentTime() {
  const [time, setTime] = useState('');

  useEffect(() => {
    // Helper to format time
    const format = () => new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    setTime(format());

    const timer = setInterval(() => {
      setTime(format());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <span className="hidden md:inline text-[var(--cherry-amber)]" suppressHydrationWarning>
      {time}
    </span>
  );
}

/**
 * 🍒 Cherry Hooks - useLatest Hook
 *
 * 稳定化回调引用的实用 Hook。
 * 确保通过 ref 始终可以访问到最新值。
 *
 * @file src/hooks/use-latest.ts
 *
 * @description
 * 用途：
 * - 避免事件监听器因依赖变化而频繁重新绑定
 * - 在回调中安全访问最新的 props 或 state
 *
 * 原理：
 * 使用 useLayoutEffect 在每次渲染后同步更新 ref.current，
 * 使得通过 ref 访问的值始终是最新的。
 */

import { useRef, useLayoutEffect, useEffect } from 'react';

/**
 * 同构 useLayoutEffect
 * 浏览器环境使用 useLayoutEffect，SSR 环境使用 useEffect
 */
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * useLatest Hook
 *
 * @param value - 需要保持最新的值
 * @returns 包含最新值的 ref 对象
 */
export function useLatest<T>(value: T) {
  const ref = useRef(value);

  useIsomorphicLayoutEffect(() => {
    ref.current = value;
  });

  return ref;
}

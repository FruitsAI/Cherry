/**
 * 🍒 Cherry - 国际化配置
 *
 * 使用 i18next + react-i18next 实现多语言支持。
 * 支持中文 (zh) 和英文 (en) 两种语言。
 *
 * @file src/i18n.ts
 *
 * @description
 * 工作原理：
 * 1. SSR 时默认使用中文
 * 2. 客户端挂载后调用 syncLanguageFromStorage() 同步 localStorage 设置
 * 3. 用户切换语言时保存到 localStorage
 *
 * 语言资源文件：
 * - src/locales/zh.json
 * - src/locales/en.json
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import zh from './locales/zh.json';
import en from './locales/en.json';

/**
 * 初始化 i18next 实例
 */
i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources: {
      en: {
        translation: en
      },
      zh: {
        translation: zh
      }
    },
    // SSR 时默认使用中文，客户端会在挂载后同步 localStorage 的值
    lng: 'zh',
    fallbackLng: 'zh',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

/**
 * 客户端同步函数：从 localStorage 读取并应用语言设置
 * 应在客户端组件挂载后调用
 */
export function syncLanguageFromStorage(): void {
  if (typeof window === 'undefined') return;
  
  const saved = localStorage.getItem('cherry-language');
  if (saved && (saved === 'zh' || saved === 'en')) {
    const currentLang = i18n.language?.split('-')[0];
    if (currentLang !== saved) {
      i18n.changeLanguage(saved);
    }
  } else {
    // 如果没有保存的语言，根据浏览器语言决定
    const browserLang = navigator.language?.split('-')[0];
    const targetLang = browserLang === 'en' ? 'en' : 'zh';
    const currentLang = i18n.language?.split('-')[0];
    if (currentLang !== targetLang) {
      i18n.changeLanguage(targetLang);
      localStorage.setItem('cherry-language', targetLang);
    }
  }
}

export default i18n;

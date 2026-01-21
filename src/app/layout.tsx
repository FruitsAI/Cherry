import type { Metadata } from 'next';
import { VT323, Fira_Code } from 'next/font/google';
import './globals.css';

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-code',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cherry - Cherry-pick the web',
  description: 'A retro terminal-style browser startpage for developers',
  icons: {
    icon: '/pixels/cherry.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${vt323.variable} ${firaCode.variable}`}>
      <body className="antialiased min-h-screen bg-[var(--cherry-bg)] text-[var(--cherry-text)]">
        {children}
      </body>
    </html>
  );
}

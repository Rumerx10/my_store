import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
  display: 'swap',
});

// Dark mode as in the Tailwind docs: before the first paint, put `dark` on <html> when the
// saved choice (localStorage.theme, set by ThemeToggle) is dark, or when nothing is saved and
// the system is dark. Without a saved choice it keeps following the system setting.
const themeScript = `(() => {
  const media = matchMedia('(prefers-color-scheme: dark)');
  const apply = () => {
    let theme = null;
    try { theme = localStorage.getItem('theme'); } catch {}
    document.documentElement.classList.toggle('dark', theme ? theme === 'dark' : media.matches);
  };
  apply();
  media.addEventListener('change', apply);
})();`;

// Shell shared by every vendor storefront. Each vendor's own chrome (header, footer, store,
// metadata) lives in its segment layout, e.g. app/next-power/layout.tsx.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The theme script changes the class before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${geist.variable} antialiased`}>{children}</body>
    </html>
  );
}

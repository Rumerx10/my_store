import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/shared/Navbar/Navbar';
import Footer from '@/components/shared/Footer/Footer';
import ReduxProvider from '@/redux/provider';
import { Toaster } from 'react-hot-toast';
import { SITE } from '@/docs/site';
import GridPulses from '@/components/shared/GridPulses';
import SunLight from '@/components/shared/SunLight';

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#1d4ed8',
};

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
      <body className={`${geist.variable} antialiased`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lift dark:focus:bg-slate-900"
        >
          Skip to content
        </a>
        <SunLight />
        <GridPulses />
        {/* react-hot-toast sets its colours inline, so the dark ones need !important. */}
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ className: 'dark:bg-slate-800! dark:text-slate-100!' }}
        />
        <ReduxProvider>
          <Navbar />
          <div className="pt-(--header-h) pb-[calc(var(--bottom-nav-h)+env(safe-area-inset-bottom))]">
            <main id="main" className="min-h-[60dvh]">
              {children}
            </main>
            <Footer />
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}

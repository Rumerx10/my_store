import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import './globals.css';
import 'quill/dist/quill.snow.css';
import Navbar from '@/components/shared/Navbar/Navbar';
import Footer from '@/components/shared/Footer/Footer';
import ReduxProvider from '@/redux/provider';
import { Toaster } from 'react-hot-toast';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Home | TechGen',
  description: 'Landing page',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${inter.variable} antialiased`}>
        <Toaster position="top-center" reverseOrder={false} />
        <ReduxProvider>
          <Navbar />
          <div className="pt-18 lg:pt-24 bg-gray-50">{children}</div>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}

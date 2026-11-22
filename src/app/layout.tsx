import type { Metadata } from 'next';
import { Bona_Nova, Manrope } from 'next/font/google';
import '@/styles/globals.css';
import { StoreProvider } from '@/components/StoreProvider';

const bonaNova = Bona_Nova({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-bona-nova',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TAWIOS — Author Handmade Textile Bags',
  description: 'Handcrafted non-leather textile bags in small batches.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      suppressHydrationWarning
      className={`${bonaNova.variable} ${manrope.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-white text-[#111111]">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}


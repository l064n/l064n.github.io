import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://logan.dev'),
  title: {
    default: 'Logan Matthew Phillips \u2014 Systems Integration Engineer',
    template: '%s \u00b7 logan.dev',
  },
  description:
    'Autonomous vehicle infrastructure, hardware orchestration, and local LLM compute. Oakland, CA.',
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'logan.dev',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Logan Matthew Phillips \u2014 Systems Integration Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@l064n',
    creator: '@l064n',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-background text-zinc-300 min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

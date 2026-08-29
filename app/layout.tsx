import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { MotionConfig } from 'framer-motion';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getAllProjectsMetadata } from '@/lib/projects';
import { getAllPostsMetadata } from '@/lib/mdx';

export const viewport: Viewport = {
  themeColor: '#09090b',
};

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
  metadataBase: new URL('https://l064n.github.io'),
  title: {
    default: 'Logan Matthew Phillips \u2014 Systems Integration Engineer',
    template: '%s \u00b7 l064n.github.io',
  },
  description:
    'Autonomous vehicle infrastructure, hardware orchestration, and local LLM compute. Oakland, CA.',
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'l064n.github.io',
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
  const paletteProjects = getAllProjectsMetadata().map((p) => ({
    slug: p.slug,
    title: p.title,
    categories: p.categories,
  }));

  const paletteNotes = getAllPostsMetadata().map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    tags: p.tags,
    summary: p.summary,
    excerpt: p.bodyOnly
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/[#>*_`~[\]()!|-]/g, ' ')
      .replace(/\s+/g, ' ')
      .slice(0, 1200),
  }));

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-background text-zinc-300 min-h-screen flex flex-col antialiased">
        <MotionConfig reducedMotion="user">
          <Header projects={paletteProjects} notes={paletteNotes} />
          <main className="flex-1">{children}</main>
          <Footer />
        </MotionConfig>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { GeistPixelSquare } from 'geist/font/pixel';
import { cn } from '@/lib/utils';
import { Nav } from '@/components/site/nav';
import { Footer } from '@/components/site/footer';
import { CommandPalette } from '@/components/site/command-palette';
import { allProjects } from '@/lib/projects';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://kbssrikar7.github.io'),
  // The name carries the title rather than the tagline: this page needs to be
  // the top hit for someone searching "K.B.S Srikar" after reading a CV.
  title: {
    default: 'K.B.S Srikar - Software Engineer',
    template: '%s - K.B.S Srikar',
  },
  description:
    'K.B.S Srikar. Full-stack engineering, applied ML, and embedded IoT. Kubernetes for maritime fleets, RAG systems, CNNs, and cross-platform audio tooling.',
  openGraph: {
    type: 'website',
    siteName: 'kbs',
    locale: 'en_US',
    url: 'https://kbssrikar7.github.io',
  },
  twitter: { card: 'summary_large_image', creator: '@kbss0000' },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={cn(
        'h-full antialiased font-sans',
        GeistSans.variable,
        GeistMono.variable,
        GeistPixelSquare.variable
      )}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-3 focus:py-2 focus:text-sm focus:text-background"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <CommandPalette
          projects={allProjects.map((p) => ({ slug: p.slug, title: p.title }))}
        />
      </body>
    </html>
  );
}

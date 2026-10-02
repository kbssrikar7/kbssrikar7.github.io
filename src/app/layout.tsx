import type { Metadata } from 'next';
import Script from 'next/script';
import localFont from 'next/font/local';
import { profile } from '@/data/profile';
import { cn } from '@/lib/utils';
import { Nav } from '@/components/site/nav';
import { Footer } from '@/components/site/footer';
import { CommandPalette } from '@/components/site/command-palette';
import { Oneko } from '@/components/site/oneko';
import { COUNTER_BOOTSTRAP, COUNTER_ORIGIN } from '@/components/site/visitor-count-config';
import { allProjects } from '@/lib/projects';
import './globals.css';

// The Geist fonts are self-hosted and subset (see scripts/subset-fonts.py):
// Latin only, weights 400-700. The packages' full variable files were ~70KB
// each and shared a slow connection with the JS bundle, so the real fonts
// landed seconds after first paint and the page visibly swapped.
//
// Pixel is not `geist/font/pixel` either: that module declares all five pixel
// variants, and Next preloads every one of them on every page. Only Square is
// used.
const GeistSans = localFont({
  src: '../fonts/GeistSans-Variable.woff2',
  variable: '--font-geist-sans',
  weight: '400 700',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
  adjustFontFallback: 'Arial',
});

const GeistMono = localFont({
  src: '../fonts/GeistMono-Variable.woff2',
  variable: '--font-geist-mono',
  weight: '400 700',
  fallback: ['ui-monospace', 'monospace'],
  adjustFontFallback: false,
});

const GeistPixelSquare = localFont({
  src: '../../node_modules/geist/dist/fonts/geist-pixel/GeistPixel-Square.woff2',
  variable: '--font-geist-pixel-square',
  weight: '500',
  fallback: ['Geist Mono', 'ui-monospace', 'monospace'],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.deployedUrl),
  // The name carries the title rather than the tagline: this page needs to be
  // the top hit for someone searching "K.B.S Srikar" after reading a CV.
  title: {
    default: 'K.B.S Srikar - Software Engineer',
    template: '%s - K.B.S Srikar',
  },
  description:
    'K.B.S Srikar (Kasilanka Bhoopesh Siva Srikar) is a software engineer working across full-stack development, applied ML, and embedded IoT: Kubernetes for maritime fleets, RAG systems, CNNs, and cross-platform audio tooling.',
  // GitHub Pages is canonical (see profile.siteUrl) - the Vercel mirror must
  // point back at it, or search engines see two copies of the same site.
  alternates: { canonical: profile.siteUrl },
  openGraph: {
    type: 'website',
    siteName: 'kbs',
    locale: 'en_US',
    url: profile.deployedUrl,
  },
  twitter: { card: 'summary_large_image', creator: '@kbss0000' },
  authors: [{ name: profile.name, url: profile.siteUrl }],
  creator: profile.name,
  // Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION to the token Search Console gives
  // (HTML-tag method) to verify ownership - see README.
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
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
      <head>
        <link rel="preconnect" href={COUNTER_ORIGIN} crossOrigin="anonymous" />
        {/* Starts the visitor-count request as the HTML parses, rather than
            after the bundle hydrates - see visitor-count.tsx. */}
        <script dangerouslySetInnerHTML={{ __html: COUNTER_BOOTSTRAP }} />
        {/* Marks JS as available before first paint, so CSS can hide things a
            script is about to animate in (see [data-scramble] in globals.css) without
            hiding them from no-JS visitors. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
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
        <Oneko />
        {/* No-op until NEXT_PUBLIC_UMAMI_SRC/WEBSITE_ID are set - see README. */}
        {process.env.NEXT_PUBLIC_UMAMI_SRC && process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            src={process.env.NEXT_PUBLIC_UMAMI_SRC}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            // Only the real hosts are tracked - without this, every localhost
            // dev reload and test run was recorded as a page view.
            data-domains={[...new Set([profile.siteUrl, profile.deployedUrl].map((u) => new URL(u).host))].join(',')}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}

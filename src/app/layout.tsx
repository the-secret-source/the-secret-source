import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/components/theme-provider';

const title = 'the secret source';
const description = 'supporting the artists whose works have made our works possible';
const url = 'https://the-secret-source.web.app';

export const metadata: Metadata = {
  title: title,
  description: description,
  keywords: ['open source music', 'music datasets', 'artist discovery', 'support artists', 'creative commons music'],
  authors: [{ name: 'Karn Watcharasupat', url: 'https://github.com/kwatcharasupat' }],
  metadataBase: new URL(url),
  openGraph: {
    type: 'website',
    url: '/',
    title: title,
    description: description,
    images: [
      {
        url: `https://placehold.co/1200x630.png`,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: title,
    description: description,
    images: [`https://placehold.co/1200x630.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet"></link>
      </head>
      <body className="font-body antialiased" suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            {children}
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

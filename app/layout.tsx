import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '礼 Rei - Admin',
  description: '献杯管理システム',
  openGraph: {
    title: '礼 Rei - 遠隔献杯システム',
    description: '遠方からでもお気持ちを届けられる、新しい献杯のかたち。葬儀社様向け献杯管理システム。',
    type: 'website',
    url: 'https://smartkenpai.com',
    siteName: 'Rei - 遠隔献杯システム',
    locale: 'ja_JP',
    images: [
      {
        url: 'https://smartkenpai.com/og-default.jpg',
        width: 1200,
        height: 630,
        alt: '礼 Rei - 遠隔献杯システム',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '礼 Rei - 遠隔献杯システム',
    description: '遠方からでもお気持ちを届けられる、新しい献杯のかたち。',
    images: ['https://smartkenpai.com/og-default.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" style={{ background: '#0a0a0a' }}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;500;600&family=Shippori+Mincho:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            html, body {
              background: #0a0a0a !important;
            }
            body {
              visibility: hidden;
            }
            body.loaded {
              visibility: visible;
            }
          `
        }} />
        <script dangerouslySetInnerHTML={{
          __html: `
            if (document.fonts) {
              document.fonts.ready.then(function() {
                document.body.classList.add('loaded');
              });
            } else {
              document.body.classList.add('loaded');
            }
            setTimeout(function() {
              document.body.classList.add('loaded');
            }, 100);
          `
        }} />
      </head>
      <body style={{ background: '#0a0a0a', margin: 0 }}>{children}</body>
    </html>
  );
}
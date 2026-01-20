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
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;500;600&family=Shippori+Mincho:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            #page-loader {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: #0a0a0a;
              z-index: 99999;
              transition: opacity 0.3s ease;
            }
            #page-loader.hide {
              opacity: 0;
              pointer-events: none;
            }
          `
        }} />
      </head>
      <body style={{ margin: 0 }}>
        <div id="page-loader" />
        {children}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var loader = document.getElementById('page-loader');
              function hideLoader() {
                if (loader) {
                  loader.classList.add('hide');
                  setTimeout(function() {
                    loader.style.display = 'none';
                  }, 300);
                }
              }
              if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(hideLoader);
              }
              setTimeout(hideLoader, 150);
            })();
          `
        }} />
      </body>
    </html>
  );
}
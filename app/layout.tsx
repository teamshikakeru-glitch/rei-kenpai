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
        {/* FOUC対策: 最初にクリティカルCSSをインライン化 */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body {
                background: #0d3d2d;
              }
              #fouc-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: #0d3d2d;
                z-index: 999999;
                pointer-events: none;
                transition: opacity 0.2s ease-out;
              }
              .fouc-ready #fouc-overlay {
                opacity: 0;
                pointer-events: none;
              }
            `,
          }}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;500;600&family=Shippori+Mincho:wght@400;500;600&family=Noto+Sans+JP:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* FOUC対策: 初期オーバーレイ（HTMLと同時に読み込まれる） */}
        <div id="fouc-overlay" aria-hidden="true" />
        {children}
        {/* FOUC対策: フォントとCSSが読み込まれたらオーバーレイを非表示 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function showPage() {
                  document.documentElement.classList.add('fouc-ready');
                }
                if (document.fonts && document.fonts.ready) {
                  document.fonts.ready.then(showPage);
                } else {
                  setTimeout(showPage, 150);
                }
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <head>
        <title>エラー | Rei 献杯システム</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <div style={styles.container}>
          <div style={styles.content}>
            {/* 装飾ライン */}
            <div style={styles.decorativeLine} />
            
            {/* エラーアイコン */}
            <div style={styles.iconContainer}>
              <svg
                width="72"
                height="72"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#c9a227"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            
            {/* タイトル */}
            <h1 style={styles.title}>システムエラー</h1>
            
            {/* 説明文 */}
            <p style={styles.description}>
              大変申し訳ございません。
              <br />
              システムに重大なエラーが発生しました。
              <br />
              <br />
              しばらく時間をおいてから再度アクセスしてください。
              <br />
              問題が解決しない場合は、お問い合わせください。
            </p>
            
            {/* ボタン */}
            <div style={styles.buttonContainer}>
              <button onClick={reset} style={styles.primaryButton}>
                再読み込み
              </button>
              <a href="/" style={styles.secondaryButton}>
                トップページへ
              </a>
            </div>
            
            {/* お問い合わせ */}
            <div style={styles.contactInfo}>
              <p style={styles.contactText}>
                お問い合わせ: info@shikakeru.co.jp
              </p>
            </div>
            
            {/* 装飾ライン */}
            <div style={styles.decorativeLine} />
          </div>
          
          {/* フッター */}
          <p style={styles.footer}>Rei 献杯システム © 2026 SHIKAKERU Inc.</p>
        </div>
      </body>
    </html>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0d4d3a 0%, #1a6b52 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: '"Noto Sans JP", "Hiragino Sans", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif',
  },
  content: {
    textAlign: 'center',
    maxWidth: '500px',
  },
  decorativeLine: {
    width: '60px',
    height: '3px',
    background: '#c9a227',
    margin: '0 auto 32px auto',
  },
  iconContainer: {
    marginBottom: '24px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '500',
    color: '#ffffff',
    margin: '0 0 20px 0',
    letterSpacing: '0.05em',
  },
  description: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: '1.8',
    margin: '0 0 32px 0',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  primaryButton: {
    display: 'inline-block',
    padding: '14px 32px',
    background: '#c9a227',
    color: '#0d4d3a',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(201, 162, 39, 0.3)',
  },
  secondaryButton: {
    display: 'inline-block',
    padding: '14px 32px',
    background: 'transparent',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease',
  },
  contactInfo: {
    background: 'rgba(0, 0, 0, 0.15)',
    borderRadius: '8px',
    padding: '12px 20px',
    marginBottom: '32px',
  },
  contactText: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.7)',
    margin: '0',
  },
  footer: {
    position: 'absolute',
    bottom: '24px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '12px',
    margin: '0',
  },
};
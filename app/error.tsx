'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // エラーをログサービスに送信（必要に応じて実装）
    console.error('Error:', error);
  }, [error]);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* 装飾ライン */}
        <div style={styles.decorativeLine} />
        
        {/* エラーアイコン */}
        <div style={styles.iconContainer}>
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c9a227"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        
        {/* タイトル */}
        <h1 style={styles.title}>エラーが発生しました</h1>
        
        {/* 説明文 */}
        <p style={styles.description}>
          申し訳ございません。予期せぬエラーが発生しました。
          <br />
          しばらく時間をおいて再度お試しください。
        </p>
        
        {/* エラー詳細（開発環境用） */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div style={styles.errorDetail}>
            <p style={styles.errorDetailTitle}>エラー詳細:</p>
            <code style={styles.errorCode}>{error.message}</code>
          </div>
        )}
        
        {/* ボタン */}
        <div style={styles.buttonContainer}>
          <button onClick={reset} style={styles.primaryButton}>
            もう一度試す
          </button>
          <a href="/" style={styles.secondaryButton}>
            トップページへ
          </a>
        </div>
        
        {/* 装飾ライン */}
        <div style={styles.decorativeLine} />
      </div>
      
      {/* フッター */}
      <p style={styles.footer}>Rei 献杯システム</p>
    </div>
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
    fontSize: '28px',
    fontWeight: '500',
    color: '#ffffff',
    margin: '0 0 16px 0',
    letterSpacing: '0.05em',
  },
  description: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: '1.8',
    margin: '0 0 24px 0',
  },
  errorDetail: {
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
    textAlign: 'left',
  },
  errorDetailTitle: {
    fontSize: '12px',
    color: '#c9a227',
    margin: '0 0 8px 0',
  },
  errorCode: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.7)',
    wordBreak: 'break-all',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '32px',
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
  footer: {
    position: 'absolute',
    bottom: '24px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '12px',
    margin: '0',
  },
};
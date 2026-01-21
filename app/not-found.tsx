import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* 装飾ライン */}
        <div style={styles.decorativeLine} />
        
        {/* エラーコード */}
        <h1 style={styles.errorCode}>404</h1>
        
        {/* タイトル */}
        <h2 style={styles.title}>ページが見つかりません</h2>
        
        {/* 説明文 */}
        <p style={styles.description}>
          お探しのページは移動または削除された可能性があります。
          <br />
          URLをご確認いただくか、トップページからお探しください。
        </p>
        
        {/* ボタン */}
        <div style={styles.buttonContainer}>
          <Link href="/" style={styles.primaryButton}>
            トップページへ戻る
          </Link>
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
  errorCode: {
    fontSize: '120px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0',
    lineHeight: '1',
    letterSpacing: '0.05em',
    textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  },
  title: {
    fontSize: '24px',
    fontWeight: '500',
    color: '#c9a227',
    margin: '24px 0 16px 0',
    letterSpacing: '0.1em',
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
    marginBottom: '32px',
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
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(201, 162, 39, 0.3)',
  },
  footer: {
    position: 'absolute',
    bottom: '24px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '12px',
    margin: '0',
  },
};
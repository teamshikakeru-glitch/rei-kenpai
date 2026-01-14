'use client';

interface SessionWarningProps {
  remainingTime: number;
  onExtend: () => void;
  onLogout: () => void;
}

export default function SessionWarning({ remainingTime, onExtend, onLogout }: SessionWarningProps) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        background: 'linear-gradient(160deg, #1a1f2e 0%, #2a3040 100%)',
        border: '1px solid rgba(201, 162, 39, 0.3)',
        borderRadius: '24px',
        padding: '40px',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: 'rgba(201, 162, 39, 0.2)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: '28px'
        }}>
          ⏱
        </div>
        
        <h2 style={{
          color: '#fff',
          fontSize: '20px',
          fontWeight: '500',
          marginBottom: '12px'
        }}>
          セッションがまもなく終了します
        </h2>
        
        <p style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '14px',
          lineHeight: '1.8',
          marginBottom: '24px'
        }}>
          セキュリティのため、あと <strong style={{ color: '#c9a227' }}>{remainingTime}分</strong> で<br />
          自動的にログアウトされます。
        </p>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onExtend}
            style={{
              flex: 1,
              padding: '14px 20px',
              background: 'linear-gradient(135deg, #c9a227 0%, #a08020 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            続ける
          </button>
          <button
            onClick={onLogout}
            style={{
              flex: 1,
              padding: '14px 20px',
              background: 'transparent',
              color: 'rgba(255, 255, 255, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            ログアウト
          </button>
        </div>
      </div>
    </div>
  );
}
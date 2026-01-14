'use client';

interface KenpaiPreviewProps {
  deceasedName: string;
  photoPreview: string | null;
  familyMessage: string;
  useDefaultMessage: boolean;
}

export default function KenpaiPreview({ 
  deceasedName, 
  photoPreview, 
  familyMessage, 
  useDefaultMessage 
}: KenpaiPreviewProps) {
  const defaultMessage = '故人様のご生前は格別のご厚情を賜り\n心より御礼申し上げます';
  const displayMessage = useDefaultMessage || !familyMessage ? defaultMessage : familyMessage;

  return (
    <div style={{ 
      background: 'linear-gradient(180deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div style={{
        padding: '12px 16px',
        background: 'rgba(201,162,39,0.1)',
        borderBottom: '1px solid rgba(201,162,39,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span style={{ fontSize: '11px', color: '#c9a227', letterSpacing: '0.1em', fontWeight: 500 }}>
          📱 プレビュー
        </span>
        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
          実際の表示イメージ
        </span>
      </div>

      <div style={{ padding: '24px 20px', minHeight: '400px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '28px', 
              height: '28px', 
              background: 'linear-gradient(135deg, #c9a227, #8b6914)', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'white', 
              fontSize: '12px',
              fontWeight: 600
            }}>礼</div>
            <span style={{ fontSize: '12px', fontWeight: 500, color: 'white', letterSpacing: '0.1em' }}>Rei</span>
          </div>
          <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em' }}>KENPAI</span>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ 
            fontSize: '9px', 
            color: '#c9a227', 
            letterSpacing: '0.3em', 
            marginBottom: '20px',
            fontWeight: 500
          }}>
            ✦ 追 悼 ✦
          </p>

          {photoPreview ? (
            <div style={{
              width: '100px',
              height: '130px',
              margin: '0 auto 20px',
              position: 'relative',
              borderRadius: '6px',
              overflow: 'hidden',
              border: '3px solid #c9a227',
              boxShadow: '0 0 20px rgba(201, 162, 39, 0.3)'
            }}>
              <img 
                src={photoPreview} 
                alt="" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
          ) : (
            <div style={{
              width: '100px',
              height: '130px',
              margin: '0 auto 20px',
              borderRadius: '6px',
              border: '2px dashed rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.3)',
              fontSize: '10px'
            }}>
              写真なし
            </div>
          )}

          <h1 style={{ 
            fontSize: '18px', 
            fontWeight: 300, 
            color: 'white', 
            marginBottom: '20px',
            letterSpacing: '0.1em'
          }}>
            故 <span style={{ fontWeight: 500 }}>{deceasedName || '〇〇 〇〇'}</span> 様
          </h1>

          <div style={{ 
            padding: '20px 16px', 
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px'
          }}>
            <p style={{ 
              color: 'rgba(255,255,255,0.7)', 
              lineHeight: 2, 
              fontSize: '11px', 
              whiteSpace: 'pre-line' 
            }}>
              {displayMessage}
            </p>
            {!useDefaultMessage && familyMessage && (
              <p style={{ marginTop: '16px', fontSize: '10px', color: '#c9a227' }}>— ご遺族より</p>
            )}
          </div>
        </div>

        <div style={{ 
          marginTop: '24px',
          padding: '20px 16px', 
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px'
        }}>
          <p style={{ 
            fontSize: '12px', 
            color: 'white', 
            marginBottom: '12px', 
            textAlign: 'center',
            letterSpacing: '0.05em'
          }}>
            献杯のお申し込み
          </p>
          
          <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
            {['¥5,000', '¥10,000', '¥30,000'].map((amount, i) => (
              <div 
                key={i}
                style={{
                  flex: 1,
                  padding: '12px 8px',
                  border: i === 1 ? '1px solid #c9a227' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  background: i === 1 ? 'rgba(201,162,39,0.1)' : 'rgba(255,255,255,0.03)',
                  textAlign: 'center'
                }}
              >
                <p style={{ fontSize: '11px', fontWeight: 600, color: i === 1 ? '#c9a227' : 'white' }}>{amount}</p>
              </div>
            ))}
          </div>

          <div style={{
            padding: '12px',
            background: 'linear-gradient(135deg, #c9a227 0%, #a08020 100%)',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '11px', color: 'white', fontWeight: 500 }}>お支払いへ進む</p>
          </div>
        </div>
      </div>
    </div>
  );
}
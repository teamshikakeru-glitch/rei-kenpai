// ============================================
// 献杯ページ（app/[slug]/page.tsx）への追加コード
// メッセージのみ送信機能
// ============================================

// === 1. stateに追加 ===
const [activeTab, setActiveTab] = useState<'donation' | 'message'>('donation');
const [messageOnly, setMessageOnly] = useState({
  name: '',
  nameKana: '',
  message: '',
  relationship: '',
  isAnonymous: false,
});
const [messageSending, setMessageSending] = useState(false);
const [messageSent, setMessageSent] = useState(false);

// === 2. メッセージ送信関数 ===
const handleSendMessage = async () => {
  if (!messageOnly.name.trim()) {
    alert('お名前を入力してください');
    return;
  }
  if (!messageOnly.message.trim()) {
    alert('メッセージを入力してください');
    return;
  }

  setMessageSending(true);
  
  try {
    const response = await fetch('/api/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: project.id,
        donorName: messageOnly.name,
        donorNameKana: messageOnly.nameKana,
        message: messageOnly.message,
        relationship: messageOnly.relationship,
        isAnonymous: messageOnly.isAnonymous,
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      setMessageSent(true);
      // フォームリセット
      setMessageOnly({
        name: '',
        nameKana: '',
        message: '',
        relationship: '',
        isAnonymous: false,
      });
    } else {
      alert(data.error || 'エラーが発生しました');
    }
  } catch (error) {
    console.error('Send message error:', error);
    alert('エラーが発生しました');
  } finally {
    setMessageSending(false);
  }
};

// === 3. JSX（献杯フォームの上または中に追加） ===

{/* タブ切り替え */}
<div style={{
  display: 'flex',
  gap: '0',
  marginBottom: '1.5rem',
  borderRadius: '12px',
  overflow: 'hidden',
  border: '2px solid #2d5a47',
}}>
  <button
    onClick={() => setActiveTab('donation')}
    style={{
      flex: 1,
      padding: '1rem',
      border: 'none',
      background: activeTab === 'donation' ? '#2d5a47' : 'white',
      color: activeTab === 'donation' ? 'white' : '#2d5a47',
      fontWeight: 600,
      fontSize: '0.95rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }}
  >
    🙏 献杯する（お金を送る）
  </button>
  <button
    onClick={() => setActiveTab('message')}
    style={{
      flex: 1,
      padding: '1rem',
      border: 'none',
      background: activeTab === 'message' ? '#2d5a47' : 'white',
      color: activeTab === 'message' ? 'white' : '#2d5a47',
      fontWeight: 600,
      fontSize: '0.95rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }}
  >
    💌 メッセージのみ
  </button>
</div>

{/* メッセージのみタブ */}
{activeTab === 'message' && (
  <div style={{
    background: 'white',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  }}>
    {messageSent ? (
      // 送信完了画面
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💐</div>
        <h3 style={{ color: '#2d5a47', marginBottom: '0.5rem' }}>
          メッセージを送信しました
        </h3>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          ご遺族にあなたの想いが届きます
        </p>
        <button
          onClick={() => setMessageSent(false)}
          style={{
            padding: '0.75rem 2rem',
            background: '#2d5a47',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          別のメッセージを送る
        </button>
      </div>
    ) : (
      // 入力フォーム
      <>
        <div style={{
          background: '#f0f7f4',
          padding: '1rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          textAlign: 'center',
        }}>
          <p style={{ margin: 0, color: '#2d5a47', fontSize: '0.9rem' }}>
            💌 お金は送らず、メッセージのみをお届けします
          </p>
        </div>

        {/* お名前 */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 600,
            color: '#333',
          }}>
            お名前 <span style={{ color: '#dc3545' }}>*</span>
          </label>
          <input
            type="text"
            value={messageOnly.name}
            onChange={(e) => setMessageOnly({ ...messageOnly, name: e.target.value })}
            placeholder="山田 太郎"
            style={{
              width: '100%',
              padding: '0.875rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem',
            }}
          />
        </div>

        {/* お名前（かな） */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 600,
            color: '#333',
          }}>
            お名前（かな）
          </label>
          <input
            type="text"
            value={messageOnly.nameKana}
            onChange={(e) => setMessageOnly({ ...messageOnly, nameKana: e.target.value })}
            placeholder="やまだ たろう"
            style={{
              width: '100%',
              padding: '0.875rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem',
            }}
          />
        </div>

        {/* 故人との関係 */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 600,
            color: '#333',
          }}>
            故人との関係
          </label>
          <select
            value={messageOnly.relationship}
            onChange={(e) => setMessageOnly({ ...messageOnly, relationship: e.target.value })}
            style={{
              width: '100%',
              padding: '0.875rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem',
              background: 'white',
            }}
          >
            <option value="">選択してください</option>
            <option value="友人">友人</option>
            <option value="同僚">同僚</option>
            <option value="親族">親族</option>
            <option value="知人">知人</option>
            <option value="ご近所">ご近所</option>
            <option value="その他">その他</option>
          </select>
        </div>

        {/* メッセージ */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 600,
            color: '#333',
          }}>
            メッセージ <span style={{ color: '#dc3545' }}>*</span>
          </label>
          <textarea
            value={messageOnly.message}
            onChange={(e) => setMessageOnly({ ...messageOnly, message: e.target.value })}
            placeholder="ご冥福をお祈りいたします..."
            rows={5}
            style={{
              width: '100%',
              padding: '0.875rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem',
              resize: 'vertical',
            }}
          />
        </div>

        {/* 匿名希望 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
          }}>
            <input
              type="checkbox"
              checked={messageOnly.isAnonymous}
              onChange={(e) => setMessageOnly({ ...messageOnly, isAnonymous: e.target.checked })}
              style={{ width: '18px', height: '18px' }}
            />
            <span style={{ color: '#666' }}>匿名で送る</span>
          </label>
        </div>

        {/* 送信ボタン */}
        <button
          onClick={handleSendMessage}
          disabled={messageSending}
          style={{
            width: '100%',
            padding: '1rem',
            background: messageSending ? '#ccc' : 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: 700,
            cursor: messageSending ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {messageSending ? '送信中...' : '💌 メッセージを送る'}
        </button>
      </>
    )}
  </div>
)}

{/* 献杯タブ（既存のフォーム） */}
{activeTab === 'donation' && (
  // 既存の献杯フォームをここに
)}
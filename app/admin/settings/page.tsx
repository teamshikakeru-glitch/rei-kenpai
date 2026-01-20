'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { useSession } from '@/lib/supabase/hooks/useSession';
import SessionWarning from '@/components/SessionWarning';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function SettingsContent() {
  const { isAuthenticated, isLoading: sessionLoading, showWarning, remainingTime, logout, extendSession } = useSession();
  const [funeralHomeId, setFuneralHomeId] = useState<string | null>(null);
  const [funeralHomeName, setFuneralHomeName] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [stripeStatus, setStripeStatus] = useState<{ connected: boolean; onboarding_complete: boolean } | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [emailStep, setEmailStep] = useState<'view' | 'form' | 'verify'>('view');
  const [newEmail, setNewEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (sessionLoading) return;
    if (!isAuthenticated) {
      router.replace('/');
      return;
    }

    const fetchData = async () => {
      const storedId = sessionStorage.getItem('funeral_home_id');
      const storedName = sessionStorage.getItem('funeral_home_name');
      if (!storedId || !storedName) {
        router.replace('/');
        return;
      }
      setFuneralHomeId(storedId);
      setFuneralHomeName(storedName);
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data } = await supabase.from('funeral_homes').select('email').eq('id', storedId).single();
      if (data) setCurrentEmail(data.email);
      await checkStripeStatus(storedId);
      setLoading(false);
    };
    fetchData();
  }, [router, isAuthenticated, sessionLoading]);

  useEffect(() => {
    const stripeParam = searchParams.get('stripe');
    if (stripeParam === 'success' && funeralHomeId) checkStripeStatus(funeralHomeId);
  }, [searchParams, funeralHomeId]);

  const checkStripeStatus = async (homeId: string) => {
    try {
      const res = await fetch('/api/stripe/status', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ funeral_home_id: homeId }) });
      setStripeStatus(await res.json());
    } catch (e) { console.error(e); }
  };

  const handleStripeConnect = async () => {
    if (!funeralHomeId) return;
    setStripeLoading(true);
    try {
      const res = await fetch('/api/stripe/connect', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ funeral_home_id: funeralHomeId }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || 'エラーが発生しました');
    } catch (e) { console.error(e); alert('エラーが発生しました'); }
    setStripeLoading(false);
  };

  const handleSendEmailCode = async () => {
    setEmailError('');
    setEmailSuccess('');
    if (!newEmail || !newEmail.includes('@')) { setEmailError('有効なメールアドレスを入力してください'); return; }
    if (newEmail === currentEmail) { setEmailError('現在のメールアドレスと同じです'); return; }
    setEmailLoading(true);
    try {
      const res = await fetch('/api/email-change/send-code', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ funeral_home_id: funeralHomeId, new_email: newEmail }) });
      const data = await res.json();
      if (!res.ok) { setEmailError(data.error || 'エラーが発生しました'); }
      else { setEmailStep('verify'); setEmailSuccess('認証コードを送信しました'); }
    } catch { setEmailError('エラーが発生しました'); }
    setEmailLoading(false);
  };

  const handleVerifyEmailCode = async () => {
    setEmailError('');
    setEmailSuccess('');
    if (!emailCode || emailCode.length !== 6) { setEmailError('6桁の認証コードを入力してください'); return; }
    setEmailLoading(true);
    try {
      const res = await fetch('/api/email-change/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ funeral_home_id: funeralHomeId, new_email: newEmail, code: emailCode }) });
      const data = await res.json();
      if (!res.ok) { setEmailError(data.error || 'エラーが発生しました'); }
      else { setCurrentEmail(newEmail); setNewEmail(''); setEmailCode(''); setEmailStep('view'); setEmailSuccess('メールアドレスを変更しました'); }
    } catch { setEmailError('エラーが発生しました'); }
    setEmailLoading(false);
  };

  const handleLogout = () => { logout(); };

  if (sessionLoading || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #faf8f5 0%, #f5f0e8 100%)' }}>
        <div style={{ width: '48px', height: '48px', border: '3px solid #e8e4dc', borderTopColor: '#c9a227', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f0' }}>
      <style jsx>{`
        .mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 56px;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          z-index: 1000;
          align-items: center;
          justify-content: space-between;
          padding: 0 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .mobile-menu-btn {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
        }
        .mobile-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: white;
          text-decoration: none;
        }
        .mobile-logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #c9a227, #d4af37);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
        }
        .mobile-nav {
          display: none;
          position: fixed;
          top: 56px;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%);
          z-index: 999;
          flex-direction: column;
          padding: 1rem;
        }
        .mobile-nav.open {
          display: flex;
        }
        .mobile-nav-link {
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          padding: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          font-size: 0.95rem;
        }
        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          color: #c9a227;
          background: rgba(255,255,255,0.05);
        }
        .mobile-nav-logout {
          color: #f87171;
          padding: 1rem;
          font-size: 0.95rem;
          cursor: pointer;
          background: none;
          border: none;
          text-align: left;
          width: 100%;
        }
        .desktop-sidebar {
          width: 240px;
          background: linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%);
          padding: 24px 16px;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
        }
        .main-content {
          flex: 1;
          margin-left: 240px;
          padding: 32px;
        }
        @media (max-width: 768px) {
          .mobile-header {
            display: flex;
          }
          .desktop-sidebar {
            display: none;
          }
          .main-content {
            margin-left: 0;
            padding: 16px;
            padding-top: 72px;
          }
        }
      `}</style>

      {showWarning && (
        <SessionWarning remainingTime={remainingTime} onExtend={extendSession} onLogout={handleLogout} />
      )}

      {/* モバイルヘッダー */}
      <div className="mobile-header">
        <a href="/admin" className="mobile-logo">
          <div className="mobile-logo-icon">礼</div>
          <span style={{ fontWeight: 500, fontSize: '14px' }}>Rei</span>
        </a>
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* モバイルナビ */}
      <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="/admin" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>ホーム</a>
        <a href="/admin/payments" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>ご入金管理</a>
        <a href="/admin/settings" className="mobile-nav-link active" onClick={() => setMobileMenuOpen(false)}>入金口座連携</a>
        <div style={{ marginTop: 'auto', padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '8px' }}>ログイン中: {funeralHomeName}</p>
          <button className="mobile-nav-logout" onClick={handleLogout}>ログアウト</button>
        </div>
      </div>

      {/* デスクトップサイドバー */}
      <aside className="desktop-sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 24 }}>
          <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #c9a227, #d4af37)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 20, fontWeight: 600 }}>礼</div>
          <div>
            <div style={{ color: 'white', fontSize: 20, fontWeight: 600 }}>Rei</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>献杯管理システム</div>
          </div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: '0.1em', padding: '8px 12px' }}>メインメニュー</div>
          <a href="/admin" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: 12, borderRadius: 8, fontSize: 14 }}>ホーム</a>
          <a href="/admin/payments" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: 12, borderRadius: 8, fontSize: 14 }}>ご入金管理</a>
          <a href="/admin/settings" style={{ color: '#c9a227', textDecoration: 'none', padding: 12, borderRadius: 8, fontSize: 14, background: 'rgba(201,162,39,0.15)' }}>入金口座連携</a>
        </nav>
        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '10px' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', marginBottom: '2px' }}>ログイン中</p>
            <p style={{ color: 'white', fontSize: '13px', fontWeight: '500' }}>{funeralHomeName}</p>
          </div>
          <button onClick={handleLogout} style={{ width: '100%', padding: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 13 }}>ログアウト</button>
        </div>
      </aside>

      <main className="main-content">
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#1a1a1a', marginBottom: 8 }}>入金口座連携</h1>
        <p style={{ fontSize: 14, color: '#666', marginBottom: 32 }}>献杯金を受け取るための設定</p>

        {/* Stripe Connect */}
        <div style={{ background: 'white', borderRadius: 16, padding: 32, marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a', marginBottom: 8 }}>🏦 銀行口座の連携（Stripe Connect）</h2>
          <p style={{ fontSize: 13, color: '#666', marginBottom: 24, lineHeight: 1.7 }}>
            献杯金を直接受け取るために、Stripeアカウントを連携してください。<br />
            連携後、献杯があると自動的にご登録の銀行口座に入金されます。
          </p>

          {stripeStatus?.onboarding_complete ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, borderRadius: 10, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <span style={{ fontSize: 24 }}>✓</span>
              <div>
                <div style={{ fontWeight: 600, color: '#166534' }}>連携完了</div>
                <div style={{ fontSize: 12, color: '#166534' }}>銀行口座が正常に連携されています。献杯金は自動で入金されます。</div>
              </div>
            </div>
          ) : stripeStatus?.connected ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, borderRadius: 10, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', marginBottom: 16 }}>
                <span style={{ fontSize: 24 }}>⚠️</span>
                <div>
                  <div style={{ fontWeight: 600, color: '#92400e' }}>設定を完了してください</div>
                  <div style={{ fontSize: 12, color: '#92400e' }}>銀行口座の設定が完了していません</div>
                </div>
              </div>
              <button onClick={handleStripeConnect} disabled={stripeLoading} style={{ padding: '14px 24px', background: '#635bff', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer', opacity: stripeLoading ? 0.6 : 1 }}>
                {stripeLoading ? '処理中...' : '設定を続ける →'}
              </button>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, borderRadius: 10, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', marginBottom: 16 }}>
                <span style={{ fontSize: 24 }}>🏦</span>
                <div>
                  <div style={{ fontWeight: 600, color: '#92400e' }}>未連携</div>
                  <div style={{ fontSize: 12, color: '#92400e' }}>銀行口座を連携して献杯金を受け取れるようにしましょう</div>
                </div>
              </div>
              <button onClick={handleStripeConnect} disabled={stripeLoading} style={{ padding: '14px 24px', background: '#635bff', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer', opacity: stripeLoading ? 0.6 : 1 }}>
                {stripeLoading ? '処理中...' : '🏦 銀行口座を連携する'}
              </button>
            </div>
          )}

          <div style={{ background: '#f8f8f8', borderRadius: 10, padding: 16, marginTop: 24 }}>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 12, fontWeight: 500 }}>手数料について</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#333', padding: '6px 0' }}><span>Stripe決済手数料</span><span>3.6%</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#333', padding: '6px 0' }}><span>システム利用料</span><span>8%</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#1a1a1a', padding: '8px 0', borderTop: '1px solid #e0e0e0', marginTop: 8, fontWeight: 600 }}><span>お受け取り額</span><span>約88.4%</span></div>
            <p style={{ fontSize: 11, color: '#888', marginTop: 8 }}>例：10,000円の献杯 → 約8,840円がお振込みされます</p>
          </div>

          <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 10, padding: 16, marginTop: 16 }}>
            <p style={{ fontSize: 12, color: '#856404', margin: 0 }}>
              ⚠️ <strong>ご注意</strong>：Stripe連携には本人確認書類（運転免許証等）と銀行口座情報が必要です。<br />
              入力情報は暗号化され、Stripeにより安全に管理されます。
            </p>
          </div>
        </div>

        {/* Email */}
        <div style={{ background: 'white', borderRadius: 16, padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a', marginBottom: 24 }}>✉️ メールアドレス</h2>
          
          {emailError && <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#dc2626', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontSize: 13 }}>{emailError}</div>}
          {emailSuccess && <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#16a34a', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontSize: 13 }}>{emailSuccess}</div>}

          {emailStep === 'view' && (
            <div>
              <div style={{ background: '#f8f8f8', border: '1px solid #e5e5e5', borderRadius: 10, padding: '14px 16px', marginBottom: 16 }}>
                <p style={{ fontSize: 10, color: '#999', marginBottom: 4, letterSpacing: '0.05em' }}>現在のメールアドレス</p>
                <p style={{ fontSize: 15, color: '#1a1a1a', fontWeight: 500 }}>{currentEmail}</p>
              </div>
              <button onClick={() => { setEmailStep('form'); setEmailError(''); setEmailSuccess(''); }} style={{ padding: '10px 20px', background: 'white', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 13, color: '#666', cursor: 'pointer' }}>
                メールアドレスを変更
              </button>
            </div>
          )}

          {emailStep === 'form' && (
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#666', marginBottom: 8 }}>新しいメールアドレス</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="new-email@example.com"
                style={{ width: '100%', padding: '14px 16px', border: '1px solid #e0e0e0', borderRadius: 10, fontSize: 15, marginBottom: 16, boxSizing: 'border-box' }}
              />
              <p style={{ fontSize: 11, color: '#888', marginBottom: 16 }}>
                ※ 半角英数字と記号（@._-）のみ使用できます
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button onClick={handleSendEmailCode} disabled={emailLoading} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #c9a227, #d4af37)', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer', opacity: emailLoading ? 0.6 : 1 }}>
                  {emailLoading ? '送信中...' : '認証コードを送信'}
                </button>
                <button onClick={() => { setEmailStep('view'); setNewEmail(''); setEmailError(''); }} style={{ padding: '12px 24px', background: 'white', border: '1px solid #e0e0e0', borderRadius: 10, fontSize: 14, color: '#666', cursor: 'pointer' }}>
                  キャンセル
                </button>
              </div>
            </div>
          )}

          {emailStep === 'verify' && (
            <div>
              <p style={{ fontSize: 14, color: '#666', marginBottom: 16, textAlign: 'center' }}>
                <strong style={{ color: '#c9a227' }}>{newEmail}</strong> に認証コードを送信しました
              </p>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#666', marginBottom: 8 }}>認証コード（6桁）</label>
              <input
                type="text"
                value={emailCode}
                onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                style={{ width: '100%', padding: '14px 16px', border: '1px solid #e0e0e0', borderRadius: 10, fontSize: 24, textAlign: 'center', letterSpacing: '0.5em', fontFamily: 'monospace', marginBottom: 16, boxSizing: 'border-box' }}
              />
              <p style={{ fontSize: 11, color: '#888', marginBottom: 16 }}>
                ※ 認証コードは10分間有効です
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button onClick={handleVerifyEmailCode} disabled={emailLoading || emailCode.length !== 6} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #c9a227, #d4af37)', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer', opacity: (emailLoading || emailCode.length !== 6) ? 0.6 : 1 }}>
                  {emailLoading ? '確認中...' : 'メールアドレスを変更'}
                </button>
                <button onClick={() => { setEmailStep('form'); setEmailCode(''); setEmailError(''); }} style={{ padding: '12px 24px', background: 'white', border: '1px solid #e0e0e0', borderRadius: 10, fontSize: 14, color: '#666', cursor: 'pointer' }}>
                  戻る
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #faf8f5 0%, #f5f0e8 100%)' }}>
        <div style={{ width: '48px', height: '48px', border: '3px solid #e8e4dc', borderTopColor: '#c9a227', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}
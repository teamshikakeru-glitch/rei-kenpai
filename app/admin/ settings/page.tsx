'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useSession } from '@/lib/supabase/hooks/useSession';
import SessionWarning from '@/components/SessionWarning';

function SettingsContent() {
  const { isAuthenticated, isLoading: sessionLoading, showWarning, remainingTime, logout, extendSession } = useSession();
  const [funeralHomeId, setFuneralHomeId] = useState<string | null>(null);
  const [funeralHomeName, setFuneralHomeName] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [emailStep, setEmailStep] = useState<'form' | 'verify'>('form');
  const [newEmail, setNewEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  const [stripeStatus, setStripeStatus] = useState<{
    connected: boolean;
    onboarding_complete: boolean;
  } | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

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

      const { data } = await supabase
        .from('funeral_homes')
        .select('email')
        .eq('id', storedId)
        .single();
      
      if (data) {
        setCurrentEmail(data.email);
      }

      await checkStripeStatus(storedId);
      
      setLoading(false);
    };

    fetchData();
  }, [router, isAuthenticated, sessionLoading, supabase]);

  useEffect(() => {
    const stripeParam = searchParams.get('stripe');
    if (stripeParam === 'success' && funeralHomeId) {
      checkStripeStatus(funeralHomeId);
    }
  }, [searchParams, funeralHomeId]);

  const checkStripeStatus = async (homeId: string) => {
    try {
      const res = await fetch('/api/stripe/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ funeral_home_id: homeId })
      });
      const data = await res.json();
      setStripeStatus(data);
    } catch (error) {
      console.error('Stripe status error:', error);
    }
  };

  const handleStripeConnect = async () => {
    if (!funeralHomeId) return;
    setStripeLoading(true);

    try {
      const res = await fetch('/api/stripe/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ funeral_home_id: funeralHomeId })
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('エラーが発生しました');
      }
    } catch (error) {
      console.error('Stripe connect error:', error);
      alert('エラーが発生しました');
    }
    setStripeLoading(false);
  };

  const handleLogout = () => {
    logout();
  };

  const handleSendEmailCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setEmailSuccess('');
    setEmailLoading(true);

    if (!newEmail || !newEmail.includes('@')) {
      setEmailError('有効なメールアドレスを入力してください');
      setEmailLoading(false);
      return;
    }

    if (newEmail === currentEmail) {
      setEmailError('現在のメールアドレスと同じです');
      setEmailLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/email-change/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          funeral_home_id: funeralHomeId,
          new_email: newEmail 
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setEmailError(data.error || 'エラーが発生しました');
        setEmailLoading(false);
        return;
      }

      setEmailStep('verify');
      setEmailSuccess('認証コードを送信しました');
    } catch {
      setEmailError('エラーが発生しました');
    }
    setEmailLoading(false);
  };

  const handleVerifyEmailCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setEmailSuccess('');
    setEmailLoading(true);

    if (!emailCode || emailCode.length !== 6) {
      setEmailError('6桁の認証コードを入力してください');
      setEmailLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/email-change/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          funeral_home_id: funeralHomeId,
          new_email: newEmail,
          code: emailCode
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setEmailError(data.error || 'エラーが発生しました');
        setEmailLoading(false);
        return;
      }

      setCurrentEmail(newEmail);
      setNewEmail('');
      setEmailCode('');
      setEmailStep('form');
      setEmailSuccess('メールアドレスを変更しました');
    } catch {
      setEmailError('エラーが発生しました');
    }
    setEmailLoading(false);
  };

  if (sessionLoading || !isAuthenticated || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0f1a' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ width: '48px', height: '48px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#c9a227', borderRadius: '50%', margin: '0 auto 1rem' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {showWarning && (
        <SessionWarning
          remainingTime={remainingTime}
          onExtend={extendSession}
          onLogout={handleLogout}
        />
      )}

      <style jsx>{`
        .mobile-header { display: none; position: fixed; top: 0; left: 0; right: 0; height: 56px; background: #0a0f1a; z-index: 1000; align-items: center; justify-content: space-between; padding: 0 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .mobile-menu-btn { background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; padding: 0.5rem; }
        .mobile-logo { display: flex; align-items: center; gap: 0.5rem; color: white; }
        .mobile-logo-icon { width: 32px; height: 32px; background: linear-gradient(135deg, #c9a227, #a08020); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; }
        .mobile-nav { display: none; position: fixed; top: 56px; left: 0; right: 0; bottom: 0; background: #0a0f1a; z-index: 999; flex-direction: column; padding: 1rem; }
        .mobile-nav.open { display: flex; }
        .mobile-nav-link { color: rgba(255,255,255,0.7); text-decoration: none; padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 0.95rem; }
        .mobile-nav-logout { color: #f87171; padding: 1rem; font-size: 0.95rem; cursor: pointer; background: none; border: none; text-align: left; }
        .settings-card { background: white; border-radius: 16px; padding: 32px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .settings-title { font-size: 18px; font-weight: 600; color: #1a1a1a; margin-bottom: 8px; display: flex; align-items: center; gap: 10px; }
        .settings-title-icon { width: 36px; height: 36px; background: linear-gradient(135deg, rgba(201,162,39,0.1), rgba(201,162,39,0.2)); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
        .settings-description { font-size: 13px; color: #666; margin-bottom: 24px; line-height: 1.6; }
        .current-value { background: #f8f8f8; border: 1px solid #e5e5e5; border-radius: 10px; padding: 14px 16px; margin-bottom: 20px; }
        .current-value-label { font-size: 10px; color: #999; letter-spacing: 0.1em; margin-bottom: 4px; }
        .current-value-text { font-size: 15px; color: #1a1a1a; font-weight: 500; }
        .form-label { display: block; font-size: 12px; font-weight: 500; color: #666; margin-bottom: 8px; }
        .form-input { width: 100%; padding: 14px 16px; border: 1px solid #e0e0e0; border-radius: 10px; font-size: 15px; color: #1a1a1a; background: white; box-sizing: border-box; }
        .form-input:focus { outline: none; border-color: #c9a227; }
        .code-input { text-align: center; font-size: 24px; letter-spacing: 0.5em; font-family: monospace; }
        .submit-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #c9a227 0%, #a08020 100%); color: #fff; border: none; border-radius: 10px; font-size: 14px; font-weight: 500; cursor: pointer; margin-top: 16px; }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .secondary-btn { width: 100%; padding: 12px; background: transparent; color: #666; border: 1px solid #e0e0e0; border-radius: 10px; font-size: 13px; cursor: pointer; margin-top: 10px; }
        .error-message { background: rgba(220, 38, 38, 0.1); border: 1px solid rgba(220, 38, 38, 0.3); color: #dc2626; padding: 12px 16px; border-radius: 10px; text-align: center; margin-bottom: 16px; font-size: 13px; }
        .success-message { background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); color: #16a34a; padding: 12px 16px; border-radius: 10px; text-align: center; margin-bottom: 16px; font-size: 13px; }
        .welcome-bar { display: flex; justify-content: space-between; align-items: center; background: white; padding: 12px 16px; border-radius: 10px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
        .welcome-text { font-size: 14px; color: #333; }
        .welcome-name { font-weight: 600; color: #1a1a1a; }
        .logout-btn { background: none; border: 1px solid #e5e5e5; padding: 8px 16px; border-radius: 6px; font-size: 12px; color: #666; cursor: pointer; }
        .page-title { font-size: 24px; font-weight: 600; color: #1a1a1a; margin-bottom: 8px; }
        .page-subtitle { font-size: 14px; color: #666; margin-bottom: 32px; }
        .stripe-status { display: flex; align-items: center; gap: 10px; padding: 16px; border-radius: 10px; margin-bottom: 20px; }
        .stripe-status.connected { background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); }
        .stripe-status.not-connected { background: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.3); }
        .stripe-status-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .stripe-status.connected .stripe-status-icon { background: rgba(34, 197, 94, 0.2); }
        .stripe-status.not-connected .stripe-status-icon { background: rgba(251, 191, 36, 0.2); }
        .stripe-status-text { flex: 1; }
        .stripe-status-title { font-size: 14px; font-weight: 600; color: #1a1a1a; }
        .stripe-status-desc { font-size: 12px; color: #666; margin-top: 2px; }
        .stripe-connect-btn { padding: 14px 24px; background: #635bff; color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }
        .stripe-connect-btn:hover { background: #5148e6; }
        .stripe-connect-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .fee-info { background: #f8f8f8; border-radius: 10px; padding: 16px; margin-top: 16px; }
        .fee-info-title { font-size: 12px; color: #666; margin-bottom: 8px; }
        .fee-info-row { display: flex; justify-content: space-between; font-size: 13px; color: #333; padding: 4px 0; }
        @media (max-width: 768px) {
          .mobile-header { display: flex; }
          .main-content { margin-left: 0 !important; padding-top: 72px !important; }
        }
      `}</style>

      <div className="mobile-header">
        <div className="mobile-logo">
          <div className="mobile-logo-icon">礼</div>
          <span style={{ fontWeight: 500, fontSize: '14px' }}>Rei</span>
        </div>
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="/admin" className="mobile-nav-link">ホーム</a>
        <a href="/admin/payments" className="mobile-nav-link">ご入金管理</a>
        <a href="/admin/settings" className="mobile-nav-link">入金口座連携</a>
        <button className="mobile-nav-logout" onClick={handleLogout}>ログアウト</button>
      </div>

      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">礼</div>
          <div className="sidebar-logo-text">
            <h1>Rei</h1>
            <span>献杯管理システム</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-section-title">メインメニュー</div>
          <a href="/admin" className="sidebar-link">ホーム</a>
          <a href="/admin/payments" className="sidebar-link">ご入金管理</a>
          <a href="/admin/settings" className="sidebar-link active">入金口座連携</a>
        </nav>
        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={handleLogout} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '13px' }}>
            ログアウト
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="welcome-bar">
          <span className="welcome-text">
            <span className="welcome-name">{funeralHomeName}</span> 様
          </span>
          <button className="logout-btn" onClick={handleLogout}>ログアウト</button>
        </div>

        <h1 className="page-title">入金口座連携</h1>
        <p className="page-subtitle">献杯金を受け取るための設定</p>

        <div className="settings-card">
          <h2 className="settings-title">
            <span className="settings-title-icon">🏦</span>
            銀行口座の連携（Stripe Connect）
          </h2>
          <p className="settings-description">
            献杯金を直接受け取るために、Stripeアカウントを連携してください。<br />
            連携後、献杯があると自動的にご登録の銀行口座に入金されます。
          </p>

          {stripeStatus?.onboarding_complete ? (
            <div className="stripe-status connected">
              <div className="stripe-status-icon">✓</div>
              <div className="stripe-status-text">
                <div className="stripe-status-title">連携完了</div>
                <div className="stripe-status-desc">銀行口座が正常に連携されています。献杯金は自動で入金されます。</div>
              </div>
            </div>
          ) : stripeStatus?.connected ? (
            <>
              <div className="stripe-status not-connected">
                <div className="stripe-status-icon">⚠</div>
                <div className="stripe-status-text">
                  <div className="stripe-status-title">設定を完了してください</div>
                  <div className="stripe-status-desc">銀行口座の設定が完了していません</div>
                </div>
              </div>
              <button className="stripe-connect-btn" onClick={handleStripeConnect} disabled={stripeLoading}>
                {stripeLoading ? '処理中...' : '設定を続ける →'}
              </button>
            </>
          ) : (
            <>
              <div className="stripe-status not-connected">
                <div className="stripe-status-icon">🏦</div>
                <div className="stripe-status-text">
                  <div className="stripe-status-title">未連携</div>
                  <div className="stripe-status-desc">銀行口座を連携して献杯金を受け取れるようにしましょう</div>
                </div>
              </div>
              <button className="stripe-connect-btn" onClick={handleStripeConnect} disabled={stripeLoading}>
                {stripeLoading ? '処理中...' : '🏦 銀行口座を連携する'}
              </button>
            </>
          )}

          <div className="fee-info">
            <div className="fee-info-title">手数料について（税込）</div>
            <div className="fee-info-row">
              <span>Stripe決済手数料</span>
              <span>3.6%</span>
            </div>
            <div className="fee-info-row">
              <span>システム利用料</span>
              <span>8%</span>
            </div>
            <div className="fee-info-row" style={{ borderTop: '1px solid #e0e0e0', marginTop: '8px', paddingTop: '8px', fontWeight: 600 }}>
              <span>お受け取り額</span>
              <span>約88.4%</span>
            </div>
            <p style={{ fontSize: '11px', color: '#999', marginTop: '12px' }}>
              例：10,000円の献杯 → 約8,840円がお振込みされます
            </p>
          </div>
        </div>

        <div className="settings-card">
          <h2 className="settings-title">
            <span className="settings-title-icon">✉️</span>
            メールアドレスの変更
          </h2>
          <p className="settings-description">
            認証コードを新しいメールアドレスに送信して確認します。
          </p>

          <div className="current-value">
            <p className="current-value-label">現在のメールアドレス</p>
            <p className="current-value-text">{currentEmail}</p>
          </div>

          {emailError && <div className="error-message">{emailError}</div>}
          {emailSuccess && <div className="success-message">{emailSuccess}</div>}

          {emailStep === 'form' ? (
            <form onSubmit={handleSendEmailCode}>
              <label className="form-label">新しいメールアドレス</label>
              <input
                type="email"
                className="form-input"
                placeholder="new-email@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                disabled={emailLoading}
              />
              <button type="submit" className="submit-btn" disabled={emailLoading}>
                {emailLoading ? '送信中...' : '認証コードを送信'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyEmailCode}>
              <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', marginBottom: '20px', lineHeight: 1.7 }}>
                <strong style={{ color: '#c9a227' }}>{newEmail}</strong>
                <br />
                に認証コードを送信しました
              </p>
              <label className="form-label">認証コード（6桁）</label>
              <input
                type="text"
                className="form-input code-input"
                placeholder="000000"
                value={emailCode}
                onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                disabled={emailLoading}
              />
              <button type="submit" className="submit-btn" disabled={emailLoading || emailCode.length !== 6}>
                {emailLoading ? '確認中...' : 'メールアドレスを変更'}
              </button>
              <button 
                type="button" 
                className="secondary-btn" 
                onClick={() => { setEmailStep('form'); setEmailCode(''); setEmailError(''); }}
              >
                ← 戻る
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0f1a' }}>
        <div style={{ width: '48px', height: '48px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#c9a227', borderRadius: '50%' }}></div>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}
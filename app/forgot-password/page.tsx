'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Step = 'email' | 'code' | 'password' | 'complete';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/password-reset/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'エラーが発生しました');
        setLoading(false);
        return;
      }

      setStep('code');
    } catch (err) {
      console.error('Error:', err);
      setError('エラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/password-reset/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '認証コードが正しくありません');
        setLoading(false);
        return;
      }

      setStep('password');
    } catch (err) {
      console.error('Error:', err);
      setError('エラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('パスワードは6文字以上で設定してください');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/password-reset/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'エラーが発生しました');
        setLoading(false);
        return;
      }

      setStep('complete');
    } catch (err) {
      console.error('Error:', err);
      setError('エラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/password-reset/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        setError('');
        alert('認証コードを再送信しました');
      } else {
        const data = await res.json();
        setError(data.error || '再送信に失敗しました');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0a0f1a 0%, #1a1f2e 50%, #2a3040 100%)' }}>
      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .page-container { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px; }
        .login-card { width: 100%; max-width: 380px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px; padding: 40px 32px; backdrop-filter: blur(20px); animation: fadeUp 0.6s ease forwards; }
        .login-logo { width: 64px; height: 64px; background: linear-gradient(145deg, #c9a227 0%, #a08020 100%); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 600; color: white; margin: 0 auto 20px; box-shadow: 0 8px 32px rgba(201, 162, 39, 0.3); }
        .login-title { font-size: 24px; font-weight: 300; color: #fff; text-align: center; letter-spacing: 0.2em; margin-bottom: 4px; }
        .login-subtitle-text { font-size: 11px; color: rgba(255,255,255,0.4); text-align: center; letter-spacing: 0.15em; margin-bottom: 32px; }
        .step-title { font-size: 18px; font-weight: 400; color: #fff; text-align: center; margin-bottom: 12px; }
        .step-description { font-size: 13px; color: rgba(255,255,255,0.5); text-align: center; line-height: 1.8; margin-bottom: 24px; }
        .highlight-email { color: #c9a227; }
        .form-label { display: block; font-size: 11px; font-weight: 500; color: rgba(255,255,255,0.5); margin-bottom: 8px; letter-spacing: 0.1em; }
        .login-input { width: 100%; padding: 16px 20px; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; font-size: 15px; color: #fff; background: rgba(255,255,255,0.05); transition: all 0.3s ease; box-sizing: border-box; margin-bottom: 16px; }
        .login-input:focus { outline: none; border-color: #c9a227; background: rgba(255,255,255,0.08); }
        .login-input::placeholder { color: rgba(255,255,255,0.3); }
        .code-input { text-align: center; font-size: 24px; letter-spacing: 0.5em; }
        .login-btn { width: 100%; padding: 16px; background: linear-gradient(135deg, #c9a227 0%, #a08020 100%); color: #fff; border: none; border-radius: 12px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.3s ease; letter-spacing: 0.1em; margin-top: 8px; }
        .login-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(201, 162, 39, 0.4); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .error-message { background: rgba(220, 38, 38, 0.1); border: 1px solid rgba(220, 38, 38, 0.3); color: #f87171; padding: 12px 16px; border-radius: 10px; text-align: center; margin-bottom: 16px; font-size: 13px; }
        .login-footer { text-align: center; margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.08); }
        .login-footer-link { color: #c9a227; text-decoration: none; font-weight: 500; font-size: 13px; }
        .login-footer-link:hover { text-decoration: underline; }
        .sub-link { display: block; margin-top: 12px; font-size: 12px; color: rgba(255,255,255,0.35); text-decoration: none; transition: color 0.3s ease; }
        .sub-link:hover { color: rgba(255,255,255,0.6); }
        .success-icon { width: 64px; height: 64px; background: rgba(34, 197, 94, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
        .success-icon svg { width: 32px; height: 32px; color: #22c55e; }
        .brand-footer { margin-top: 48px; font-size: 10px; color: rgba(255,255,255,0.2); letter-spacing: 0.2em; }
        @media (max-width: 480px) { .page-container { padding: 40px 20px; } .login-card { padding: 32px 24px; } }
      `}</style>

      <div className="page-container">
        <div className="login-card">
          <div className="login-logo">礼</div>
          <h2 className="login-title">Rei</h2>
          <p className="login-subtitle-text">パスワードをお忘れの方</p>

          {/* ステップ1: メールアドレス入力 */}
          {step === 'email' && (
            <>
              <h3 className="step-title">メールアドレスの確認</h3>
              <p className="step-description">
                ご登録のメールアドレスを入力してください。<br />
                パスワードリセット用の認証コードをお送りします。
              </p>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleSendCode}>
                <label className="form-label">メールアドレス</label>
                <input
                  type="email"
                  className="login-input"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
                
                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? '送信中...' : '認証コードを送信'}
                </button>
              </form>

              <div className="login-footer">
                <a href="/" className="login-footer-link">← ログインページに戻る</a>
              </div>
            </>
          )}

          {/* ステップ2: 認証コード入力 */}
          {step === 'code' && (
            <>
              <h3 className="step-title">認証コードの入力</h3>
              <p className="step-description">
                <span className="highlight-email">{email}</span> に<br />
                6桁の認証コードを送信しました。
              </p>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleVerifyCode}>
                <label className="form-label">認証コード</label>
                <input
                  type="text"
                  className="login-input code-input"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  disabled={loading}
                  required
                />
                
                <button type="submit" className="login-btn" disabled={loading || code.length !== 6}>
                  {loading ? '確認中...' : '確認する'}
                </button>
              </form>

              <div className="login-footer">
                <button
                  onClick={handleResendCode}
                  disabled={loading}
                  className="login-footer-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  コードを再送信する
                </button>
                <a href="#" onClick={() => { setStep('email'); setError(''); }} className="sub-link">
                  メールアドレスを変更する
                </a>
              </div>
            </>
          )}

          {/* ステップ3: 新しいパスワード設定 */}
          {step === 'password' && (
            <>
              <h3 className="step-title">新しいパスワードの設定</h3>
              <p className="step-description">
                新しいパスワードを入力してください。<br />
                6文字以上で設定してください。
              </p>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleResetPassword}>
                <label className="form-label">新しいパスワード</label>
                <input
                  type="password"
                  className="login-input"
                  placeholder="6文字以上"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                  disabled={loading}
                  required
                />

                <label className="form-label">パスワード（確認）</label>
                <input
                  type="password"
                  className="login-input"
                  placeholder="もう一度入力"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                  disabled={loading}
                  required
                />
                
                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? '更新中...' : 'パスワードを更新'}
                </button>
              </form>
            </>
          )}

          {/* ステップ4: 完了 */}
          {step === 'complete' && (
            <>
              <div className="success-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="step-title">パスワードを更新しました</h3>
              <p className="step-description">
                新しいパスワードでログインできます。
              </p>
              
              <a href="/" className="login-btn" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                ログインページへ
              </a>
            </>
          )}
        </div>

        <p className="brand-footer">POWERED BY REI</p>
      </div>
    </div>
  );
}
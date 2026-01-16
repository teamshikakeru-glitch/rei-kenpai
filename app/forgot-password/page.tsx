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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const getStepNumber = (): number => {
    switch (step) {
      case 'email': return 1;
      case 'code': return 2;
      case 'password': return 3;
      case 'complete': return 4;
    }
  };

  return (
    <div className="forgot-page">
      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes checkmark {
          0% { stroke-dashoffset: 50; }
          100% { stroke-dashoffset: 0; }
        }
        
        .forgot-page {
          min-height: 100vh;
          background: #0a0a0a;
          position: relative;
          overflow: hidden;
        }
        
        /* 背景エフェクト */
        .bg-gradient-1 {
          position: absolute;
          top: -200px;
          left: -200px;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(201, 162, 39, 0.12) 0%, transparent 70%);
          pointer-events: none;
          animation: pulse 8s ease-in-out infinite;
        }
        .bg-gradient-2 {
          position: absolute;
          bottom: -200px;
          right: -200px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(201, 162, 39, 0.08) 0%, transparent 70%);
          pointer-events: none;
          animation: pulse 8s ease-in-out infinite 4s;
        }
        .bg-line-1 {
          position: absolute;
          top: 0;
          left: 25%;
          width: 1px;
          height: 100%;
          background: linear-gradient(180deg, transparent 0%, rgba(201, 162, 39, 0.08) 50%, transparent 100%);
        }
        .bg-line-2 {
          position: absolute;
          top: 0;
          right: 25%;
          width: 1px;
          height: 100%;
          background: linear-gradient(180deg, transparent 0%, rgba(201, 162, 39, 0.08) 50%, transparent 100%);
        }
        .bg-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(201, 162, 39, 0.02) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }
        
        .page-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 24px;
          position: relative;
          z-index: 1;
        }
        
        .forgot-card {
          width: 100%;
          max-width: 420px;
          background: linear-gradient(180deg, rgba(20, 20, 20, 0.95) 0%, rgba(15, 15, 15, 0.98) 100%);
          border: 1px solid rgba(201, 162, 39, 0.12);
          border-radius: 28px;
          padding: 44px 36px;
          backdrop-filter: blur(40px);
          animation: fadeUp 0.8s ease forwards;
          box-shadow: 
            0 4px 6px rgba(0, 0, 0, 0.1),
            0 20px 40px rgba(0, 0, 0, 0.3),
            0 0 80px rgba(201, 162, 39, 0.05);
        }
        
        .logo {
          width: 64px;
          height: 64px;
          background: linear-gradient(145deg, #c9a227 0%, #8b6914 100%);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 600;
          color: white;
          margin: 0 auto 16px;
          box-shadow: 
            0 8px 32px rgba(201, 162, 39, 0.35),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset;
          animation: float 6s ease-in-out infinite;
        }
        
        .card-title {
          font-size: 26px;
          font-weight: 300;
          color: #fff;
          text-align: center;
          letter-spacing: 0.2em;
          margin-bottom: 6px;
        }
        
        .card-subtitle {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          text-align: center;
          letter-spacing: 0.15em;
          margin-bottom: 28px;
        }
        
        /* ステップインジケーター */
        .step-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          margin-bottom: 32px;
        }
        
        .step-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          transition: all 0.5s ease;
        }
        
        .step-dot.active {
          background: #c9a227;
          box-shadow: 0 0 12px rgba(201, 162, 39, 0.5);
        }
        
        .step-dot.completed {
          background: #c9a227;
        }
        
        .step-dot.inactive {
          background: rgba(255,255,255,0.15);
        }
        
        .step-connector {
          width: 32px;
          height: 2px;
          background: rgba(255,255,255,0.1);
          margin: 0 6px;
          position: relative;
          overflow: hidden;
        }
        
        .step-connector.active::after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 100%;
          background: #c9a227;
        }
        
        /* セクションヘッダー */
        .section-icon {
          width: 56px;
          height: 56px;
          margin: 0 auto 20px;
          background: rgba(201, 162, 39, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: scaleIn 0.5s ease forwards;
        }
        
        .section-icon svg {
          width: 26px;
          height: 26px;
          color: #c9a227;
        }
        
        .step-title {
          font-size: 18px;
          font-weight: 400;
          color: #fff;
          text-align: center;
          margin-bottom: 10px;
          letter-spacing: 0.05em;
        }
        
        .step-description {
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          text-align: center;
          line-height: 1.9;
          margin-bottom: 28px;
        }
        
        .highlight-email {
          color: #c9a227;
          font-weight: 500;
        }
        
        /* フォーム */
        .form-group {
          margin-bottom: 18px;
        }
        
        .form-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          margin-bottom: 10px;
          letter-spacing: 0.08em;
        }
        
        .form-label-icon {
          width: 15px;
          height: 15px;
          opacity: 0.6;
        }
        
        .input-wrapper {
          position: relative;
        }
        
        .form-input {
          width: 100%;
          padding: 16px 18px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          font-size: 15px;
          color: #fff;
          background: rgba(255,255,255,0.03);
          transition: all 0.3s ease;
          box-sizing: border-box;
        }
        
        .form-input:focus {
          outline: none;
          border-color: rgba(201, 162, 39, 0.5);
          background: rgba(255,255,255,0.05);
          box-shadow: 0 0 0 4px rgba(201, 162, 39, 0.1);
        }
        
        .form-input::placeholder {
          color: rgba(255,255,255,0.25);
        }
        
        .password-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          padding: 4px;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.35);
          transition: color 0.3s ease;
        }
        
        .password-toggle:hover {
          color: rgba(255, 255, 255, 0.6);
        }
        
        .password-toggle svg {
          width: 18px;
          height: 18px;
        }
        
        /* 認証コード入力 */
        .code-input {
          text-align: center;
          font-size: 28px;
          letter-spacing: 14px;
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
          padding: 18px;
        }
        
        .code-input::placeholder {
          letter-spacing: 14px;
        }
        
        .code-hint {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          text-align: center;
          margin-top: 8px;
        }
        
        /* ボタン */
        .submit-btn {
          width: 100%;
          padding: 17px;
          background: linear-gradient(135deg, #c9a227 0%, #a08020 100%);
          color: #0a0a0a;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.1em;
          margin-top: 8px;
          position: relative;
          overflow: hidden;
        }
        
        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #d4ad32 0%, #c9a227 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .submit-btn:hover::before {
          opacity: 1;
        }
        
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(201, 162, 39, 0.4);
        }
        
        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        .submit-btn-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(10, 10, 10, 0.3);
          border-top-color: #0a0a0a;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* エラーメッセージ */
        .error-message {
          background: rgba(220, 38, 38, 0.08);
          border: 1px solid rgba(220, 38, 38, 0.2);
          color: #f87171;
          padding: 14px 18px;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 20px;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .error-icon {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }
        
        /* フッター */
        .card-footer {
          text-align: center;
          margin-top: 28px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        
        .footer-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #c9a227;
          text-decoration: none;
          font-weight: 500;
          font-size: 13px;
          transition: all 0.3s ease;
          background: none;
          border: none;
          cursor: pointer;
        }
        
        .footer-link:hover {
          opacity: 0.8;
        }
        
        .footer-link svg {
          width: 16px;
          height: 16px;
        }
        
        .sub-link {
          display: block;
          margin-top: 14px;
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          text-decoration: none;
          transition: color 0.3s ease;
          background: none;
          border: none;
          cursor: pointer;
        }
        
        .sub-link:hover {
          color: rgba(255,255,255,0.6);
        }
        
        /* 完了画面 */
        .success-icon {
          width: 72px;
          height: 72px;
          background: rgba(34, 197, 94, 0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          animation: scaleIn 0.5s ease forwards;
        }
        
        .success-icon svg {
          width: 36px;
          height: 36px;
          color: #22c55e;
        }
        
        .success-icon svg path {
          stroke-dasharray: 50;
          stroke-dashoffset: 50;
          animation: checkmark 0.6s ease forwards 0.3s;
        }
        
        .success-title {
          font-size: 20px;
          font-weight: 400;
          color: #fff;
          text-align: center;
          margin-bottom: 12px;
          letter-spacing: 0.05em;
        }
        
        .success-description {
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          text-align: center;
          margin-bottom: 28px;
        }
        
        .brand-footer {
          margin-top: 48px;
          font-size: 10px;
          color: rgba(255,255,255,0.15);
          letter-spacing: 0.25em;
          animation: fadeUp 0.8s ease forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }
        
        @media (max-width: 480px) {
          .page-container {
            padding: 40px 20px;
          }
          .forgot-card {
            padding: 36px 24px;
            border-radius: 24px;
          }
          .logo {
            width: 56px;
            height: 56px;
            font-size: 24px;
          }
          .card-title {
            font-size: 22px;
          }
          .code-input {
            font-size: 24px;
            letter-spacing: 10px;
          }
        }
      `}</style>

      {/* 背景エフェクト */}
      <div className="bg-gradient-1" />
      <div className="bg-gradient-2" />
      <div className="bg-line-1" />
      <div className="bg-line-2" />
      <div className="bg-dots" />

      <div className="page-container">
        <div className="forgot-card">
          <div className="logo">礼</div>
          <h2 className="card-title">Rei</h2>
          <p className="card-subtitle">パスワードをお忘れの方</p>

          {/* ステップインジケーター */}
          {step !== 'complete' && (
            <div className="step-indicator">
              <div className={`step-dot ${getStepNumber() >= 1 ? (getStepNumber() > 1 ? 'completed' : 'active') : 'inactive'}`} />
              <div className={`step-connector ${getStepNumber() > 1 ? 'active' : ''}`} />
              <div className={`step-dot ${getStepNumber() >= 2 ? (getStepNumber() > 2 ? 'completed' : 'active') : 'inactive'}`} />
              <div className={`step-connector ${getStepNumber() > 2 ? 'active' : ''}`} />
              <div className={`step-dot ${getStepNumber() >= 3 ? 'active' : 'inactive'}`} />
            </div>
          )}

          {/* ステップ1: メールアドレス入力 */}
          {step === 'email' && (
            <>
              <div className="section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <h3 className="step-title">メールアドレスの確認</h3>
              <p className="step-description">
                ご登録のメールアドレスを入力してください。<br />
                パスワードリセット用の認証コードをお送りします。
              </p>

              {error && (
                <div className="error-message">
                  <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleSendCode}>
                <div className="form-group">
                  <label className="form-label">
                    <svg className="form-label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                
                <button type="submit" className="submit-btn" disabled={loading}>
                  <span className="submit-btn-content">
                    {loading && <span className="spinner" />}
                    {loading ? '送信中...' : '認証コードを送信'}
                  </span>
                </button>
              </form>

              <div className="card-footer">
                <a href="/" className="footer-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  ログインページに戻る
                </a>
              </div>
            </>
          )}

          {/* ステップ2: 認証コード入力 */}
          {step === 'code' && (
            <>
              <div className="section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className="step-title">認証コードの入力</h3>
              <p className="step-description">
                <span className="highlight-email">{email}</span> に<br />
                6桁の認証コードを送信しました。
              </p>

              {error && (
                <div className="error-message">
                  <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleVerifyCode}>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-input code-input"
                    placeholder="000000"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    disabled={loading}
                    required
                    autoFocus
                  />
                  <p className="code-hint">6桁の認証コードを入力してください</p>
                </div>
                
                <button type="submit" className="submit-btn" disabled={loading || code.length !== 6}>
                  <span className="submit-btn-content">
                    {loading && <span className="spinner" />}
                    {loading ? '確認中...' : '確認する'}
                  </span>
                </button>
              </form>

              <div className="card-footer">
                <button
                  onClick={handleResendCode}
                  disabled={loading}
                  className="footer-link"
                >
                  コードを再送信する
                </button>
                <button 
                  onClick={() => { setStep('email'); setError(''); }} 
                  className="sub-link"
                >
                  メールアドレスを変更する
                </button>
              </div>
            </>
          )}

          {/* ステップ3: 新しいパスワード設定 */}
          {step === 'password' && (
            <>
              <div className="section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="step-title">新しいパスワードの設定</h3>
              <p className="step-description">
                新しいパスワードを入力してください。<br />
                6文字以上で設定してください。
              </p>

              {error && (
                <div className="error-message">
                  <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleResetPassword}>
                <div className="form-group">
                  <label className="form-label">
                    <svg className="form-label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    新しいパスワード
                  </label>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="6文字以上"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      minLength={6}
                      disabled={loading}
                      required
                      style={{ paddingRight: '44px' }}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <svg className="form-label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4" />
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    パスワード（確認）
                  </label>
                  <div className="input-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="もう一度入力"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength={6}
                      disabled={loading}
                      required
                      style={{ paddingRight: '44px' }}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                <button type="submit" className="submit-btn" disabled={loading}>
                  <span className="submit-btn-content">
                    {loading && <span className="spinner" />}
                    {loading ? '更新中...' : 'パスワードを更新'}
                  </span>
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
              <h3 className="success-title">パスワードを更新しました</h3>
              <p className="success-description">
                新しいパスワードでログインできます。
              </p>
              
              <a href="/" className="submit-btn" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                <span className="submit-btn-content">
                  ログインページへ
                </span>
              </a>
            </>
          )}
        </div>

        <p className="brand-footer">POWERED BY REI</p>
      </div>
    </div>
  );
}
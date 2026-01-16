'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEmailRegistered, setIsEmailRegistered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  // 葬儀社名のバリデーション
  const validateName = (name: string): string => {
    if (!name) return '';
    
    // 前後のスペースチェック
    if (name !== name.trim()) {
      return '前後にスペースが含まれています';
    }
    
    // 連続スペースチェック
    if (/\s{2,}/.test(name)) {
      return '連続するスペースは使用できません';
    }
    
    // 特殊文字チェック（日本語、英数字、一部の記号のみ許可）
    const invalidChars = name.match(/[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uFF00-\uFFEFa-zA-Z0-9\s\-・．.()（）]/g);
    if (invalidChars) {
      const uniqueChars = [...new Set(invalidChars)].join(' ');
      return `使用できない文字が含まれています: ${uniqueChars}`;
    }
    
    return '';
  };

  // 葬儀社名が変更されたときにバリデーション
  useEffect(() => {
    const error = validateName(formData.name);
    setNameError(error);
  }, [formData.name]);

  // メールアドレス重複確認をリセット
  useEffect(() => {
    setIsEmailRegistered(false);
  }, [formData.email]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 基本バリデーション
    if (!formData.name || !formData.email || !formData.password) {
      setError('すべての項目を入力してください');
      setLoading(false);
      return;
    }

    // 葬儀社名バリデーション
    const nameValidationError = validateName(formData.name);
    if (nameValidationError) {
      setError(nameValidationError);
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('パスワードは6文字以上で設定してください');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, funeral_home_name: formData.name.trim() })
      });

      const data = await res.json();

      if (!res.ok) {
        // メールアドレスが既に登録されている場合
        if (data.error?.includes('既に登録') || data.error?.includes('登録されています')) {
          setIsEmailRegistered(true);
          setError('このメールアドレスは既に登録されています');
        } else {
          setError(data.error || 'エラーが発生しました');
        }
        setLoading(false);
        return;
      }

      setStep('verify');
    } catch (err) {
      setError('エラーが発生しました');
    }
    setLoading(false);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!code || code.length !== 6) {
      setError('6桁の認証コードを入力してください');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, code, password: formData.password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'エラーが発生しました');
        setLoading(false);
        return;
      }

      alert('登録が完了しました。ログインしてください。');
      router.push('/');
    } catch (err) {
      setError('エラーが発生しました');
    }
    setLoading(false);
  };

  return (
    <div className="register-page">
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
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .register-page {
          min-height: 100vh;
          background: #0a0a0a;
          position: relative;
          overflow: hidden;
        }
        
        /* 背景エフェクト */
        .bg-gradient-1 {
          position: absolute;
          top: -200px;
          right: -200px;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(201, 162, 39, 0.12) 0%, transparent 70%);
          pointer-events: none;
          animation: pulse 8s ease-in-out infinite;
        }
        .bg-gradient-2 {
          position: absolute;
          bottom: -200px;
          left: -200px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(201, 162, 39, 0.08) 0%, transparent 70%);
          pointer-events: none;
          animation: pulse 8s ease-in-out infinite 4s;
        }
        .bg-line-1 {
          position: absolute;
          top: 0;
          left: 30%;
          width: 1px;
          height: 100%;
          background: linear-gradient(180deg, transparent 0%, rgba(201, 162, 39, 0.08) 50%, transparent 100%);
        }
        .bg-line-2 {
          position: absolute;
          top: 0;
          right: 30%;
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
          padding: 40px 24px;
          position: relative;
          z-index: 1;
        }
        
        .register-card {
          width: 100%;
          max-width: 440px;
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
        
        .card-header {
          text-align: center;
          margin-bottom: 28px;
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
          font-size: 24px;
          font-weight: 300;
          color: #fff;
          letter-spacing: 0.15em;
          margin-bottom: 6px;
        }
        
        .card-subtitle {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.15em;
        }
        
        /* ステップインジケーター */
        .step-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          margin-bottom: 32px;
        }
        
        .step {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.5s ease;
          position: relative;
        }
        
        .step.active {
          background: linear-gradient(145deg, #c9a227 0%, #a08020 100%);
          color: #0a0a0a;
          box-shadow: 0 4px 20px rgba(201, 162, 39, 0.4);
        }
        
        .step.completed {
          background: linear-gradient(145deg, #c9a227 0%, #a08020 100%);
          color: #0a0a0a;
        }
        
        .step.inactive {
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.3);
          border: 1px solid rgba(255,255,255,0.1);
        }
        
        .step-line {
          width: 60px;
          height: 2px;
          background: rgba(255,255,255,0.1);
          position: relative;
          overflow: hidden;
        }
        
        .step-line.active::after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 100%;
          background: linear-gradient(90deg, #c9a227, #e8d078);
          animation: slideIn 0.5s ease forwards;
        }
        
        .step-label {
          position: absolute;
          top: 44px;
          font-size: 10px;
          color: rgba(255,255,255,0.4);
          white-space: nowrap;
          letter-spacing: 0.05em;
        }
        
        .step.active .step-label {
          color: #c9a227;
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
        
        .form-input.error {
          border-color: rgba(248, 113, 113, 0.5);
          box-shadow: 0 0 0 4px rgba(248, 113, 113, 0.1);
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
        
        .field-error {
          font-size: 11px;
          color: #f87171;
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: rgba(248, 113, 113, 0.08);
          border-radius: 8px;
        }
        
        .field-error-icon {
          width: 13px;
          height: 13px;
          flex-shrink: 0;
        }
        
        /* 認証コード入力 */
        .code-section {
          text-align: center;
          animation: scaleIn 0.5s ease forwards;
        }
        
        .code-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 20px;
          background: rgba(201, 162, 39, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .code-icon svg {
          width: 28px;
          height: 28px;
          color: #c9a227;
        }
        
        .code-title {
          font-size: 16px;
          color: rgba(255,255,255,0.7);
          margin-bottom: 8px;
          line-height: 1.6;
        }
        
        .code-email {
          color: #c9a227;
          font-weight: 500;
        }
        
        .code-input {
          width: 100%;
          padding: 20px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          font-size: 32px;
          color: #fff;
          background: rgba(255,255,255,0.03);
          text-align: center;
          letter-spacing: 16px;
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
          box-sizing: border-box;
          margin: 24px 0 8px;
          transition: all 0.3s ease;
        }
        
        .code-input:focus {
          outline: none;
          border-color: rgba(201, 162, 39, 0.5);
          box-shadow: 0 0 0 4px rgba(201, 162, 39, 0.1);
        }
        
        .code-input::placeholder {
          color: rgba(255,255,255,0.2);
          letter-spacing: 16px;
        }
        
        .code-hint {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          margin-bottom: 24px;
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
        
        .secondary-btn {
          width: 100%;
          padding: 14px;
          background: transparent;
          color: rgba(255,255,255,0.5);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          font-size: 13px;
          cursor: pointer;
          margin-top: 12px;
          transition: all 0.3s ease;
          letter-spacing: 0.05em;
        }
        
        .secondary-btn:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.7);
        }
        
        /* メッセージ */
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
        
        .registered-message {
          background: rgba(201, 162, 39, 0.08);
          border: 1px solid rgba(201, 162, 39, 0.2);
          color: rgba(255,255,255,0.7);
          padding: 18px;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 20px;
          font-size: 13px;
          line-height: 1.8;
        }
        
        .registered-message a {
          color: #c9a227;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        .registered-message a:hover {
          text-decoration: underline;
        }
        
        .info-text {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          text-align: center;
          margin-top: 20px;
          line-height: 1.8;
        }
        
        .back-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 28px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.06);
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          transition: color 0.3s ease;
        }
        
        .back-link:hover {
          color: #c9a227;
        }
        
        .back-link svg {
          width: 16px;
          height: 16px;
        }
        
        @media (max-width: 480px) {
          .page-container {
            padding: 32px 20px;
          }
          .register-card {
            padding: 36px 24px;
            border-radius: 24px;
          }
          .logo {
            width: 56px;
            height: 56px;
            font-size: 24px;
          }
          .card-title {
            font-size: 20px;
          }
          .step {
            width: 32px;
            height: 32px;
            font-size: 13px;
          }
          .step-line {
            width: 40px;
          }
          .code-input {
            font-size: 26px;
            letter-spacing: 12px;
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
        <div className="register-card">
          <div className="card-header">
            <div className="logo">礼</div>
            <h1 className="card-title">新規登録</h1>
            <p className="card-subtitle">Rei 献杯管理システム</p>
          </div>

          {/* ステップインジケーター */}
          <div className="step-indicator">
            <div className={`step ${step === 'form' ? 'active' : 'completed'}`}>
              {step === 'verify' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : '1'}
              <span className="step-label">情報入力</span>
            </div>
            <div className={`step-line ${step === 'verify' ? 'active' : ''}`}></div>
            <div className={`step ${step === 'verify' ? 'active' : 'inactive'}`}>
              2
              <span className="step-label">認証</span>
            </div>
          </div>

          {/* 既に登録済みの場合の特別メッセージ */}
          {isEmailRegistered && (
            <div className="registered-message">
              このメールアドレスは既に登録されています。<br />
              <a href="/">ログインはこちら</a> または <a href="/forgot-password">パスワードをお忘れの方</a>
            </div>
          )}

          {/* 通常のエラーメッセージ（登録済みエラー以外） */}
          {error && !isEmailRegistered && (
            <div className="error-message">
              <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {step === 'form' ? (
            <form onSubmit={handleSendCode}>
              <div className="form-group">
                <label className="form-label">
                  <svg className="form-label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11" />
                    <path d="M9 21v-4a3 3 0 0 1 6 0v4" />
                  </svg>
                  葬儀社名
                </label>
                <input
                  type="text"
                  className={`form-input ${nameError ? 'error' : ''}`}
                  placeholder="例：山田葬儀社"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={loading}
                />
                {nameError && (
                  <div className="field-error">
                    <svg className="field-error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    {nameError}
                  </div>
                )}
              </div>

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
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <svg className="form-label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  パスワード（6文字以上）
                </label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={loading}
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
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    disabled={loading}
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

              <button type="submit" className="submit-btn" disabled={loading || !!nameError}>
                <span className="submit-btn-content">
                  {loading && <span className="spinner" />}
                  {loading ? '送信中...' : '認証コードを送信'}
                </span>
              </button>

              <p className="info-text">
                入力されたメールアドレスに<br />6桁の認証コードをお送りします
              </p>
            </form>
          ) : (
            <div className="code-section">
              <div className="code-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              
              <p className="code-title">
                <span className="code-email">{formData.email}</span><br />
                に認証コードを送信しました
              </p>

              <form onSubmit={handleVerify}>
                <input
                  type="text"
                  className="code-input"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  disabled={loading}
                  autoFocus
                />
                <p className="code-hint">6桁の認証コードを入力してください</p>

                <button type="submit" className="submit-btn" disabled={loading || code.length !== 6}>
                  <span className="submit-btn-content">
                    {loading && <span className="spinner" />}
                    {loading ? '確認中...' : '登録を完了する'}
                  </span>
                </button>

                <button type="button" className="secondary-btn" onClick={() => { setStep('form'); setError(''); }}>
                  ← 入力画面に戻る
                </button>

                <p className="info-text">
                  コードが届かない場合は、<br />迷惑メールフォルダをご確認ください
                </p>
              </form>
            </div>
          )}

          <a href="/" className="back-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            ログイン画面に戻る
          </a>
        </div>
      </div>
    </div>
  );
}
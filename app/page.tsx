'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [funeralHomeName, setFuneralHomeName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const supabase = createClient();

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
    const error = validateName(funeralHomeName);
    setNameError(error);
  }, [funeralHomeName]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!funeralHomeName.trim() || !password) {
      setError('葬儀社名とパスワードを入力してください');
      setLoading(false);
      return;
    }

    // 葬儀社名バリデーション
    const nameValidationError = validateName(funeralHomeName);
    if (nameValidationError) {
      setError(nameValidationError);
      setLoading(false);
      return;
    }

    try {
      const { data, error: dbError } = await supabase
        .from('funeral_homes')
        .select('*')
        .eq('name', funeralHomeName.trim())
        .eq('password', password)
        .single();

      if (dbError || !data) {
        setError('葬儀社名またはパスワードが正しくありません');
        setLoading(false);
        return;
      }

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('funeral_home_id', data.id);
        sessionStorage.setItem('funeral_home_name', data.name);
      }
      
      router.push('/admin');
    } catch (err) {
      console.error('Login error:', err);
      setError('ログインに失敗しました');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        .login-page {
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
          background: radial-gradient(circle, rgba(201, 162, 39, 0.15) 0%, transparent 70%);
          pointer-events: none;
          animation: pulse 8s ease-in-out infinite;
        }
        .bg-gradient-2 {
          position: absolute;
          bottom: -200px;
          right: -200px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(201, 162, 39, 0.1) 0%, transparent 70%);
          pointer-events: none;
          animation: pulse 8s ease-in-out infinite 4s;
        }
        .bg-line-1 {
          position: absolute;
          top: 0;
          left: 25%;
          width: 1px;
          height: 100%;
          background: linear-gradient(180deg, transparent 0%, rgba(201, 162, 39, 0.1) 50%, transparent 100%);
        }
        .bg-line-2 {
          position: absolute;
          top: 0;
          right: 25%;
          width: 1px;
          height: 100%;
          background: linear-gradient(180deg, transparent 0%, rgba(201, 162, 39, 0.1) 50%, transparent 100%);
        }
        .bg-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(201, 162, 39, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }
        
        .page-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 60px 24px;
          position: relative;
          z-index: 1;
        }
        
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 10px 20px;
          background: rgba(201, 162, 39, 0.08);
          border: 1px solid rgba(201, 162, 39, 0.2);
          border-radius: 100px;
          font-size: 11px;
          color: #c9a227;
          letter-spacing: 0.15em;
          margin-bottom: 32px;
          animation: fadeUp 0.8s ease forwards;
          backdrop-filter: blur(10px);
        }
        .hero-badge-dot {
          width: 6px;
          height: 6px;
          background: #c9a227;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }
        
        .hero-title {
          font-size: 36px;
          font-weight: 300;
          color: #fff;
          text-align: center;
          line-height: 1.6;
          letter-spacing: 0.05em;
          margin-bottom: 20px;
          animation: fadeUp 0.8s ease forwards;
          animation-delay: 0.1s;
          opacity: 0;
        }
        .hero-title strong {
          font-weight: 600;
          background: linear-gradient(135deg, #c9a227 0%, #e8d078 50%, #c9a227 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        
        .hero-subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.45);
          text-align: center;
          line-height: 2.2;
          max-width: 360px;
          margin: 0 auto 48px;
          animation: fadeUp 0.8s ease forwards;
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        .login-card {
          width: 100%;
          max-width: 400px;
          background: linear-gradient(180deg, rgba(20, 20, 20, 0.95) 0%, rgba(15, 15, 15, 0.98) 100%);
          border: 1px solid rgba(201, 162, 39, 0.12);
          border-radius: 28px;
          padding: 48px 36px;
          backdrop-filter: blur(40px);
          animation: fadeUp 0.8s ease forwards;
          animation-delay: 0.3s;
          opacity: 0;
          box-shadow: 
            0 4px 6px rgba(0, 0, 0, 0.1),
            0 20px 40px rgba(0, 0, 0, 0.3),
            0 0 80px rgba(201, 162, 39, 0.05);
        }
        
        .login-logo {
          width: 72px;
          height: 72px;
          background: linear-gradient(145deg, #c9a227 0%, #8b6914 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 600;
          color: white;
          margin: 0 auto 20px;
          box-shadow: 
            0 8px 32px rgba(201, 162, 39, 0.35),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset;
          animation: float 6s ease-in-out infinite;
        }
        
        .login-title {
          font-size: 28px;
          font-weight: 300;
          color: #fff;
          text-align: center;
          letter-spacing: 0.25em;
          margin-bottom: 6px;
        }
        
        .login-subtitle-text {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          text-align: center;
          letter-spacing: 0.2em;
          margin-bottom: 36px;
        }
        
        .form-group {
          margin-bottom: 20px;
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
          width: 16px;
          height: 16px;
          opacity: 0.6;
        }
        
        .input-wrapper {
          position: relative;
        }
        
        .login-input {
          width: 100%;
          padding: 18px 20px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          font-size: 15px;
          color: #fff;
          background: rgba(255,255,255,0.03);
          transition: all 0.3s ease;
          box-sizing: border-box;
        }
        .login-input:focus {
          outline: none;
          border-color: rgba(201, 162, 39, 0.5);
          background: rgba(255,255,255,0.05);
          box-shadow: 0 0 0 4px rgba(201, 162, 39, 0.1);
        }
        .login-input::placeholder {
          color: rgba(255,255,255,0.25);
        }
        .login-input.error {
          border-color: rgba(248, 113, 113, 0.5);
          box-shadow: 0 0 0 4px rgba(248, 113, 113, 0.1);
        }
        
        .password-toggle {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          padding: 4px;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.4);
          transition: color 0.3s ease;
        }
        .password-toggle:hover {
          color: rgba(255, 255, 255, 0.7);
        }
        .password-toggle svg {
          width: 20px;
          height: 20px;
        }
        
        .field-error {
          font-size: 12px;
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
          width: 14px;
          height: 14px;
          flex-shrink: 0;
        }
        
        .login-btn {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #c9a227 0%, #a08020 100%);
          color: #0a0a0a;
          border: none;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.1em;
          margin-top: 12px;
          position: relative;
          overflow: hidden;
        }
        .login-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #d4ad32 0%, #c9a227 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .login-btn:hover::before {
          opacity: 1;
        }
        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(201, 162, 39, 0.4);
        }
        .login-btn:active {
          transform: translateY(0);
        }
        .login-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        .login-btn-content {
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
        
        .divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 28px 0;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        }
        .divider-text {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.15em;
        }
        
        .login-footer {
          text-align: center;
        }
        
        .register-btn {
          width: 100%;
          padding: 16px;
          background: transparent;
          border: 1px solid rgba(201, 162, 39, 0.25);
          border-radius: 14px;
          font-size: 14px;
          font-weight: 500;
          color: #c9a227;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.08em;
        }
        .register-btn:hover {
          background: rgba(201, 162, 39, 0.08);
          border-color: rgba(201, 162, 39, 0.4);
        }
        
        .help-link {
          display: inline-block;
          margin-top: 20px;
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          text-decoration: none;
          transition: color 0.3s ease;
        }
        .help-link:hover {
          color: #c9a227;
        }
        
        .brand-footer {
          margin-top: 48px;
          font-size: 10px;
          color: rgba(255,255,255,0.15);
          letter-spacing: 0.25em;
          animation: fadeUp 0.8s ease forwards;
          animation-delay: 0.5s;
          opacity: 0;
        }
        
        @media (max-width: 480px) {
          .page-container {
            padding: 40px 20px;
          }
          .hero-title {
            font-size: 26px;
          }
          .login-card {
            padding: 36px 24px;
            border-radius: 24px;
          }
          .login-logo {
            width: 64px;
            height: 64px;
            font-size: 28px;
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
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          <span>FOR FUNERAL DIRECTORS</span>
          <span className="hero-badge-dot" />
        </div>

        <h1 className="hero-title">
          <strong>見積もり競争</strong>を<br />
          勝ち抜くための新提案
        </h1>

        <p className="hero-subtitle">
          献杯ページを即座に発行。<br />
          支援金で葬儀費用の負担を軽減する<br />
          新しい価値を提供できます。
        </p>

        <div className="login-card">
          <div className="login-logo">礼</div>
          <h2 className="login-title">Rei</h2>
          <p className="login-subtitle-text">献杯管理システム</p>

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

          <form onSubmit={handleLogin}>
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
                className={`login-input ${nameError ? 'error' : ''}`}
                placeholder="ご登録の葬儀社名"
                value={funeralHomeName}
                onChange={(e) => setFuneralHomeName(e.target.value)}
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
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                パスワード
              </label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="パスワード"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  style={{ paddingRight: '48px' }}
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
            
            <button type="submit" className="login-btn" disabled={loading || !!nameError}>
              <span className="login-btn-content">
                {loading && <span className="spinner" />}
                {loading ? '認証中...' : 'ログイン'}
              </span>
            </button>
          </form>

          <div className="divider">
            <span className="divider-line" />
            <span className="divider-text">または</span>
            <span className="divider-line" />
          </div>

          <div className="login-footer">
            <button 
              type="button" 
              className="register-btn"
              onClick={() => router.push('/admin/register')}
            >
              新規登録はこちら
            </button>
            <a href="/forgot-password" className="help-link">
              ログインでお困りの方はこちら
            </a>
          </div>
        </div>

        <p className="brand-footer">POWERED BY REI</p>
      </div>
    </div>
  );
}
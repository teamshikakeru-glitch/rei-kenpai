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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0a0f1a 0%, #1a1f2e 50%, #2a3040 100%)' }}>
      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .page-container { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; }
        .register-card { width: 100%; max-width: 420px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px; padding: 40px 32px; backdrop-filter: blur(20px); animation: fadeUp 0.6s ease forwards; }
        .card-header { text-align: center; margin-bottom: 32px; }
        .logo { width: 56px; height: 56px; background: linear-gradient(145deg, #c9a227 0%, #a08020 100%); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 600; color: white; margin: 0 auto 16px; box-shadow: 0 8px 32px rgba(201, 162, 39, 0.3); }
        .card-title { font-size: 20px; font-weight: 400; color: #fff; letter-spacing: 0.1em; margin-bottom: 4px; }
        .card-subtitle { font-size: 12px; color: rgba(255,255,255,0.4); }
        .step-indicator { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 32px; }
        .step { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 500; }
        .step.active { background: #c9a227; color: white; }
        .step.inactive { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.4); }
        .step-line { width: 40px; height: 1px; background: rgba(255,255,255,0.2); }
        .form-group { margin-bottom: 16px; }
        .form-label { display: block; font-size: 11px; font-weight: 500; color: rgba(255,255,255,0.5); margin-bottom: 8px; letter-spacing: 0.1em; }
        .form-input { width: 100%; padding: 16px 20px; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; font-size: 15px; color: #fff; background: rgba(255,255,255,0.05); transition: all 0.3s ease; box-sizing: border-box; }
        .form-input:focus { outline: none; border-color: #c9a227; background: rgba(255,255,255,0.08); }
        .form-input::placeholder { color: rgba(255,255,255,0.3); }
        .form-input.error { border-color: rgba(220, 38, 38, 0.5); }
        .field-error { font-size: 11px; color: #f87171; margin-top: 6px; display: flex; align-items: center; gap: 4px; }
        .field-error::before { content: "⚠"; }
        .code-input { width: 100%; padding: 20px; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; font-size: 28px; color: #fff; background: rgba(255,255,255,0.05); text-align: center; letter-spacing: 12px; font-family: monospace; box-sizing: border-box; margin-bottom: 16px; }
        .code-input:focus { outline: none; border-color: #c9a227; }
        .submit-btn { width: 100%; padding: 16px; background: linear-gradient(135deg, #c9a227 0%, #a08020 100%); color: #fff; border: none; border-radius: 12px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.3s ease; letter-spacing: 0.1em; margin-top: 8px; }
        .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(201, 162, 39, 0.4); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .secondary-btn { width: 100%; padding: 14px; background: transparent; color: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; font-size: 13px; cursor: pointer; margin-top: 12px; }
        .secondary-btn:hover { background: rgba(255,255,255,0.05); }
        .error-message { background: rgba(220, 38, 38, 0.1); border: 1px solid rgba(220, 38, 38, 0.3); color: #f87171; padding: 12px 16px; border-radius: 10px; text-align: center; margin-bottom: 16px; font-size: 13px; }
        .registered-message { background: rgba(201, 162, 39, 0.1); border: 1px solid rgba(201, 162, 39, 0.3); color: #c9a227; padding: 16px; border-radius: 10px; text-align: center; margin-bottom: 16px; font-size: 13px; }
        .registered-message a { color: #fff; font-weight: 500; text-decoration: underline; margin-left: 4px; }
        .registered-message a:hover { color: #c9a227; }
        .info-text { font-size: 12px; color: rgba(255,255,255,0.4); text-align: center; margin-top: 16px; line-height: 1.7; }
        .back-link { display: block; text-align: center; margin-top: 24px; font-size: 13px; color: rgba(255,255,255,0.4); text-decoration: none; }
        .back-link:hover { color: #c9a227; }
        @media (max-width: 480px) { .register-card { padding: 32px 24px; } }
      `}</style>

      <div className="page-container">
        <div className="register-card">
          <div className="card-header">
            <div className="logo">礼</div>
            <h1 className="card-title">新規登録</h1>
            <p className="card-subtitle">Rei 献杯管理システム</p>
          </div>

          <div className="step-indicator">
            <div className={`step ${step === 'form' ? 'active' : 'inactive'}`}>1</div>
            <div className="step-line"></div>
            <div className={`step ${step === 'verify' ? 'active' : 'inactive'}`}>2</div>
          </div>

          {/* 既に登録済みの場合の特別メッセージ */}
          {isEmailRegistered && (
            <div className="registered-message">
              このメールアドレスは既に登録されています。<br />
              <a href="/">ログインはこちら</a> または <a href="/forgot-password">パスワードをお忘れの方</a>
            </div>
          )}

          {/* 通常のエラーメッセージ（登録済みエラー以外） */}
          {error && !isEmailRegistered && <div className="error-message">{error}</div>}

          {step === 'form' ? (
            <form onSubmit={handleSendCode}>
              <div className="form-group">
                <label className="form-label">葬儀社名</label>
                <input
                  type="text"
                  className={`form-input ${nameError ? 'error' : ''}`}
                  placeholder="例：山田葬儀社"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={loading}
                />
                {nameError && <div className="field-error">{nameError}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">メールアドレス</label>
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
                <label className="form-label">パスワード（6文字以上）</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">パスワード（確認）</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  disabled={loading}
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading || !!nameError}>
                {loading ? '送信中...' : '認証コードを送信'}
              </button>

              <p className="info-text">
                入力されたメールアドレスに<br />6桁の認証コードをお送りします
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerify}>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: '24px', lineHeight: 1.7 }}>
                <strong style={{ color: '#c9a227' }}>{formData.email}</strong><br />
                に認証コードを送信しました
              </p>

              <label className="form-label">認証コード（6桁）</label>
              <input
                type="text"
                className="code-input"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                disabled={loading}
              />

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? '確認中...' : '登録を完了する'}
              </button>

              <button type="button" className="secondary-btn" onClick={() => setStep('form')}>
                ← 入力画面に戻る
              </button>

              <p className="info-text">
                コードが届かない場合は、迷惑メールフォルダをご確認ください
              </p>
            </form>
          )}

          <a href="/" className="back-link">← ログイン画面に戻る</a>
        </div>
      </div>
    </div>
  );
}
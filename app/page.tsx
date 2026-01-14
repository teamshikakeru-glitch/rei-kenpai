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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0a0f1a 0%, #1a1f2e 50%, #2a3040 100%)' }}>
      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .page-container { min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 60px 24px; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(201, 162, 39, 0.1); border: 1px solid rgba(201, 162, 39, 0.3); border-radius: 100px; font-size: 12px; color: #c9a227; letter-spacing: 0.1em; margin-bottom: 24px; animation: fadeUp 0.6s ease forwards; }
        .hero-title { font-size: 32px; font-weight: 300; color: #fff; text-align: center; line-height: 1.5; letter-spacing: 0.05em; margin-bottom: 20px; animation: fadeUp 0.6s ease forwards; animation-delay: 0.1s; opacity: 0; }
        .hero-title strong { font-weight: 600; background: linear-gradient(135deg, #c9a227, #e8c547); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .hero-subtitle { font-size: 14px; color: rgba(255,255,255,0.5); text-align: center; line-height: 2; max-width: 400px; margin: 0 auto 48px; animation: fadeUp 0.6s ease forwards; animation-delay: 0.2s; opacity: 0; }
        .login-card { width: 100%; max-width: 380px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px; padding: 40px 32px; backdrop-filter: blur(20px); animation: fadeUp 0.6s ease forwards; animation-delay: 0.3s; opacity: 0; }
        .login-logo { width: 64px; height: 64px; background: linear-gradient(145deg, #c9a227 0%, #a08020 100%); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 600; color: white; margin: 0 auto 20px; box-shadow: 0 8px 32px rgba(201, 162, 39, 0.3); }
        .login-title { font-size: 24px; font-weight: 300; color: #fff; text-align: center; letter-spacing: 0.2em; margin-bottom: 4px; }
        .login-subtitle-text { font-size: 11px; color: rgba(255,255,255,0.4); text-align: center; letter-spacing: 0.15em; margin-bottom: 32px; }
        .form-group { margin-bottom: 16px; }
        .form-label { display: block; font-size: 11px; font-weight: 500; color: rgba(255,255,255,0.5); margin-bottom: 8px; letter-spacing: 0.1em; }
        .login-input { width: 100%; padding: 16px 20px; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; font-size: 15px; color: #fff; background: rgba(255,255,255,0.05); transition: all 0.3s ease; box-sizing: border-box; }
        .login-input:focus { outline: none; border-color: #c9a227; background: rgba(255,255,255,0.08); }
        .login-input::placeholder { color: rgba(255,255,255,0.3); }
        .login-input.error { border-color: rgba(220, 38, 38, 0.5); }
        .field-error { font-size: 11px; color: #f87171; margin-top: 6px; display: flex; align-items: center; gap: 4px; }
        .field-error::before { content: "⚠"; }
        .login-btn { width: 100%; padding: 16px; background: linear-gradient(135deg, #c9a227 0%, #a08020 100%); color: #fff; border: none; border-radius: 12px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.3s ease; letter-spacing: 0.1em; margin-top: 8px; }
        .login-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(201, 162, 39, 0.4); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .error-message { background: rgba(220, 38, 38, 0.1); border: 1px solid rgba(220, 38, 38, 0.3); color: #f87171; padding: 12px 16px; border-radius: 10px; text-align: center; margin-bottom: 16px; font-size: 13px; }
        .login-footer { text-align: center; margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.08); }
        .login-footer-text { font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 12px; }
        .login-footer-link { color: #c9a227; text-decoration: none; font-weight: 500; }
        .login-footer-link:hover { text-decoration: underline; }
        .help-link { display: block; font-size: 12px; color: rgba(255,255,255,0.35); text-decoration: none; transition: color 0.3s ease; }
        .help-link:hover { color: #c9a227; }
        .brand-footer { margin-top: 48px; font-size: 10px; color: rgba(255,255,255,0.2); letter-spacing: 0.2em; animation: fadeUp 0.6s ease forwards; animation-delay: 0.4s; opacity: 0; }
        @media (max-width: 480px) { .page-container { padding: 40px 20px; } .hero-title { font-size: 24px; } .login-card { padding: 32px 24px; } }
      `}</style>

      <div className="page-container">
        <div className="hero-badge">
          <span>✦</span>
          <span>FOR FUNERAL DIRECTORS</span>
          <span>✦</span>
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

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">葬儀社名</label>
              <input
                type="text"
                className={`login-input ${nameError ? 'error' : ''}`}
                placeholder="ご登録の葬儀社名"
                value={funeralHomeName}
                onChange={(e) => setFuneralHomeName(e.target.value)}
                disabled={loading}
              />
              {nameError && <div className="field-error">{nameError}</div>}
            </div>
            
            <div className="form-group">
              <label className="form-label">パスワード</label>
              <input
                type="password"
                className="login-input"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <button type="submit" className="login-btn" disabled={loading || !!nameError}>
              {loading ? '認証中...' : 'ログイン'}
            </button>
          </form>

          <div className="login-footer">
            <p className="login-footer-text">
              初めての方は <a href="/admin/register" className="login-footer-link">新規登録</a>
            </p>
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
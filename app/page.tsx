'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [funeralHomeName, setFuneralHomeName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!funeralHomeName.trim()) {
      setError('葬儀社名を入力してください');
      setLoading(false);
      return;
    }

    try {
      const { data, error: dbError } = await supabase
        .from('funeral_homes')
        .select('*')
        .eq('name', funeralHomeName.trim())
        .single();

      if (dbError || !data) {
        setError('登録されていない葬儀社名です');
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
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(160deg, #0d1b2a 0%, #1b263b 50%, #415a77 100%)',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style jsx>{`
        .background-pattern {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 20% 80%, rgba(184, 134, 11, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(184, 134, 11, 0.08) 0%, transparent 50%);
          pointer-events: none;
        }
        .hero-section {
          text-align: center;
          color: white;
          margin-bottom: 2rem;
          max-width: 500px;
          z-index: 1;
        }
        .hero-title {
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        .hero-text {
          font-size: 0.9rem;
          line-height: 1.9;
          opacity: 0.85;
        }
        .login-container {
          width: 100%;
          max-width: 400px;
          position: relative;
          z-index: 1;
        }
        .login-card {
          background: rgba(255, 255, 255, 0.98);
          border-radius: 24px;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.1);
          overflow: hidden;
          backdrop-filter: blur(20px);
        }
        .login-header {
          padding: 3rem 2rem 2rem;
          text-align: center;
          position: relative;
        }
        .login-logo {
          width: 80px;
          height: 80px;
          background: linear-gradient(145deg, #c9a227 0%, #8b6914 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          margin: 0 auto 1.5rem;
          box-shadow: 
            0 10px 30px rgba(184, 134, 11, 0.4),
            inset 0 2px 4px rgba(255, 255, 255, 0.3);
          font-family: 'Noto Serif JP', serif;
        }
        .login-title {
          font-size: 2rem;
          font-weight: 300;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
          letter-spacing: 0.3em;
          font-family: 'Noto Serif JP', serif;
        }
        .login-subtitle {
          font-size: 0.8rem;
          color: #888;
          letter-spacing: 0.15em;
        }
        .login-body {
          padding: 0 2rem 2rem;
        }
        .login-divider {
          display: flex;
          align-items: center;
          margin: 1.5rem 0;
        }
        .login-divider::before,
        .login-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, #ddd, transparent);
        }
        .login-divider-text {
          padding: 0 1rem;
          font-size: 0.75rem;
          color: #999;
          letter-spacing: 0.1em;
        }
        .form-group {
          margin-bottom: 1rem;
        }
        .form-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #666;
          margin-bottom: 0.5rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .login-input {
          width: 100%;
          padding: 1rem 1.25rem;
          border: 2px solid #e8e8e8;
          border-radius: 12px;
          font-size: 1rem;
          color: #333;
          background: #fafafa;
          transition: all 0.3s ease;
          font-family: 'Noto Serif JP', serif;
          box-sizing: border-box;
        }
        .login-input:focus {
          outline: none;
          border-color: #c9a227;
          background: white;
          box-shadow: 0 0 0 4px rgba(201, 162, 39, 0.1);
        }
        .login-input::placeholder {
          color: #bbb;
        }
        .login-btn {
          width: 100%;
          padding: 1rem 1.5rem;
          background: linear-gradient(145deg, #1b263b 0%, #0d1b2a 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.1em;
          position: relative;
          overflow: hidden;
        }
        .login-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 0.5s ease;
        }
        .login-btn:hover::before {
          left: 100%;
        }
        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(13, 27, 42, 0.3);
        }
        .login-btn:active {
          transform: translateY(0);
        }
        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        .login-btn:disabled:hover {
          transform: none;
          box-shadow: none;
        }
        .error-message {
          background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
          border: 1px solid #fc8181;
          color: #c53030;
          padding: 1rem;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          animation: shake 0.5s ease;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .login-footer {
          text-align: center;
          padding: 1.5rem 2rem;
          background: #f8f8f8;
          border-top: 1px solid #eee;
        }
        .login-footer-text {
          font-size: 0.85rem;
          color: #666;
        }
        .login-footer-link {
          color: #1b263b;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s;
        }
        .login-footer-link:hover {
          color: #c9a227;
        }
        .brand-badge {
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.7rem;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.1em;
        }
        @media (max-width: 480px) {
          .hero-section {
            margin-bottom: 1.5rem;
          }
          .hero-title {
            font-size: 1.2rem;
          }
          .hero-text {
            font-size: 0.8rem;
          }
          .login-header {
            padding: 2rem 1.5rem 1.5rem;
          }
          .login-body {
            padding: 0 1.5rem 1.5rem;
          }
          .login-logo {
            width: 70px;
            height: 70px;
            font-size: 2rem;
          }
          .login-title {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="background-pattern"></div>

      {/* Hero Section */}
      <div className="hero-section">
        <h2 className="hero-title">
          「見積もりに勝つ」ための<br />
          献杯（支援金）ページ作成システム
        </h2>
        <p className="hero-text">
          基本情報を入力するだけで、ご遺族専用の受付ページを即座に発行。<br />
          現場のオペレーションを変えることなく、<br />
          集まった支援金で葬儀費用の負担を軽減します。
        </p>
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">礼</div>
            <h1 className="login-title">Rei</h1>
            <p className="login-subtitle">献杯管理システム</p>
          </div>

          <div className="login-body">
            <div className="login-divider">
              <span className="login-divider-text">葬儀社様専用</span>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">葬儀社名</label>
                <input
                  type="text"
                  className="login-input"
                  placeholder="ご登録の葬儀社名を入力"
                  value={funeralHomeName}
                  onChange={(e) => setFuneralHomeName(e.target.value)}
                  autoFocus
                  disabled={loading}
                />
              </div>
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? '認証中...' : 'ログイン'}
              </button>
            </form>
          </div>

          <div className="login-footer">
            <p className="login-footer-text">
              初めてご利用の方は <a href="/admin/register" className="login-footer-link">新規登録</a>
            </p>
          </div>
        </div>
      </div>

      <div className="brand-badge">POWERED BY REI</div>
    </div>
  );
}
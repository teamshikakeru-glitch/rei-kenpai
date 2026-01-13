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

    // Store funeral home ID in sessionStorage
    sessionStorage.setItem('funeral_home_id', data.id);
    sessionStorage.setItem('funeral_home_name', data.name);
    router.push('/admin');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #faf9f7 0%, #f0eeeb 100%)', padding: '1rem' }}>
      <style jsx>{`
        .login-container {
          width: 100%;
          max-width: 420px;
        }
        .login-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }
        .login-header {
          background: linear-gradient(135deg, #1e3a5f 0%, #2c4a6e 100%);
          color: white;
          padding: 2rem;
          text-align: center;
        }
        .login-logo {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #b8860b 0%, #d4a84b 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 600;
          margin: 0 auto 1rem;
          box-shadow: 0 4px 12px rgba(184, 134, 11, 0.3);
        }
        .login-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          letter-spacing: 0.1em;
        }
        .login-subtitle {
          font-size: 0.85rem;
          opacity: 0.9;
        }
        .login-body {
          padding: 2rem;
        }
        .login-description {
          text-align: center;
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }
        .login-input {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          text-align: center;
          transition: border-color 0.3s;
        }
        .login-input:focus {
          outline: none;
          border-color: #1e3a5f;
        }
        .login-input::placeholder {
          color: #aaa;
        }
        .login-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #1e3a5f 0%, #2c4a6e 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          margin-top: 1rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(30, 58, 95, 0.3);
        }
        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        .login-error {
          background: #fff5f5;
          border: 1px solid #fc8181;
          color: #c53030;
          padding: 0.75rem;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }
        .login-footer {
          text-align: center;
          padding: 1.5rem 2rem;
          background: #f9f9f9;
          border-top: 1px solid #eee;
        }
        .login-footer-text {
          font-size: 0.8rem;
          color: #888;
        }
        .login-footer-link {
          color: #1e3a5f;
          text-decoration: none;
          font-weight: 500;
        }
        .login-footer-link:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">礼</div>
            <h1 className="login-title">Rei</h1>
            <p className="login-subtitle">献杯管理システム</p>
          </div>

          <div className="login-body">
            <p className="login-description">
              ご登録済みの葬儀社名を入力して<br />
              ログインしてください
            </p>

            {error && <div className="login-error">{error}</div>}

            <form onSubmit={handleLogin}>
              <input
                type="text"
                className="login-input"
                placeholder="葬儀社名を入力"
                value={funeralHomeName}
                onChange={(e) => setFuneralHomeName(e.target.value)}
                autoFocus
              />
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'ログイン中...' : 'ログイン'}
              </button>
            </form>
          </div>

          <div className="login-footer">
            <p className="login-footer-text">
              新規登録は <a href="/admin/register" className="login-footer-link">こちら</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
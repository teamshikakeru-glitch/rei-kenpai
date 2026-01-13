'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name.trim()) {
      setError('葬儀社名を入力してください');
      setLoading(false);
      return;
    }

    // Check if already exists
    const { data: existing } = await supabase
      .from('funeral_homes')
      .select('id')
      .eq('name', formData.name.trim())
      .single();

    if (existing) {
      setError('この葬儀社名は既に登録されています');
      setLoading(false);
      return;
    }

    const { error: dbError } = await supabase
      .from('funeral_homes')
      .insert({
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        address: formData.address.trim() || null
      });

    if (dbError) {
      setError('登録に失敗しました: ' + dbError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #faf9f7 0%, #f0eeeb 100%)', padding: '1rem' }}>
      <style jsx>{`
        .register-container {
          width: 100%;
          max-width: 480px;
        }
        .register-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }
        .register-header {
          background: linear-gradient(135deg, #1e3a5f 0%, #2c4a6e 100%);
          color: white;
          padding: 1.5rem 2rem;
          text-align: center;
        }
        .register-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
        }
        .register-body {
          padding: 2rem;
        }
        .form-group {
          margin-bottom: 1.25rem;
        }
        .form-label {
          display: block;
          font-size: 0.9rem;
          font-weight: 500;
          color: #333;
          margin-bottom: 0.5rem;
        }
        .form-required {
          color: #dc2626;
          margin-left: 0.25rem;
        }
        .form-input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }
        .form-input:focus {
          outline: none;
          border-color: #1e3a5f;
        }
        .form-hint {
          font-size: 0.75rem;
          color: #888;
          margin-top: 0.25rem;
        }
        .register-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #1e3a5f 0%, #2c4a6e 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .register-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(30, 58, 95, 0.3);
        }
        .register-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        .error-message {
          background: #fff5f5;
          border: 1px solid #fc8181;
          color: #c53030;
          padding: 0.75rem;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }
        .success-message {
          background: #f0fff4;
          border: 1px solid #68d391;
          color: #276749;
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
          font-size: 0.95rem;
        }
        .back-link {
          display: block;
          text-align: center;
          margin-top: 1.5rem;
          color: #666;
          text-decoration: none;
          font-size: 0.9rem;
        }
        .back-link:hover {
          color: #1e3a5f;
        }
      `}</style>

      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h1 className="register-title">葬儀社 新規登録</h1>
          </div>

          <div className="register-body">
            {success ? (
              <div className="success-message">
                ✅ 登録が完了しました！<br />
                ログイン画面に移動します...
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                  <label className="form-label">
                    葬儀社名<span className="form-required">必須</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="例：〇〇葬儀社"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    autoFocus
                  />
                  <p className="form-hint">ログイン時に使用します</p>
                </div>

                <div className="form-group">
                  <label className="form-label">メールアドレス</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="例：info@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">電話番号</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="例：03-1234-5678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">住所</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="例：東京都〇〇区..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <button type="submit" className="register-btn" disabled={loading}>
                  {loading ? '登録中...' : '登録する'}
                </button>
              </form>
            )}

            <a href="/" className="back-link">← ログイン画面に戻る</a>
          </div>
        </div>
      </div>
    </div>
  );
}
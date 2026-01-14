'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#c9a227] to-[#8b6914] rounded-xl mb-4">
            <span className="text-white text-2xl font-bold">礼</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Rei</h1>
          <p className="text-gray-400 mt-2">パスワードをお忘れの方</p>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl p-8 shadow-xl">
          
          {step === 'email' && (
            <>
              <h2 className="text-xl font-bold text-white mb-2 text-center">メールアドレスの確認</h2>
              <p className="text-gray-400 text-sm text-center mb-6">
                ご登録のメールアドレスを入力してください。<br />
                パスワードリセット用の認証コードをお送りします。
              </p>
              
              <form onSubmit={handleSendCode} className="space-y-5">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">メールアドレス</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#c9a227] transition"
                    placeholder="email@example.com"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3">
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-[#c9a227] to-[#8b6914] text-white font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? '送信中...' : '認証コードを送信'}
                </button>
              </form>
            </>
          )}

          {step === 'code' && (
            <>
              <h2 className="text-xl font-bold text-white mb-2 text-center">認証コードの入力</h2>
              <p className="text-gray-400 text-sm text-center mb-6">
                <span className="text-[#c9a227]">{email}</span> に<br />
                6桁の認証コードを送信しました。
              </p>
              
              <form onSubmit={handleVerifyCode} className="space-y-5">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">認証コード</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-[#c9a227] transition"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3">
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="w-full py-3 bg-gradient-to-r from-[#c9a227] to-[#8b6914] text-white font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? '確認中...' : '確認する'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={handleResendCode}
                  disabled={loading}
                  className="text-[#c9a227] hover:text-[#d4af37] text-sm transition disabled:opacity-50"
                >
                  コードを再送信する
                </button>
              </div>

              <div className="mt-2 text-center">
                <button
                  onClick={() => { setStep('email'); setError(''); }}
                  className="text-gray-500 hover:text-gray-400 text-sm transition"
                >
                  メールアドレスを変更する
                </button>
              </div>
            </>
          )}

          {step === 'password' && (
            <>
              <h2 className="text-xl font-bold text-white mb-2 text-center">新しいパスワードの設定</h2>
              <p className="text-gray-400 text-sm text-center mb-6">
                新しいパスワードを入力してください。<br />
                6文字以上で設定してください。
              </p>
              
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">新しいパスワード</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#c9a227] transition"
                    placeholder="••••••••"
                    minLength={6}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">パスワード（確認）</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#c9a227] transition"
                    placeholder="••••••••"
                    minLength={6}
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3">
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-[#c9a227] to-[#8b6914] text-white font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? '更新中...' : 'パスワードを更新'}
                </button>
              </form>
            </>
          )}

          {step === 'complete' && (
            <>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">パスワードを更新しました</h2>
                <p className="text-gray-400 text-sm mb-6">
                  新しいパスワードでログインできます。
                </p>
                
                <Link
                  href="/"
                  className="inline-block w-full py-3 bg-gradient-to-r from-[#c9a227] to-[#8b6914] text-white font-bold rounded-lg hover:opacity-90 transition text-center"
                >
                  ログインページへ
                </Link>
              </div>
            </>
          )}

          {step !== 'complete' && (
            <div className="mt-6 pt-6 border-t border-[#333] text-center">
              <Link href="/" className="text-gray-500 hover:text-gray-400 text-sm transition">
                ← ログインページに戻る
              </Link>
            </div>
          )}
        </div>

        <p className="text-center text-gray-600 text-xs mt-8">
          © 2024 Rei. All rights reserved.
        </p>
      </div>
    </div>
  );
}
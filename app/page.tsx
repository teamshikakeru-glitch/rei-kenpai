'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: fetchError } = await supabase
        .from('funeral_homes')
        .select('id, name, password')
        .eq('email', email)
        .single();

      if (fetchError || !data) {
        setError('メールアドレスまたはパスワードが正しくありません');
        setLoading(false);
        return;
      }

      if (data.password !== password) {
        setError('メールアドレスまたはパスワードが正しくありません');
        setLoading(false);
        return;
      }

      localStorage.setItem('funeral_home_id', data.id);
      localStorage.setItem('funeral_home_name', data.name);
      
      router.push('/admin');
    } catch (err) {
      console.error('Login error:', err);
      setError('エラーが発生しました。もう一度お試しください。');
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
          <p className="text-gray-400 mt-2">献杯管理システム</p>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl p-8 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6 text-center">ログイン</h2>
          
          <form onSubmit={handleLogin} className="space-y-5">
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

            <div>
              <label className="block text-sm text-gray-400 mb-2">パスワード</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#c9a227] transition"
                placeholder="••••••••"
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
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#333]">
            <div className="text-center">
              <Link 
                href="/forgot-password" 
                className="text-[#c9a227] hover:text-[#d4af37] text-sm transition"
              >
                ログインでお困りの方はこちら
              </Link>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-gray-500 text-sm">
              アカウントをお持ちでない方は
              <Link href="/admin/register" className="text-[#c9a227] hover:text-[#d4af37] ml-1">
                新規登録
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-8">
          © 2024 Rei. All rights reserved.
        </p>
      </div>
    </div>
  );
}
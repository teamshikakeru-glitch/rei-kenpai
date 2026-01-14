'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function SettingsContent() {
  const [funeralHomeId, setFuneralHomeId] = useState<string | null>(null);
  const [funeralHomeName, setFuneralHomeName] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [stripeStatus, setStripeStatus] = useState<{ connected: boolean; onboarding_complete: boolean } | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      const storedId = sessionStorage.getItem('funeral_home_id');
      const storedName = sessionStorage.getItem('funeral_home_name');
      if (!storedId || !storedName) { router.replace('/'); return; }
      setFuneralHomeId(storedId);
      setFuneralHomeName(storedName);
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data } = await supabase.from('funeral_homes').select('email').eq('id', storedId).single();
      if (data) setCurrentEmail(data.email);
      await checkStripeStatus(storedId);
      setLoading(false);
    };
    fetchData();
  }, [router]);

  useEffect(() => {
    const stripeParam = searchParams.get('stripe');
    if (stripeParam === 'success' && funeralHomeId) checkStripeStatus(funeralHomeId);
  }, [searchParams, funeralHomeId]);

  const checkStripeStatus = async (homeId: string) => {
    try {
      const res = await fetch('/api/stripe/status', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ funeral_home_id: homeId }) });
      setStripeStatus(await res.json());
    } catch (e) { console.error(e); }
  };

  const handleStripeConnect = async () => {
    if (!funeralHomeId) return;
    setStripeLoading(true);
    try {
      const res = await fetch('/api/stripe/connect', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ funeral_home_id: funeralHomeId }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) { console.error(e); }
    setStripeLoading(false);
  };

  const handleLogout = () => { sessionStorage.clear(); router.replace('/'); };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0f1a', color: 'white' }}>読み込み中...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f0' }}>
      <aside style={{ width: 240, background: '#0a0f1a', padding: '24px 16px', position: 'fixed', top: 0, left: 0, bottom: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 24 }}>
          <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #c9a227, #a08020)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 20, fontWeight: 600 }}>礼</div>
          <div>
            <div style={{ color: 'white', fontSize: 20, fontWeight: 600 }}>Rei</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>献杯管理システム</div>
          </div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: '0.1em', padding: '8px 12px' }}>メインメニュー</div>
          <a href="/admin" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: 12, borderRadius: 8, fontSize: 14 }}>ホーム</a>
          <a href="/admin/payments" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: 12, borderRadius: 8, fontSize: 14 }}>ご入金管理</a>
          <a href="/admin/settings" style={{ color: '#c9a227', textDecoration: 'none', padding: 12, borderRadius: 8, fontSize: 14, background: 'rgba(201,162,39,0.15)' }}>入金口座連携</a>
        </nav>
        <button onClick={handleLogout} style={{ marginTop: 'auto', width: '100%', padding: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 13 }}>ログアウト</button>
      </aside>
      <main style={{ flex: 1, marginLeft: 240, padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '12px 16px', borderRadius: 10, marginBottom: 24 }}>
          <span><strong>{funeralHomeName}</strong> 様</span>
          <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #e5e5e5', padding: '8px 16px', borderRadius: 6, fontSize: 12, color: '#666', cursor: 'pointer' }}>ログアウト</button>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#1a1a1a', marginBottom: 8 }}>入金口座連携</h1>
        <p style={{ fontSize: 14, color: '#666', marginBottom: 32 }}>献杯金を受け取るための設定</p>
        <div style={{ background: 'white', borderRadius: 16, padding: 32, marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a', marginBottom: 24 }}>🏦 銀行口座の連携</h2>
          {stripeStatus?.onboarding_complete ? (
            <div style={{ padding: 16, borderRadius: 10, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <strong>✓ 連携完了</strong>
              <p style={{ fontSize: 12, color: '#666', marginTop: 4 }}>銀行口座が正常に連携されています。</p>
            </div>
          ) : (
            <div>
              <div style={{ padding: 16, borderRadius: 10, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', marginBottom: 20 }}>
                <strong>未連携</strong>
                <p style={{ fontSize: 12, color: '#666', marginTop: 4 }}>銀行口座を連携してください</p>
              </div>
              <button onClick={handleStripeConnect} disabled={stripeLoading} style={{ padding: '14px 24px', background: '#635bff', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, cursor: 'pointer' }}>
                {stripeLoading ? '処理中...' : '銀行口座を連携する'}
              </button>
            </div>
          )}
          <div style={{ background: '#f8f8f8', borderRadius: 10, padding: 16, marginTop: 24 }}>
            <p style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>手数料について</p>
            <p style={{ fontSize: 13 }}>Stripe: 3.6% / システム: 8% / お受け取り: 約88.4%</p>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: 16, padding: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a', marginBottom: 16 }}>✉️ アカウント情報</h2>
          <div style={{ background: '#f8f8f8', padding: 16, borderRadius: 10 }}>
            <p style={{ fontSize: 10, color: '#999' }}>メールアドレス</p>
            <p style={{ fontSize: 15, fontWeight: 500 }}>{currentEmail}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0f1a', color: 'white' }}>読み込み中...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
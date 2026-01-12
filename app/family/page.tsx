'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function FamilyPage() {
  const [formData, setFormData] = useState({ deceased_name: '', password: '' });
  const [project, setProject] = useState<any>(null);
  const [kenpaiList, setKenpaiList] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const supabase = createClient();

  const STRIPE_FEE_RATE = 0.036;
  const calculatePayout = (amount: number) => Math.floor(amount * (1 - STRIPE_FEE_RATE));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    if (!formData.deceased_name || !formData.password) { setError('すべての項目をご入力ください'); setLoading(false); return; }
    
    const { data: projectData, error: projectError } = await supabase.from('projects').select('*').eq('deceased_name', formData.deceased_name).eq('family_password', formData.password).single();
    
    if (projectError || !projectData) { setError('故人様のお名前またはパスワードが正しくありません'); setLoading(false); return; }
    
    const { data: kenpaiData } = await supabase.from('kenpai').select('*').eq('project_id', projectData.id).order('created_at', { ascending: false });
    
    setProject(projectData);
    setKenpaiList(kenpaiData || []);
    setAuthenticated(true);
    setLoading(false);
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
  const formatDateTime = (dateString: string) => { const d = new Date(dateString); return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`; };
  const totalAmount = kenpaiList.reduce((sum, k) => sum + k.amount, 0);
  const payoutAmount = calculatePayout(totalAmount);

  return (
    <div style={{ minHeight: '100vh', background: '#faf9f7', fontFamily: "'Noto Serif JP', serif" }}>
      <header style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e8e8e8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #b8860b, #d4a84b)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.1rem' }}>礼</span>
          <span style={{ fontSize: '1rem', letterSpacing: '0.1em' }}>Rei</span>
        </div>
      </header>

      <main style={{ padding: '3rem 1.5rem', maxWidth: '600px', margin: '0 auto' }}>
        {!authenticated ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>ご遺族様専用ページ</h1>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>入金状況をご確認いただけます</p>
            </div>
            <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
              <form onSubmit={handleSubmit}>
                {error && <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '0.9rem' }}>{error}</div>}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>故人様のお名前</label>
                  <input type="text" style={{ width: '100%', padding: '1rem', border: '1px solid #d4d4d4', borderRadius: '8px', fontSize: '1rem' }} placeholder="例：山田 太郎" value={formData.deceased_name} onChange={(e) => setFormData({ ...formData, deceased_name: e.target.value })} />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>パスワード</label>
                  <input type="password" style={{ width: '100%', padding: '1rem', border: '1px solid #d4d4d4', borderRadius: '8px', fontSize: '1rem', fontFamily: 'monospace' }} placeholder="葬儀社よりお知らせしたパスワード" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </div>
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '1rem', background: '#1a1a1a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>{loading ? '確認中...' : '確認する'}</button>
              </form>
            </div>
          </>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.85rem', color: '#8a8a8a', marginBottom: '0.5rem' }}>追悼</p>
              <h1 style={{ fontSize: '1.5rem' }}>故 {project.deceased_name} 様</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>お預かり総額</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>{formatCurrency(totalAmount)}</p>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>お振込予定額</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 600, color: '#2e7d32' }}>{formatCurrency(payoutAmount)}</p>
                <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.25rem' }}>手数料3.6%差引後</p>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
              <div style={{ padding: '1rem 1.5rem', background: '#f7f5f2', borderBottom: '1px solid #e8e8e8' }}>
                <h3 style={{ fontSize: '1rem' }}>献杯いただいた皆様（{kenpaiList.length}名）</h3>
              </div>
              {kenpaiList.length === 0 ? (
                <p style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>まだ献杯のお申し込みはございません</p>
              ) : (
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {kenpaiList.map((kenpai, index) => (
                    <div key={kenpai.id} style={{ padding: '1rem 1.5rem', borderBottom: index < kenpaiList.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: kenpai.message ? '0.75rem' : 0 }}>
                        <div>
                          <p style={{ fontWeight: 500 }}>{kenpai.donor_name === '匿名' ? '匿名の方' : `${kenpai.donor_name} 様`}</p>
                          <p style={{ fontSize: '0.75rem', color: '#999' }}>{formatDateTime(kenpai.created_at)}</p>
                        </div>
                        <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{formatCurrency(kenpai.amount)}</p>
                      </div>
                      {kenpai.message && (
                        <div style={{ padding: '0.75rem', background: '#faf9f7', borderRadius: '6px', fontSize: '0.9rem', color: '#555', lineHeight: 1.6 }}>
                          {kenpai.message}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => { setAuthenticated(false); setProject(null); setKenpaiList([]); setFormData({ deceased_name: '', password: '' }); }} style={{ display: 'block', margin: '2rem auto 0', padding: '0.75rem 2rem', background: 'white', border: '1px solid #d4d4d4', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>ログアウト</button>
          </>
        )}
      </main>
    </div>
  );
}
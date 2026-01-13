'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function PaymentsPage() {
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
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">礼</div>
          <div className="sidebar-logo-text">
            <h1>Rei</h1>
            <span>献杯管理システム</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-section-title">メインメニュー</div>
          <a href="/admin" className="sidebar-link">ホーム</a>
          <a href="/admin/payments" className="sidebar-link active">ご入金管理</a>
        </nav>
      </aside>
      <main className="main-content">
        <header className="page-header">
          <div>
            <h2 className="page-header-title">ご入金管理</h2>
            <p className="page-header-subtitle">ご遺族様向け入金状況確認</p>
          </div>
        </header>

        {!authenticated ? (
          <div style={{ maxWidth: '500px' }}>
            <div className="card">
              <div className="card-header"><h3 className="section-title">入金状況の確認</h3></div>
              <div className="card-body">
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>故人様のお名前と、葬儀社よりお知らせしたパスワードをご入力ください。</p>
                <form onSubmit={handleSubmit}>
                  {error && <div className="message message-error" style={{ marginBottom: '1rem' }}>{error}</div>}
                  <div className="form-group">
                    <label className="form-label">故人様のお名前</label>
                    <input type="text" className="form-input" placeholder="例：山田 太郎" value={formData.deceased_name} onChange={(e) => setFormData({ ...formData, deceased_name: e.target.value })} />
                  </div>
                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label className="form-label">パスワード</label>
                    <input type="password" className="form-input" style={{ fontFamily: 'monospace' }} placeholder="葬儀社よりお知らせしたパスワード" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>{loading ? '確認中...' : '確認する'}</button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f7f5f2', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.85rem', color: '#666' }}>現在表示中</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>故 {project.deceased_name} 様</p>
              </div>
              <button onClick={() => { setAuthenticated(false); setProject(null); setKenpaiList([]); setFormData({ deceased_name: '', password: '' }); }} className="btn btn-secondary">別の案件を確認</button>
            </div>

            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '1.5rem' }}>
              <div className="stat-card">
                <div className="stat-label">献杯件数</div>
                <div className="stat-value">{kenpaiList.length}<span className="stat-value-unit">件</span></div>
              </div>
              <div className="stat-card">
                <div className="stat-label">お預かり総額</div>
                <div className="stat-value">{formatCurrency(totalAmount)}</div>
              </div>
              <div className="stat-card" style={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)' }}>
                <div className="stat-label">お振込予定額</div>
                <div className="stat-value" style={{ color: '#2e7d32' }}>{formatCurrency(payoutAmount)}</div>
                <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.25rem' }}>手数料3.6%差引後</div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="section-title">献杯いただいた皆様</h3>
                <span style={{ fontSize: '0.875rem', color: 'var(--sumi-500)' }}>全{kenpaiList.length}件</span>
              </div>
              <div className="table-container">
                {kenpaiList.length === 0 ? (
                  <p style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>まだ献杯のお申し込みはございません</p>
                ) : (
                  <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {kenpaiList.map((kenpai, index) => (
                      <div key={kenpai.id} style={{ padding: '1rem 1.5rem', borderBottom: index < kenpaiList.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: kenpai.message ? '0.75rem' : 0 }}>
                          <div>
                            <p style={{ fontWeight: 500, fontSize: '1rem' }}>{kenpai.donor_name === '匿名' ? '匿名の方' : `${kenpai.donor_name} 様`}</p>
                            <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.25rem' }}>{formatDateTime(kenpai.created_at)}</p>
                          </div>
                          <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{formatCurrency(kenpai.amount)}</p>
                        </div>
                        {kenpai.message && (
                          <div style={{ padding: '0.75rem', background: '#faf9f7', borderRadius: '6px', fontSize: '0.9rem', color: '#555', lineHeight: 1.6 }}>
                            <p style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.25rem' }}>メッセージ</p>
                            {kenpai.message}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
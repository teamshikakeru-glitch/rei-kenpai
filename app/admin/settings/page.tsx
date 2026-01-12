'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', bank_name: '', bank_branch: '', bank_account_type: '', bank_account_number: '', bank_account_holder: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [funeralHomeId, setFuneralHomeId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('funeral_homes').select('*').limit(1).single();
      if (data) {
        setFuneralHomeId(data.id);
        setFormData({ name: data.name || '', email: data.email || '', phone: data.phone || '', address: data.address || '', bank_name: data.bank_name || '', bank_branch: data.bank_branch || '', bank_account_type: data.bank_account_type || '', bank_account_number: data.bank_account_number || '', bank_account_holder: data.bank_account_holder || '' });
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setMessage(null);
    if (!funeralHomeId) { setMessage({ type: 'error', text: '葬儀社情報が見つかりません' }); setSaving(false); return; }
    const { error } = await supabase.from('funeral_homes').update(formData).eq('id', funeralHomeId);
    if (error) { setMessage({ type: 'error', text: '保存に失敗しました: ' + error.message }); } else { setMessage({ type: 'success', text: '保存しました' }); }
    setSaving(false); setTimeout(() => setMessage(null), 3000);
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>読み込み中...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside className="sidebar">
        <div className="sidebar-logo"><div className="sidebar-logo-icon">礼</div><div className="sidebar-logo-text"><h1>Rei</h1><span>献杯管理システム</span></div></div>
        <nav className="sidebar-nav">
          <div style={{ marginBottom: '1.5rem' }}><div className="sidebar-section-title">メインメニュー</div><a href="/admin" className="sidebar-link">ホーム</a><a href="/admin/projects" className="sidebar-link">ご案件一覧</a><a href="/admin/payments" className="sidebar-link">ご入金管理</a></div>
          <div><div className="sidebar-section-title">設定</div><a href="/admin/settings" className="sidebar-link active">アカウント設定</a></div>
        </nav>
      </aside>
      <main className="main-content">
        <header className="page-header"><div><h2 className="page-header-title">アカウント設定</h2><p className="page-header-subtitle">葬儀社情報の管理</p></div></header>
        <form onSubmit={handleSubmit}>
          {message && <div className={`message ${message.type === 'success' ? 'message-success' : 'message-error'}`} style={{ marginBottom: '1.5rem' }}>{message.text}</div>}
          
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-header"><h3 className="section-title">基本情報</h3></div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group"><label className="form-label">葬儀社名</label><input type="text" className="form-input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">メールアドレス</label><input type="email" className="form-input" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">電話番号</label><input type="tel" className="form-input" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">住所</label><input type="text" className="form-input" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} /></div>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-header"><h3 className="section-title">振込先口座情報</h3></div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group"><label className="form-label">銀行名</label><input type="text" className="form-input" placeholder="例：三菱UFJ銀行" value={formData.bank_name} onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">支店名</label><input type="text" className="form-input" placeholder="例：新宿支店" value={formData.bank_branch} onChange={(e) => setFormData({ ...formData, bank_branch: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">口座種別</label><select className="form-input" value={formData.bank_account_type} onChange={(e) => setFormData({ ...formData, bank_account_type: e.target.value })}><option value="">選択してください</option><option value="普通">普通</option><option value="当座">当座</option></select></div>
                <div className="form-group"><label className="form-label">口座番号</label><input type="text" className="form-input" placeholder="例：1234567" value={formData.bank_account_number} onChange={(e) => setFormData({ ...formData, bank_account_number: e.target.value })} /></div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">口座名義（カナ）</label><input type="text" className="form-input" placeholder="例：カ）ヤマダソウサイ" value={formData.bank_account_holder} onChange={(e) => setFormData({ ...formData, bank_account_holder: e.target.value })} /></div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}><button type="submit" className="btn btn-primary" disabled={saving}>{saving ? '保存中...' : '保存する'}</button></div>
        </form>
      </main>
    </div>
  );
}
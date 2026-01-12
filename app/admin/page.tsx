'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState({ total_projects: 0, active_projects: 0 });
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ deceased_name: '', slug: '', family_message: '', use_default_message: true, family_password: '' });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [funeralHomeId, setFuneralHomeId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const fetchData = async () => {
    try {
      const { data: funeralData } = await supabase.from('funeral_homes').select('*').limit(1).single();
      if (funeralData) setFuneralHomeId(funeralData.id);
      const { data: projectsData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      setProjects(projectsData || []);
      setStats({
        total_projects: projectsData?.length || 0,
        active_projects: projectsData?.filter((p) => p.status === 'active').length || 0
      });
    } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSlugChange = (value: string) => { setFormData({ ...formData, slug: value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') }); };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setPhotoFile(file); const reader = new FileReader(); reader.onloadend = () => setPhotoPreview(reader.result as string); reader.readAsDataURL(file); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setMessage(null); setSubmitting(true);
    if (!formData.deceased_name || !formData.slug || !formData.family_password) { setMessage({ type: 'error', text: '必須項目をご入力ください' }); setSubmitting(false); return; }
    if (formData.family_password.length < 4) { setMessage({ type: 'error', text: 'パスワードは4文字以上でご設定ください' }); setSubmitting(false); return; }
    if (!funeralHomeId) { setMessage({ type: 'error', text: '葬儀社情報が見つかりません' }); setSubmitting(false); return; }
    let photoUrl = null;
    if (photoFile) {
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `${formData.slug}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('photos').upload(fileName, photoFile);
      if (uploadError) { setMessage({ type: 'error', text: '写真のアップロードに失敗しました' }); setSubmitting(false); return; }
      const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(fileName);
      photoUrl = publicUrl;
    }
    const { error } = await supabase.from('projects').insert({ funeral_home_id: funeralHomeId, deceased_name: formData.deceased_name, slug: formData.slug, status: 'draft', photo_url: photoUrl, family_message: formData.use_default_message ? null : formData.family_message, use_default_message: formData.use_default_message, family_password: formData.family_password });
    if (error) { setMessage({ type: 'error', text: error.code === '23505' ? 'このURLは既に使用されております' : 'エラー: ' + error.message }); setSubmitting(false); return; }
    setMessage({ type: 'success', text: 'ご案件を作成いたしました' });
    setFormData({ deceased_name: '', slug: '', family_message: '', use_default_message: true, family_password: '' });
    setPhotoFile(null); setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    fetchData(); setSubmitting(false); setTimeout(() => setMessage(null), 3000);
  };

  const updateStatus = async (projectId: string, newStatus: string) => { await supabase.from('projects').update({ status: newStatus }).eq('id', projectId); fetchData(); };

  const today = new Date(); const japaneseYear = today.getFullYear() - 2018;
  const toKanji = (n: number) => { const k = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']; if (n <= 10) return k[n]; if (n < 20) return '十' + k[n - 10]; return k[Math.floor(n / 10)] + '十' + (n % 10 ? k[n % 10] : ''); };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>読み込み中...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <style jsx>{`
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 56px;
          background: linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%);
          z-index: 1000;
          align-items: center;
          justify-content: space-between;
          padding: 0 1rem;
        }
        .mobile-menu-btn {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
        }
        .mobile-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: white;
        }
        .mobile-logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #b8860b 0%, #d4a84b 100%);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: 600;
        }
        .mobile-nav {
          display: none;
          position: fixed;
          top: 56px;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.95);
          z-index: 999;
          flex-direction: column;
          padding: 1rem;
        }
        .mobile-nav.open {
          display: flex;
        }
        .mobile-nav-link {
          color: white;
          text-decoration: none;
          padding: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          font-size: 1rem;
        }
        .mobile-nav-link:hover {
          background: rgba(255,255,255,0.1);
        }
        @media (max-width: 768px) {
          .mobile-header {
            display: flex;
          }
          .form-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .main-content {
            margin-left: 0 !important;
            padding-top: 72px !important;
          }
        }
      `}</style>

      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="mobile-logo">
          <div className="mobile-logo-icon">礼</div>
          <span style={{ fontWeight: 500 }}>Rei</span>
        </div>
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="/admin" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>🏠 ホーム</a>
        <a href="/admin/projects" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>📋 ご案件一覧</a>
        <a href="/admin/payments" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>💰 ご入金管理</a>
        <a href="/admin/settings" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>⚙️ アカウント設定</a>
      </div>

      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo"><div className="sidebar-logo-icon">礼</div><div className="sidebar-logo-text"><h1>Rei</h1><span>献杯管理システム</span></div></div>
        <nav className="sidebar-nav">
          <div style={{ marginBottom: '1.5rem' }}><div className="sidebar-section-title">メインメニュー</div><a href="/admin" className="sidebar-link active">ホーム</a><a href="/admin/projects" className="sidebar-link">ご案件一覧</a><a href="/admin/payments" className="sidebar-link">ご入金管理</a></div>
          <div><div className="sidebar-section-title">設定</div><a href="/admin/settings" className="sidebar-link">アカウント設定</a></div>
        </nav>
      </aside>

      <main className="main-content">
        <header className="page-header"><div><h2 className="page-header-title">ご案件管理</h2><p className="page-header-subtitle">献杯ページの作成・管理</p></div><div className="page-header-date"><div className="page-header-date-main">令和{toKanji(japaneseYear)}年 {toKanji(today.getMonth() + 1)}月{toKanji(today.getDate())}日</div><div>{['日', '月', '火', '水', '木', '金', '土'][today.getDay()]}曜日</div></div></header>

        {/* New Project Form */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header"><h3 className="section-title">新規ご案件作成</h3></div>
          <div className="card-body">
            {!funeralHomeId && <div className="message message-error" style={{ marginBottom: '1rem' }}>葬儀社情報が見つかりません</div>}
            <form onSubmit={handleSubmit}>
              {message && <div className={`message ${message.type === 'success' ? 'message-success' : 'message-error'}`}>{message.text}</div>}
              <div className="form-grid">
                <div className="form-group"><label className="form-label">故人様のお名前<span className="form-label-required">必須</span></label><input type="text" className="form-input" placeholder="例：山田 太郎" value={formData.deceased_name} onChange={(e) => setFormData({ ...formData, deceased_name: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">URL用ID<span className="form-label-required">必須</span></label><input type="text" className="form-input" placeholder="例：yamada-taro" value={formData.slug} onChange={(e) => handleSlugChange(e.target.value)} /></div>
              </div>
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label className="form-label">ご遺族様用パスワード<span className="form-label-required">必須</span></label>
                <input type="text" className="form-input" style={{ fontFamily: 'monospace', letterSpacing: '0.1em' }} placeholder="例：1234" value={formData.family_password} onChange={(e) => setFormData({ ...formData, family_password: e.target.value })} />
                <p className="form-hint">ご遺族様が入金状況を確認する際に使用（4文字以上）</p>
              </div>
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label className="form-label">ご遺影のお写真</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  {photoPreview && <div style={{ width: '100px', height: '125px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e0e0e0' }}><img src={photoPreview} alt="プレビュー" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
                  <div style={{ flex: 1, minWidth: '150px' }}><input type="file" ref={fileInputRef} accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} /><button type="button" className="btn btn-secondary" onClick={() => fileInputRef.current?.click()} style={{ width: '100%' }}>{photoPreview ? '写真を変更' : '写真を選択'}</button><p className="form-hint" style={{ marginTop: '0.5rem' }}>献杯ページに表示（任意）</p></div>
                </div>
              </div>
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label className="form-label">ご遺族様からのメッセージ</label>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.5rem', fontSize: '0.9rem' }}><input type="radio" name="messageType" checked={formData.use_default_message} onChange={() => setFormData({ ...formData, use_default_message: true, family_message: '' })} /><span>定型文を使用</span></label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}><input type="radio" name="messageType" checked={!formData.use_default_message} onChange={() => setFormData({ ...formData, use_default_message: false })} /><span>カスタムメッセージ</span></label>
                </div>
                {!formData.use_default_message && <textarea className="form-input" style={{ minHeight: '100px', resize: 'vertical' }} placeholder="例：父は生前、皆様との出会いに深く感謝しておりました。" value={formData.family_message} onChange={(e) => setFormData({ ...formData, family_message: e.target.value })} />}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--sumi-100)', flexWrap: 'wrap' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: '1', minWidth: '120px' }}>キャンセル</button>
                <button type="submit" className="btn btn-primary" style={{ flex: '1', minWidth: '120px' }} disabled={!funeralHomeId || submitting}>{submitting ? '作成中...' : '＋ ご案件を作成'}</button>
              </div>
            </form>
          </div>
        </div>

        {/* Stats - Only show project counts for privacy */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="stat-card">
            <div className="stat-label">総ご案件数</div>
            <div className="stat-value">{stats.total_projects}<span className="stat-value-unit">件</span></div>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)' }}>
            <div className="stat-label">進行中</div>
            <div className="stat-value" style={{ color: '#2e7d32' }}>{stats.active_projects}<span className="stat-value-unit">件</span></div>
          </div>
        </div>

        {/* Project List - Privacy Protected */}
        <div className="card">
          <div className="card-header">
            <h3 className="section-title">ご案件一覧</h3>
            <span style={{ fontSize: '0.75rem', color: '#999' }}>🔒 プライバシー保護</span>
          </div>
          <div style={{ padding: '1rem' }}>
            {projects.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>ご案件がございません</p>
            ) : projects.map((project) => (
              <div key={project.id} style={{ 
                background: '#fff', 
                border: '1px solid #e8e8e8', 
                borderRadius: '10px', 
                padding: '1rem', 
                marginBottom: '0.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className={`status-badge ${project.status === 'active' ? 'status-active' : project.status === 'closed' ? 'status-closed' : 'status-draft'}`}>
                    {project.status === 'active' ? '受付中' : project.status === 'closed' ? '終了' : '準備中'}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>
                    案件ID: {project.slug}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {project.status === 'draft' && (
                    <button className="action-btn" onClick={() => updateStatus(project.id, 'active')} style={{ background: 'rgba(72,187,120,0.1)', color: '#276749' }}>公開</button>
                  )}
                  {project.status === 'active' && (
                    <button className="action-btn" onClick={() => updateStatus(project.id, 'closed')}>終了</button>
                  )}
                  {project.status === 'closed' && (
                    <button className="action-btn" onClick={() => updateStatus(project.id, 'active')} style={{ background: 'rgba(72,187,120,0.1)', color: '#276749' }}>再開</button>
                  )}
                  <a href={`/${project.slug}`} target="_blank" className="action-btn" style={{ textDecoration: 'none' }}>表示</a>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '0 1rem 1rem', borderTop: '1px solid #e8e8e8', marginTop: '0.5rem', paddingTop: '1rem' }}>
            <p style={{ fontSize: '0.8rem', color: '#888', textAlign: 'center' }}>
              💡 金額・故人様名の詳細は「ご入金管理」からご確認ください
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
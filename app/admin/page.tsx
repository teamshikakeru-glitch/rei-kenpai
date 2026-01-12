'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState({ total_projects: 0, active_projects: 0, total_amount_this_month: 0, total_payout: 0 });
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ deceased_name: '', slug: '', family_message: '', use_default_message: true, family_password: '' });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [funeralHomeId, setFuneralHomeId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projectKenpai, setProjectKenpai] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const STRIPE_FEE_RATE = 0.036;
  const calculatePayout = (amount: number) => Math.floor(amount * (1 - STRIPE_FEE_RATE));

  const fetchData = async () => {
    try {
      const { data: funeralData } = await supabase.from('funeral_homes').select('*').limit(1).single();
      if (funeralData) setFuneralHomeId(funeralData.id);
      const { data: projectsData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      const projectsWithAmount = await Promise.all((projectsData || []).map(async (project) => {
        const { data: kenpaiList } = await supabase.from('kenpai').select('*').eq('project_id', project.id).order('created_at', { ascending: false });
        const total = kenpaiList?.reduce((sum, k) => sum + k.amount, 0) || 0;
        return { ...project, total_amount: total, payout_amount: calculatePayout(total), kenpai_count: kenpaiList?.length || 0 };
      }));
      setProjects(projectsWithAmount);
      const startOfMonth = new Date(); startOfMonth.setDate(1); startOfMonth.setHours(0, 0, 0, 0);
      const { data: kenpaiData } = await supabase.from('kenpai').select('amount').gte('created_at', startOfMonth.toISOString());
      const totalThisMonth = kenpaiData?.reduce((sum, k) => sum + k.amount, 0) || 0;
      setStats({ total_projects: projectsData?.length || 0, active_projects: projectsData?.filter((p) => p.status === 'active').length || 0, total_amount_this_month: totalThisMonth, total_payout: calculatePayout(totalThisMonth) });
    } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchData();
    const channel = supabase.channel('kenpai-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'kenpai' }, () => { fetchData(); }).subscribe();
    return () => { supabase.removeChannel(channel); };
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

  const showProjectDetail = async (project: any) => {
    setSelectedProject(project);
    const { data } = await supabase.from('kenpai').select('*').eq('project_id', project.id).order('created_at', { ascending: false });
    setProjectKenpai(data || []);
  };

  const formatDateTime = (dateString: string) => { const d = new Date(dateString); return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`; };
  const formatCurrency = (amount: number) => new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
  const formatCurrencyShort = (amount: number) => {
    if (amount >= 10000) {
      return `¥${Math.floor(amount / 10000)}万`;
    }
    return `¥${amount.toLocaleString()}`;
  };
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
        .stats-grid-custom {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        .mobile-table {
          display: none;
        }
        .desktop-table {
          display: block;
        }
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .stats-grid-custom {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }
          .mobile-table {
            display: block;
          }
          .desktop-table {
            display: none;
          }
        }
      `}</style>

      <aside className="sidebar">
        <div className="sidebar-logo"><div className="sidebar-logo-icon">礼</div><div className="sidebar-logo-text"><h1>Rei</h1><span>献杯管理システム</span></div></div>
        <nav className="sidebar-nav">
          <div style={{ marginBottom: '1.5rem' }}><div className="sidebar-section-title">メインメニュー</div><a href="/admin" className="sidebar-link active">ホーム</a><a href="/admin/projects" className="sidebar-link">ご案件一覧</a><a href="/admin/payments" className="sidebar-link">ご入金管理</a></div>
          <div><div className="sidebar-section-title">設定</div><a href="/admin/settings" className="sidebar-link">アカウント設定</a></div>
        </nav>
      </aside>

      <main className="main-content">
        <header className="page-header"><div><h2 className="page-header-title">ご案件管理</h2><p className="page-header-subtitle">献杯ページの作成・管理</p></div><div className="page-header-date"><div className="page-header-date-main">令和{toKanji(japaneseYear)}年 {toKanji(today.getMonth() + 1)}月{toKanji(today.getDate())}日</div><div>{['日', '月', '火', '水', '木', '金', '土'][today.getDay()]}曜日</div></div></header>

        {selectedProject && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }} onClick={() => setSelectedProject(null)}>
            <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1rem' }}>故 {selectedProject.deceased_name} 様</h3>
                <button onClick={() => setSelectedProject(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#999' }}>×</button>
              </div>
              <div style={{ padding: '1rem 1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ padding: '0.875rem', background: '#f7f5f2', borderRadius: '8px' }}><p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>集金総額</p><p style={{ fontSize: '1.25rem', fontWeight: 600 }}>{formatCurrency(selectedProject.total_amount)}</p></div>
                  <div style={{ padding: '0.875rem', background: '#e8f5e9', borderRadius: '8px' }}><p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>還元額</p><p style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2e7d32' }}>{formatCurrency(selectedProject.payout_amount)}</p></div>
                </div>
                <div style={{ padding: '0.875rem', background: '#fff3e0', borderRadius: '8px', marginBottom: '1rem' }}><p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>ご遺族様用パスワード</p><p style={{ fontSize: '1.125rem', fontWeight: 600, fontFamily: 'monospace' }}>{selectedProject.family_password}</p></div>
                <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: '#666' }}>献杯履歴（{projectKenpai.length}件）</h4>
                <div style={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid #e8e8e8', borderRadius: '8px' }}>
                  {projectKenpai.length === 0 ? (<p style={{ padding: '1.5rem', textAlign: 'center', color: '#999', fontSize: '0.875rem' }}>まだ献杯がございません</p>) : projectKenpai.map((k, i) => (
                    <div key={k.id} style={{ padding: '0.625rem 0.875rem', borderBottom: i < projectKenpai.length - 1 ? '1px solid #f0f0f0' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div><p style={{ fontWeight: 500, fontSize: '0.875rem' }}>{k.donor_name === '匿名' ? '匿名の方' : `${k.donor_name} 様`}</p><p style={{ fontSize: '0.7rem', color: '#999' }}>{formatDateTime(k.created_at)}</p></div>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{formatCurrency(k.amount)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

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

        <div className="stats-grid-custom" style={{ marginBottom: '1.5rem' }}>
          <div className="stat-card"><div className="stat-label">総案件数</div><div className="stat-value">{stats.total_projects}<span className="stat-value-unit">件</span></div></div>
          <div className="stat-card"><div className="stat-label">進行中</div><div className="stat-value">{stats.active_projects}<span className="stat-value-unit">件</span></div></div>
          <div className="stat-card"><div className="stat-label">今月の集金</div><div className="stat-value" style={{ fontSize: '1.5rem' }}>{formatCurrencyShort(stats.total_amount_this_month)}</div></div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)' }}><div className="stat-label">今月の還元</div><div className="stat-value" style={{ color: '#2e7d32', fontSize: '1.5rem' }}>{formatCurrencyShort(stats.total_payout)}</div></div>
        </div>

        <div className="card">
          <div className="card-header"><h3 className="section-title">ご案件一覧</h3><span style={{ fontSize: '0.75rem', color: '#999' }}>🔄 更新中</span></div>
          
          {/* Desktop Table */}
          <div className="desktop-table">
            <div className="table-container">
              <table className="table"><thead><tr><th>故人様</th><th>集金額</th><th>還元額</th><th>献杯</th><th>状態</th><th>操作</th></tr></thead>
                <tbody>{projects.length === 0 ? <tr><td colSpan={6} className="table-empty">ご案件がございません</td></tr> : projects.map((project) => (
                  <tr key={project.id}>
                    <td className="table-name" style={{ cursor: 'pointer' }} onClick={() => showProjectDetail(project)}><span style={{ borderBottom: '1px dashed #999' }}>{project.deceased_name} 様</span></td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(project.total_amount)}</td>
                    <td style={{ color: '#2e7d32', fontWeight: 500 }}>{formatCurrency(project.payout_amount)}</td>
                    <td>{project.kenpai_count}件</td>
                    <td><span className={`status-badge ${project.status === 'active' ? 'status-active' : project.status === 'closed' ? 'status-closed' : 'status-draft'}`}>{project.status === 'active' ? '受付中' : project.status === 'closed' ? '終了' : '準備中'}</span></td>
                    <td>
                      <div className="action-buttons">
                        {project.status === 'draft' && <button className="action-btn" onClick={() => updateStatus(project.id, 'active')} style={{ background: 'rgba(72,187,120,0.1)', color: '#276749' }}>公開</button>}
                        {project.status === 'active' && <button className="action-btn" onClick={() => updateStatus(project.id, 'closed')}>終了</button>}
                        {project.status === 'closed' && <button className="action-btn" onClick={() => updateStatus(project.id, 'active')} style={{ background: 'rgba(72,187,120,0.1)', color: '#276749' }}>再開</button>}
                        <button className="action-btn" onClick={() => showProjectDetail(project)}>詳細</button>
                        <a href={`/${project.slug}`} target="_blank" className="action-btn" style={{ textDecoration: 'none' }}>表示</a>
                      </div>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-table" style={{ padding: '0.75rem' }}>
            {projects.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>ご案件がございません</p>
            ) : projects.map((project) => (
              <div key={project.id} style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '1rem' }} onClick={() => showProjectDetail(project)}>{project.deceased_name} 様</span>
                  <span className={`status-badge ${project.status === 'active' ? 'status-active' : project.status === 'closed' ? 'status-closed' : 'status-draft'}`}>
                    {project.status === 'active' ? '受付中' : project.status === 'closed' ? '終了' : '準備中'}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.75rem', background: '#f9f9f9', borderRadius: '8px', padding: '0.75rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.65rem', color: '#888', marginBottom: '0.125rem' }}>集金額</p>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{formatCurrencyShort(project.total_amount)}</p>
                  </div>
                  <div style={{ textAlign: 'center', borderLeft: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0' }}>
                    <p style={{ fontSize: '0.65rem', color: '#888', marginBottom: '0.125rem' }}>還元額</p>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#2e7d32' }}>{formatCurrencyShort(project.payout_amount)}</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.65rem', color: '#888', marginBottom: '0.125rem' }}>献杯数</p>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{project.kenpai_count}件</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {project.status === 'draft' && <button className="action-btn" onClick={() => updateStatus(project.id, 'active')} style={{ flex: 1, background: 'rgba(72,187,120,0.1)', color: '#276749', padding: '0.5rem' }}>公開</button>}
                  {project.status === 'active' && <button className="action-btn" onClick={() => updateStatus(project.id, 'closed')} style={{ flex: 1, padding: '0.5rem' }}>終了</button>}
                  {project.status === 'closed' && <button className="action-btn" onClick={() => updateStatus(project.id, 'active')} style={{ flex: 1, background: 'rgba(72,187,120,0.1)', color: '#276749', padding: '0.5rem' }}>再開</button>}
                  <button className="action-btn" onClick={() => showProjectDetail(project)} style={{ flex: 1, padding: '0.5rem' }}>詳細</button>
                  <a href={`/${project.slug}`} target="_blank" className="action-btn" style={{ flex: 1, textDecoration: 'none', textAlign: 'center', padding: '0.5rem' }}>表示</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
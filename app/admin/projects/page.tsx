'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchData = async () => {
    const { data: projectsData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    const projectsWithAmount = await Promise.all((projectsData || []).map(async (project) => {
      const { data: kenpaiList } = await supabase.from('kenpai').select('amount').eq('project_id', project.id);
      return { ...project, total_amount: kenpaiList?.reduce((sum, k) => sum + k.amount, 0) || 0 };
    }));
    setProjects(projectsWithAmount); setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (projectId: string, newStatus: string) => { await supabase.from('projects').update({ status: newStatus }).eq('id', projectId); fetchData(); };
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('ja-JP');
  const formatCurrency = (amount: number) => new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>読み込み中...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside className="sidebar">
        <div className="sidebar-logo"><div className="sidebar-logo-icon">礼</div><div className="sidebar-logo-text"><h1>Rei</h1><span>献杯管理システム</span></div></div>
        <nav className="sidebar-nav">
          <div style={{ marginBottom: '1.5rem' }}><div className="sidebar-section-title">メインメニュー</div><a href="/admin" className="sidebar-link">ホーム</a><a href="/admin/projects" className="sidebar-link active">ご案件一覧</a><a href="/admin/payments" className="sidebar-link">ご入金管理</a></div>
          <div><div className="sidebar-section-title">設定</div><a href="/admin/settings" className="sidebar-link">アカウント設定</a></div>
        </nav>
      </aside>
      <main className="main-content">
        <header className="page-header"><div><h2 className="page-header-title">ご案件一覧</h2><p className="page-header-subtitle">すべてのご案件を管理</p></div></header>
        <div className="card">
          <div className="card-header"><h3 className="section-title">ご案件一覧</h3><span style={{ fontSize: '0.875rem', color: 'var(--sumi-500)' }}>全{projects.length}件</span></div>
          <div className="table-container">
            <table className="table"><thead><tr><th>故人様のお名前</th><th>スラッグ</th><th>ご入金額</th><th>状態</th><th>作成日</th><th>操作</th></tr></thead>
              <tbody>{projects.length === 0 ? <tr><td colSpan={6} className="table-empty">ご案件がございません</td></tr> : projects.map((project) => (
                <tr key={project.id}><td className="table-name">{project.deceased_name} 様</td><td><span className="table-slug">{project.slug}</span></td><td>{formatCurrency(project.total_amount || 0)}</td><td><span className={`status-badge ${project.status === 'active' ? 'status-active' : project.status === 'closed' ? 'status-closed' : 'status-draft'}`}>{project.status === 'active' ? '受付中' : project.status === 'closed' ? '終了' : '準備中'}</span></td><td>{formatDate(project.created_at)}</td>
                  <td><div className="action-buttons">{project.status === 'draft' && <button className="action-btn" onClick={() => updateStatus(project.id, 'active')} style={{ background: 'rgba(72,187,120,0.1)', color: '#276749' }}>公開</button>}{project.status === 'active' && <button className="action-btn" onClick={() => updateStatus(project.id, 'closed')}>終了</button>}<a href={`/${project.slug}`} target="_blank" className="action-btn" style={{ textDecoration: 'none' }}>表示</a></div></td></tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
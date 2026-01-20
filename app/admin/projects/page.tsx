'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [donations, setDonations] = useState<{ [projectId: string]: any[] }>({});
  const [loading, setLoading] = useState(true);
  const [funeralHomeId, setFuneralHomeId] = useState<string | null>(null);
  const [funeralHomeName, setFuneralHomeName] = useState<string>('');
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedId = sessionStorage.getItem('funeral_home_id');
    const storedName = sessionStorage.getItem('funeral_home_name');
    if (!storedId || !storedName) {
      router.replace('/');
      return;
    }
    setFuneralHomeId(storedId);
    setFuneralHomeName(storedName);
    fetchData(storedId);
  }, [router]);

  const fetchData = async (homeId: string) => {
    // 自社のプロジェクトのみ取得
    const { data: projectsData } = await supabase
      .from('projects')
      .select('*')
      .eq('funeral_home_id', homeId)
      .order('created_at', { ascending: false });

    const projectsWithAmount = await Promise.all(
      (projectsData || []).map(async (project) => {
        const { data: kenpaiList } = await supabase
          .from('kenpai')
          .select('amount')
          .eq('project_id', project.id);
        return {
          ...project,
          total_amount: kenpaiList?.reduce((sum, k) => sum + k.amount, 0) || 0,
          kenpai_count: kenpaiList?.length || 0,
        };
      })
    );

    setProjects(projectsWithAmount);
    setLoading(false);
  };

  // 献杯者一覧を取得
  const fetchDonations = async (projectId: string) => {
    if (donations[projectId]) {
      // 既に取得済みの場合はトグル
      setExpandedProject(expandedProject === projectId ? null : projectId);
      return;
    }

    const { data: donationData } = await supabase
      .from('kenpai')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    setDonations((prev) => ({ ...prev, [projectId]: donationData || [] }));
    setExpandedProject(projectId);
  };

  const updateStatus = async (projectId: string, newStatus: string) => {
    await supabase.from('projects').update({ status: newStatus }).eq('id', projectId);
    if (funeralHomeId) fetchData(funeralHomeId);
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
  };

  const formatDateTime = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);

  const handleLogout = () => {
    sessionStorage.removeItem('funeral_home_id');
    sessionStorage.removeItem('funeral_home_name');
    router.replace('/');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #faf8f5 0%, #f5f0e8 100%)' }}>
        <div style={{ width: '48px', height: '48px', border: '3px solid #e8e4dc', borderTopColor: '#c9a227', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #faf8f5 0%, #f5f0e8 100%)', fontFamily: '"Noto Serif JP", serif' }}>
      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .sidebar {
          width: 240px;
          background: linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%);
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          padding: 20px 14px;
          display: flex;
          flex-direction: column;
          z-index: 100;
        }
        .sidebar-link {
          display: block;
          padding: 14px 16px;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.3s ease;
          margin-bottom: 4px;
        }
        .sidebar-link:hover { background: rgba(255,255,255,0.08); color: white; }
        .sidebar-link.active { background: rgba(201,162,39,0.15); color: #c9a227; }
        .mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 56px;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          z-index: 1000;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
        }
        .mobile-nav {
          display: none;
          position: fixed;
          top: 56px;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%);
          z-index: 999;
          flex-direction: column;
          padding: 8px 16px;
        }
        .mobile-nav.open { display: flex; }
        .mobile-nav-link {
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          padding: 16px;
          border-radius: 10px;
          font-size: 15px;
          margin-bottom: 4px;
        }
        .mobile-nav-link:hover, .mobile-nav-link.active { color: #c9a227; background: rgba(255,255,255,0.05); }
        .card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
          overflow: hidden;
        }
        .project-row {
          padding: 20px 24px;
          border-bottom: 1px solid #f0ebe3;
          cursor: pointer;
          transition: background 0.2s;
        }
        .project-row:hover { background: #faf8f5; }
        .project-row:last-child { border-bottom: none; }
        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 500;
        }
        .status-active { background: rgba(34,197,94,0.1); color: #16a34a; }
        .status-draft { background: rgba(251,191,36,0.1); color: #d97706; }
        .status-closed { background: rgba(107,114,128,0.1); color: #6b7280; }
        .donation-list {
          background: #f8f6f2;
          border-top: 1px solid #e8e4dc;
          padding: 16px 24px;
        }
        .donation-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: white;
          border-radius: 10px;
          margin-bottom: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .donation-item:last-child { margin-bottom: 0; }
        .action-btn {
          padding: 6px 12px;
          border: 1px solid #e8e4dc;
          border-radius: 6px;
          background: white;
          color: #666;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .action-btn:hover { border-color: #c9a227; color: #c9a227; }
        @media (max-width: 768px) {
          .sidebar { display: none; }
          .mobile-header { display: flex; }
          .main-content { margin-left: 0 !important; padding: 16px !important; padding-top: 72px !important; }
        }
      `}</style>

      {/* モバイルヘッダー */}
      <div className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #c9a227 0%, #d4af37 100%)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: '600' }}>礼</div>
          <span style={{ color: 'white', fontSize: '15px', fontWeight: '500' }}>Rei</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer', padding: '8px' }}>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* モバイルナビ */}
      <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="/admin" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>ホーム</a>
        <a href="/admin/projects" className="mobile-nav-link active" onClick={() => setMobileMenuOpen(false)}>ご案件一覧</a>
        <a href="/admin/payments" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>ご入金管理</a>
        <a href="/admin/settings" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>入金口座連携</a>
        <div style={{ marginTop: 'auto', padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '8px' }}>ログイン中: {funeralHomeName}</p>
          <button onClick={handleLogout} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: '#f87171', fontSize: '14px', cursor: 'pointer' }}>
            ログアウト
          </button>
        </div>
      </div>

      {/* サイドバー */}
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #c9a227 0%, #d4af37 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px', fontWeight: '600' }}>礼</div>
          <div>
            <p style={{ color: 'white', fontSize: '16px', fontWeight: '600', letterSpacing: '0.1em' }}>Rei</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>献杯管理システム</p>
          </div>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', letterSpacing: '0.15em', padding: '0 16px', marginBottom: '8px' }}>MENU</p>
        <nav>
          <a href="/admin" className="sidebar-link">ホーム</a>
          <a href="/admin/projects" className="sidebar-link active">ご案件一覧</a>
          <a href="/admin/payments" className="sidebar-link">ご入金管理</a>
          <a href="/admin/settings" className="sidebar-link">入金口座連携</a>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '10px' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', marginBottom: '2px' }}>ログイン中</p>
            <p style={{ color: 'white', fontSize: '13px', fontWeight: '500' }}>{funeralHomeName}</p>
          </div>
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '12px' }}>
            ログアウト
          </button>
        </div>
      </aside>

      {/* メインコンテンツ */}
      <main className="main-content" style={{ marginLeft: '240px', padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '500', color: '#1a1a1a', marginBottom: '4px' }}>ご案件一覧</h1>
          <p style={{ color: '#888', fontSize: '13px' }}>{funeralHomeName} のご案件を管理</p>
        </div>

        {/* 統計 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <p style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>総案件数</p>
            <p style={{ fontSize: '28px', fontWeight: '600', color: '#1a1a1a' }}>{projects.length}<span style={{ fontSize: '14px', color: '#888' }}>件</span></p>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <p style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>受付中</p>
            <p style={{ fontSize: '28px', fontWeight: '600', color: '#16a34a' }}>{projects.filter(p => p.status === 'active').length}<span style={{ fontSize: '14px', color: '#888' }}>件</span></p>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <p style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>総献杯数</p>
            <p style={{ fontSize: '28px', fontWeight: '600', color: '#3b82f6' }}>{projects.reduce((sum, p) => sum + p.kenpai_count, 0)}<span style={{ fontSize: '14px', color: '#888' }}>件</span></p>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <p style={{ color: '#166534', fontSize: '12px', marginBottom: '4px' }}>総金額</p>
            <p style={{ fontSize: '24px', fontWeight: '600', color: '#166534' }}>{formatCurrency(projects.reduce((sum, p) => sum + p.total_amount, 0))}</p>
          </div>
        </div>

        {/* 案件一覧 */}
        <div className="card">
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0ebe3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '500', color: '#1a1a1a' }}>ご案件一覧</h2>
            <span style={{ fontSize: '12px', color: '#888' }}>全{projects.length}件</span>
          </div>

          {projects.length === 0 ? (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
              <p style={{ color: '#888', fontSize: '14px', marginBottom: '16px' }}>ご案件がありません</p>
              <a href="/admin" style={{ color: '#c9a227', fontSize: '14px' }}>新規作成はこちら →</a>
            </div>
          ) : (
            projects.map((project) => (
              <div key={project.id}>
                <div className="project-row" onClick={() => fetchDonations(project.id)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '500', color: '#1a1a1a', marginBottom: '4px' }}>
                        故 {project.deceased_name} 様
                      </h3>
                      <p style={{ fontSize: '12px', color: '#888' }}>
                        /{project.slug} • 作成日: {formatDate(project.created_at)}
                      </p>
                    </div>
                    <span className={`status-badge ${project.status === 'active' ? 'status-active' : project.status === 'draft' ? 'status-draft' : 'status-closed'}`}>
                      {project.status === 'active' ? '受付中' : project.status === 'draft' ? '準備中' : '終了'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div>
                      <p style={{ fontSize: '11px', color: '#888', marginBottom: '2px' }}>献杯数</p>
                      <p style={{ fontSize: '18px', fontWeight: '600', color: '#3b82f6' }}>{project.kenpai_count}件</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: '#888', marginBottom: '2px' }}>合計金額</p>
                      <p style={{ fontSize: '18px', fontWeight: '600', color: '#16a34a' }}>{formatCurrency(project.total_amount)}</p>
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                      {project.status === 'active' && (
                        <button className="action-btn" onClick={(e) => { e.stopPropagation(); updateStatus(project.id, 'closed'); }}>
                          終了する
                        </button>
                      )}
                      {project.status === 'closed' && (
                        <button className="action-btn" onClick={(e) => { e.stopPropagation(); updateStatus(project.id, 'active'); }}>
                          再開する
                        </button>
                      )}
                      <a href={`/${project.slug}`} target="_blank" rel="noopener noreferrer" className="action-btn" onClick={(e) => e.stopPropagation()} style={{ textDecoration: 'none' }}>
                        ページを見る
                      </a>
                    </div>
                  </div>

                  <div style={{ marginTop: '12px', fontSize: '12px', color: '#c9a227' }}>
                    {expandedProject === project.id ? '▲ 献杯者一覧を閉じる' : '▼ 献杯者一覧を見る'}
                  </div>
                </div>

                {/* 献杯者一覧（展開時） */}
                {expandedProject === project.id && (
                  <div className="donation-list">
                    <p style={{ fontSize: '13px', fontWeight: '500', color: '#666', marginBottom: '12px' }}>
                      献杯者一覧（{donations[project.id]?.length || 0}件）
                    </p>
                    {(!donations[project.id] || donations[project.id].length === 0) ? (
                      <p style={{ color: '#888', fontSize: '13px', padding: '20px', textAlign: 'center', background: 'white', borderRadius: '10px' }}>
                        まだ献杯がありません
                      </p>
                    ) : (
                      donations[project.id].map((donation, index) => (
                        <div key={donation.id || index} className="donation-item">
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a', marginBottom: '2px' }}>
                              {donation.is_anonymous ? '匿名' : (donation.donor_name || donation.name || '名前なし')}
                            </p>
                            <p style={{ fontSize: '11px', color: '#888' }}>
                              {formatDateTime(donation.created_at)}
                              {donation.message && ` • "${donation.message.substring(0, 20)}${donation.message.length > 20 ? '...' : ''}"`}
                            </p>
                          </div>
                          <p style={{ fontSize: '16px', fontWeight: '600', color: '#16a34a' }}>
                            {formatCurrency(donation.amount)}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
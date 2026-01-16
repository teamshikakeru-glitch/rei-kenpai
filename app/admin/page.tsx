'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useSession } from '@/lib/supabase/hooks/useSession';
import SessionWarning from '@/components/SessionWarning';

export default function AdminPage() {
  const { isAuthenticated, isLoading: sessionLoading, showWarning, remainingTime, logout, extendSession } = useSession();
  const [stats, setStats] = useState({ active_projects: 0, total_kenpai: 0, total_amount: 0 });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ deceased_name: '', slug: '', family_message: '', use_default_message: true, family_password: '' });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [funeralHomeId, setFuneralHomeId] = useState<string | null>(null);
  const [funeralHomeName, setFuneralHomeName] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [createdProject, setCreatedProject] = useState<{ slug: string; deceased_name: string; password: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const BASE_URL = 'https://rei-kenpai.vercel.app';

  useEffect(() => {
    if (sessionLoading) return;
    if (!isAuthenticated) { router.replace('/'); return; }
    if (typeof window === 'undefined') return;
    const storedId = sessionStorage.getItem('funeral_home_id');
    const storedName = sessionStorage.getItem('funeral_home_name');
    if (!storedId || !storedName) { router.replace('/'); return; }
    setFuneralHomeId(storedId);
    setFuneralHomeName(storedName);
    fetchData(storedId);
  }, [router, isAuthenticated, sessionLoading]);

  const fetchData = async (homeId: string) => {
    try {
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('funeral_home_id', homeId)
        .order('created_at', { ascending: false });

      const activeProjects = projectsData?.filter((p) => p.status === 'active') || [];
      
      let totalKenpai = 0;
      let totalAmount = 0;
      
      if (projectsData && projectsData.length > 0) {
        const projectIds = projectsData.map(p => p.id);
        const { data: kenpaiData } = await supabase
          .from('kenpai')
          .select('amount')
          .in('project_id', projectIds);
        
        if (kenpaiData) {
          totalKenpai = kenpaiData.length;
          totalAmount = kenpaiData.reduce((sum, k) => sum + (k.amount || 0), 0);
        }
      }

      setStats({
        active_projects: activeProjects.length,
        total_kenpai: totalKenpai,
        total_amount: totalAmount
      });
      setRecentProjects(projectsData?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); };

  const handleSlugChange = (value: string) => {
    setFormData({ ...formData, slug: value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);

    if (!formData.deceased_name || !formData.slug || !formData.family_password) {
      setMessage({ type: 'error', text: '必須項目をご入力ください' });
      setSubmitting(false);
      return;
    }
    if (formData.family_password.length < 4) {
      setMessage({ type: 'error', text: 'パスワードは4文字以上でご設定ください' });
      setSubmitting(false);
      return;
    }
    if (!funeralHomeId) {
      setMessage({ type: 'error', text: '葬儀社情報が見つかりません' });
      setSubmitting(false);
      return;
    }

    let photoUrl = null;
    if (photoFile) {
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `${formData.slug}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('photos').upload(fileName, photoFile);
      if (uploadError) {
        setMessage({ type: 'error', text: '写真のアップロードに失敗しました' });
        setSubmitting(false);
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(fileName);
      photoUrl = publicUrl;
    }

    const { error } = await supabase.from('projects').insert({
      funeral_home_id: funeralHomeId,
      deceased_name: formData.deceased_name,
      slug: formData.slug,
      status: 'active',
      photo_url: photoUrl,
      family_message: formData.use_default_message ? null : formData.family_message,
      use_default_message: formData.use_default_message,
      family_password: formData.family_password
    });

    if (error) {
      setMessage({ type: 'error', text: error.code === '23505' ? 'このURLは既に使用されております' : 'エラー: ' + error.message });
      setSubmitting(false);
      return;
    }

    setCreatedProject({ slug: formData.slug, deceased_name: formData.deceased_name, password: formData.family_password });
    setTimeout(() => setCreatedProject(null), 180000);
    setFormData({ deceased_name: '', slug: '', family_message: '', use_default_message: true, family_password: '' });
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (funeralHomeId) fetchData(funeralHomeId);
    setSubmitting(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('コピーしました');
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  if (sessionLoading || !isAuthenticated || loading) {
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
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn 0.5s ease-out; }
        .fade-in-up { animation: fadeInUp 0.6s ease-out; }
        .card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
          transition: all 0.3s ease;
        }
        .card:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.1);
        }
        .input-field {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e8e4dc;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s ease;
          box-sizing: border-box;
          font-family: inherit;
        }
        .input-field:focus {
          outline: none;
          border-color: #c9a227;
          box-shadow: 0 0 0 4px rgba(201,162,39,0.1);
        }
        .input-field::placeholder { color: #bbb; }
        .btn-primary {
          width: 100%;
          padding: 16px 24px;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .btn-secondary {
          padding: 12px 20px;
          background: white;
          color: #666;
          border: 2px solid #e8e4dc;
          border-radius: 10px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-secondary:hover { border-color: #c9a227; color: #c9a227; }
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
          box-shadow: 0 2px 20px rgba(0,0,0,0.1);
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
          overflow-y: auto;
        }
        .mobile-nav.open { display: flex; }
        .mobile-nav-link {
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          padding: 16px;
          border-radius: 10px;
          font-size: 15px;
          transition: all 0.3s ease;
          margin-bottom: 4px;
        }
        .mobile-nav-link:hover, .mobile-nav-link.active { color: #c9a227; background: rgba(255,255,255,0.05); }
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 500;
        }
        .status-active { background: rgba(34,197,94,0.1); color: #16a34a; }
        .status-draft { background: rgba(251,191,36,0.1); color: #d97706; }
        .status-closed { background: rgba(107,114,128,0.1); color: #6b7280; }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 16px;
          backdrop-filter: blur(4px);
        }
        .modal-content {
          background: white;
          border-radius: 20px;
          width: 100%;
          max-width: 400px;
          max-height: 90vh;
          overflow-y: auto;
        }
        .icon-box {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 600;
          flex-shrink: 0;
        }
        @media (max-width: 1024px) {
          .sidebar { width: 200px; }
          .main-content { margin-left: 200px !important; }
        }
        @media (max-width: 768px) {
          .sidebar { display: none; }
          .mobile-header { display: flex; }
          .main-content { margin-left: 0 !important; padding: 16px !important; padding-top: 72px !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
          .content-grid { grid-template-columns: 1fr !important; }
          .form-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
          .stat-card { padding: 16px; }
          .stat-value { font-size: 24px !important; }
          .card-padding { padding: 20px !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {showWarning && (
        <SessionWarning remainingTime={remainingTime} onExtend={extendSession} onLogout={handleLogout} />
      )}

      {/* 作成完了モーダル */}
      {createdProject && (
        <div className="modal-overlay" onClick={() => setCreatedProject(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: 'white', padding: '32px 20px', textAlign: 'center', borderRadius: '20px 20px 0 0' }}>
              <div style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '24px' }}>✓</div>
              <h3 style={{ fontSize: '18px', marginBottom: '6px', fontWeight: '500' }}>作成完了</h3>
              <p style={{ opacity: 0.9, fontSize: '14px' }}>故 {createdProject.deceased_name} 様</p>
            </div>
            <div style={{ padding: '24px 20px' }}>
              <div style={{ background: '#f8f6f2', border: '1px solid #e8e4dc', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
                <p style={{ fontSize: '10px', color: '#888', marginBottom: '4px', letterSpacing: '0.1em' }}>献杯ページURL</p>
                <p style={{ fontSize: '13px', color: '#1a1a1a', wordBreak: 'break-all', fontWeight: '500' }}>{BASE_URL}/{createdProject.slug}</p>
              </div>
              <button onClick={() => copyToClipboard(`${BASE_URL}/${createdProject.slug}`)} style={{ width: '100%', padding: '12px', background: '#1a1a1a', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', cursor: 'pointer', marginBottom: '16px' }}>
                URLをコピー
              </button>
              <div style={{ textAlign: 'center', padding: '16px', background: '#f8f6f2', borderRadius: '10px', marginBottom: '14px' }}>
                <p style={{ fontSize: '10px', color: '#888', marginBottom: '10px' }}>QRコード</p>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`${BASE_URL}/${createdProject.slug}`)}`} alt="QR Code" style={{ width: '120px', height: '120px' }} />
              </div>
              <div style={{ background: '#fffbf0', border: '1px solid #f0e6c8', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
                <p style={{ fontSize: '10px', color: '#92400e', marginBottom: '4px', letterSpacing: '0.1em' }}>ご遺族様用パスワード</p>
                <p style={{ fontSize: '20px', fontWeight: '600', fontFamily: 'monospace', color: '#1a1a1a', letterSpacing: '0.1em' }}>{createdProject.password}</p>
              </div>
              <button onClick={() => setCreatedProject(null)} style={{ width: '100%', padding: '12px', background: '#f1f1f1', color: '#666', border: 'none', borderRadius: '10px', fontSize: '14px', cursor: 'pointer' }}>
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

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
        <a href="/admin" className="mobile-nav-link active" onClick={() => setMobileMenuOpen(false)}>ホーム</a>
        <a href="/admin/payments" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>ご入金管理</a>
        <a href="/admin/settings" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>入金口座連携</a>
        <div style={{ marginTop: 'auto', padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '8px' }}>ログイン中: {funeralHomeName}</p>
          <button onClick={handleLogout} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: '#f87171', fontSize: '14px', cursor: 'pointer' }}>
            ログアウト
          </button>
        </div>
      </div>

      {/* サイドバー（デスクトップ） */}
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
          <a href="/admin" className="sidebar-link active">ホーム</a>
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
        {/* ヘッダー */}
        <div className="fade-in" style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '500', color: '#1a1a1a', marginBottom: '4px' }}>ダッシュボード</h1>
          <p style={{ color: '#888', fontSize: '13px' }}>{new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}</p>
        </div>

        {/* 統計カード */}
        <div className="stats-grid fade-in-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div className="icon-box" style={{ background: 'linear-gradient(135deg, #c9a227 0%, #d4af37 100%)', color: 'white' }}>P</div>
              <span style={{ color: '#888', fontSize: '13px' }}>稼働中</span>
            </div>
            <p className="stat-value" style={{ fontSize: '32px', fontWeight: '600', color: '#1a1a1a' }}>{stats.active_projects}<span style={{ fontSize: '14px', color: '#888', marginLeft: '2px' }}>件</span></p>
          </div>

          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div className="icon-box" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white' }}>K</div>
              <span style={{ color: '#888', fontSize: '13px' }}>献杯数</span>
            </div>
            <p className="stat-value" style={{ fontSize: '32px', fontWeight: '600', color: '#1a1a1a' }}>{stats.total_kenpai}<span style={{ fontSize: '14px', color: '#888', marginLeft: '2px' }}>件</span></p>
          </div>

          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div className="icon-box" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: 'white' }}>¥</div>
              <span style={{ color: '#166534', fontSize: '13px' }}>総金額</span>
            </div>
            <p className="stat-value" style={{ fontSize: '32px', fontWeight: '600', color: '#166534' }}>¥{stats.total_amount.toLocaleString()}</p>
          </div>
        </div>

        <div className="content-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', alignItems: 'start' }}>
          {/* 新規作成フォーム */}
          <div className="card fade-in-up">
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0ebe3' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '500', color: '#1a1a1a' }}>新規献杯ページ作成</h2>
            </div>
            <div className="card-padding" style={{ padding: '24px' }}>
              <form onSubmit={handleSubmit}>
                {message && (
                  <div style={{
                    marginBottom: '16px',
                    padding: '12px 16px',
                    background: message.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                    border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    borderRadius: '10px',
                    color: message.type === 'success' ? '#16a34a' : '#dc2626',
                    fontSize: '13px'
                  }}>
                    {message.text}
                  </div>
                )}

                {/* 基本情報 */}
                <div style={{ marginBottom: '24px' }}>
                  <p style={{ fontSize: '12px', color: '#888', marginBottom: '12px', letterSpacing: '0.1em' }}>基本情報</p>
                  <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#666', marginBottom: '6px' }}>
                        故人様のお名前 <span style={{ color: '#c9a227' }}>*</span>
                      </label>
                      <input type="text" className="input-field" placeholder="山田 太郎" value={formData.deceased_name} onChange={(e) => setFormData({ ...formData, deceased_name: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#666', marginBottom: '6px' }}>
                        URL用ID <span style={{ color: '#c9a227' }}>*</span>
                      </label>
                      <input type="text" className="input-field" placeholder="yamada-taro" value={formData.slug} onChange={(e) => handleSlugChange(e.target.value)} />
                    </div>
                  </div>
                  {formData.slug && (
                    <p style={{ marginTop: '6px', fontSize: '11px', color: '#888' }}>
                      {BASE_URL}/<span style={{ color: '#c9a227' }}>{formData.slug}</span>
                    </p>
                  )}
                </div>

                {/* パスワード */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#666', marginBottom: '6px' }}>
                    ご遺族様用パスワード <span style={{ color: '#c9a227' }}>*</span>
                  </label>
                  <input type="text" className="input-field" style={{ fontFamily: 'monospace', letterSpacing: '0.1em', maxWidth: '180px' }} placeholder="1234" value={formData.family_password} onChange={(e) => setFormData({ ...formData, family_password: e.target.value })} />
                  <p style={{ marginTop: '6px', fontSize: '11px', color: '#888' }}>入金状況確認用（4文字以上）</p>
                </div>

                {/* 写真 */}
                <div style={{ marginBottom: '24px' }}>
                  <p style={{ fontSize: '12px', color: '#888', marginBottom: '12px', letterSpacing: '0.1em' }}>ご遺影（任意）</p>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    {photoPreview ? (
                      <div style={{ width: '100px', height: '125px', borderRadius: '10px', overflow: 'hidden', border: '2px solid #c9a227' }}>
                        <img src={photoPreview} alt="プレビュー" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ) : (
                      <div style={{ width: '100px', height: '125px', borderRadius: '10px', border: '2px dashed #d4cfc4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '12px' }}>
                        未選択
                      </div>
                    )}
                    <div>
                      <input type="file" ref={fileInputRef} accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                      <button type="button" className="btn-secondary" onClick={() => fileInputRef.current?.click()}>
                        {photoPreview ? '変更' : '選択'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* メッセージ */}
                <div style={{ marginBottom: '24px' }}>
                  <p style={{ fontSize: '12px', color: '#888', marginBottom: '12px', letterSpacing: '0.1em' }}>メッセージ</p>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '10px 14px', background: formData.use_default_message ? '#fffbf0' : '#f8f6f2', border: formData.use_default_message ? '2px solid #c9a227' : '2px solid transparent', borderRadius: '8px', fontSize: '13px' }}>
                      <input type="radio" name="messageType" checked={formData.use_default_message} onChange={() => setFormData({ ...formData, use_default_message: true, family_message: '' })} style={{ accentColor: '#c9a227' }} />
                      定型文
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '10px 14px', background: !formData.use_default_message ? '#fffbf0' : '#f8f6f2', border: !formData.use_default_message ? '2px solid #c9a227' : '2px solid transparent', borderRadius: '8px', fontSize: '13px' }}>
                      <input type="radio" name="messageType" checked={!formData.use_default_message} onChange={() => setFormData({ ...formData, use_default_message: false })} style={{ accentColor: '#c9a227' }} />
                      カスタム
                    </label>
                  </div>
                  {!formData.use_default_message && (
                    <textarea className="input-field" style={{ minHeight: '80px', resize: 'vertical' }} placeholder="メッセージを入力..." value={formData.family_message} onChange={(e) => setFormData({ ...formData, family_message: e.target.value })} />
                  )}
                </div>

                {/* 送信ボタン */}
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? '作成中...' : '献杯ページを作成'}
                </button>
              </form>
            </div>
          </div>

          {/* 最近の案件 */}
          <div className="card fade-in-up">
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0ebe3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>最近の案件</h3>
              <span style={{ fontSize: '11px', color: '#888' }}>{recentProjects.length}件</span>
            </div>
            <div>
              {recentProjects.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                  <p style={{ color: '#888', fontSize: '13px' }}>案件がありません</p>
                </div>
              ) : (
                recentProjects.map((project, index) => (
                  <div key={project.id} style={{ padding: '14px 20px', borderBottom: index < recentProjects.length - 1 ? '1px solid #f0ebe3' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>
                        故 {project.deceased_name} 様
                      </p>
                      <span className={`status-badge ${project.status === 'active' ? 'status-active' : project.status === 'draft' ? 'status-draft' : 'status-closed'}`}>
                        {project.status === 'active' ? '公開中' : project.status === 'draft' ? '下書き' : '終了'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ fontSize: '11px', color: '#888' }}>{formatDate(project.created_at)}</p>
                      <a href={`/${project.slug}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#c9a227', textDecoration: 'none' }}>
                        開く →
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
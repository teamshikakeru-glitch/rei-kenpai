'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useSession } from '@/lib/supabase/hooks/useSession';
import SessionWarning from '@/components/SessionWarning';
import KenpaiPreview from '@/components/KenpaiPreview';

export default function AdminPage() {
  const { isAuthenticated, isLoading: sessionLoading, showWarning, remainingTime, logout, extendSession } = useSession();
  const [stats, setStats] = useState({ active_projects: 0 });
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
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const BASE_URL = 'https://rei-kenpai.vercel.app';

  useEffect(() => {
    if (sessionLoading) return;
    
    if (!isAuthenticated) {
      router.replace('/');
      return;
    }

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
  }, [router, isAuthenticated, sessionLoading]);

  const fetchData = async (homeId: string) => {
    try {
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('funeral_home_id', homeId)
        .order('created_at', { ascending: false });
      
      setStats({
        active_projects: projectsData?.filter((p) => p.status === 'active').length || 0
      });
    } catch (error) { 
      console.error('Error:', error); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleLogout = () => {
    logout();
  };

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
    
    setCreatedProject({
      slug: formData.slug,
      deceased_name: formData.deceased_name,
      password: formData.family_password
    });
    
    setTimeout(() => {
      setCreatedProject(null);
    }, 180000);
    
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

  const today = new Date(); 
  const japaneseYear = today.getFullYear() - 2018;
  const toKanji = (n: number) => { 
    const k = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']; 
    if (n <= 10) return k[n]; 
    if (n < 20) return '十' + k[n - 10]; 
    return k[Math.floor(n / 10)] + '十' + (n % 10 ? k[n % 10] : ''); 
  };

  if (sessionLoading || !isAuthenticated || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0f1a' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ width: '48px', height: '48px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#c9a227', borderRadius: '50%', margin: '0 auto 1rem' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {showWarning && (
        <SessionWarning
          remainingTime={remainingTime}
          onExtend={extendSession}
          onLogout={handleLogout}
        />
      )}

      <style jsx>{`
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .content-grid { display: grid; grid-template-columns: 1fr 380px; gap: 24px; align-items: start; }
        .mobile-header { display: none; position: fixed; top: 0; left: 0; right: 0; height: 56px; background: #0a0f1a; z-index: 1000; align-items: center; justify-content: space-between; padding: 0 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .mobile-menu-btn { background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; padding: 0.5rem; }
        .mobile-logo { display: flex; align-items: center; gap: 0.5rem; color: white; }
        .mobile-logo-icon { width: 32px; height: 32px; background: linear-gradient(135deg, #c9a227, #a08020); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; }
        .mobile-nav { display: none; position: fixed; top: 56px; left: 0; right: 0; bottom: 0; background: #0a0f1a; z-index: 999; flex-direction: column; padding: 1rem; }
        .mobile-nav.open { display: flex; }
        .mobile-nav-link { color: rgba(255,255,255,0.7); text-decoration: none; padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 0.95rem; }
        .mobile-nav-logout { color: #f87171; padding: 1rem; font-size: 0.95rem; cursor: pointer; background: none; border: none; text-align: left; }
        .hero-section { background: linear-gradient(135deg, rgba(201,162,39,0.1) 0%, rgba(201,162,39,0.05) 100%); border: 1px solid rgba(201,162,39,0.2); border-radius: 16px; padding: 32px; margin-bottom: 24px; position: relative; overflow: hidden; }
        .hero-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: rgba(201,162,39,0.15); border-radius: 100px; font-size: 10px; color: #c9a227; letter-spacing: 0.15em; margin-bottom: 16px; }
        .hero-title { font-size: 20px; font-weight: 500; color: #1a1a1a; margin-bottom: 12px; line-height: 1.5; }
        .hero-title strong { color: #c9a227; }
        .hero-text { font-size: 13px; color: #666; line-height: 1.8; }
        .hero-stats { display: inline-flex; align-items: center; gap: 8px; margin-top: 20px; padding: 10px 16px; background: white; border-radius: 100px; font-size: 13px; color: #333; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .hero-stats-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; }
        .welcome-bar { display: flex; justify-content: space-between; align-items: center; background: white; padding: 12px 16px; border-radius: 10px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
        .welcome-text { font-size: 14px; color: #333; }
        .welcome-name { font-weight: 600; color: #1a1a1a; }
        .logout-btn { background: none; border: 1px solid #e5e5e5; padding: 8px 16px; border-radius: 6px; font-size: 12px; color: #666; cursor: pointer; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 1rem; backdrop-filter: blur(4px); }
        .modal-content { background: white; border-radius: 20px; width: 100%; max-width: 440px; max-height: 90vh; overflow-y: auto; }
        .modal-header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 32px 24px; text-align: center; border-radius: 20px 20px 0 0; }
        .modal-body { padding: 24px; }
        .url-box { background: #f8f8f8; border: 1px solid #e5e5e5; border-radius: 10px; padding: 14px 16px; margin-bottom: 12px; }
        .url-label { font-size: 10px; color: #999; letter-spacing: 0.1em; margin-bottom: 4px; }
        .url-text { font-size: 14px; color: #1a1a1a; word-break: break-all; font-weight: 500; }
        .copy-btn { width: 100%; padding: 14px; background: #1a1a1a; color: white; border: none; border-radius: 10px; font-size: 14px; cursor: pointer; margin-bottom: 20px; }
        .qr-container { text-align: center; padding: 20px; background: #f8f8f8; border-radius: 12px; margin-bottom: 16px; }
        .info-box { background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 14px 16px; margin-bottom: 16px; }
        .info-label { font-size: 10px; color: #92400e; letter-spacing: 0.1em; margin-bottom: 4px; }
        .info-value { font-size: 18px; font-weight: 600; font-family: monospace; color: #1a1a1a; }
        .close-btn { width: 100%; padding: 14px; background: #f1f1f1; color: #333; border: none; border-radius: 10px; font-size: 14px; cursor: pointer; }
        .preview-toggle { display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: rgba(201,162,39,0.1); border: 1px solid rgba(201,162,39,0.3); border-radius: 8px; color: #c9a227; font-size: 13px; cursor: pointer; margin-bottom: 16px; }
        .preview-toggle:hover { background: rgba(201,162,39,0.15); }
        @media (max-width: 1024px) {
          .content-grid { grid-template-columns: 1fr; }
          .preview-desktop { display: none; }
        }
        @media (max-width: 768px) {
          .mobile-header { display: flex; }
          .form-grid { grid-template-columns: 1fr; gap: 1rem; }
          .main-content { margin-left: 0 !important; padding-top: 72px !important; }
          .hero-section { padding: 24px 20px; }
          .hero-title { font-size: 17px; }
          .welcome-bar { flex-direction: column; gap: 12px; text-align: center; }
        }
      `}</style>

      {createdProject && (
        <div className="modal-overlay" onClick={() => setCreatedProject(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>✓</div>
              <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>献杯ページを作成しました</h3>
              <p style={{ opacity: 0.9, fontSize: '14px' }}>故 {createdProject.deceased_name} 様</p>
            </div>
            <div className="modal-body">
              <div className="url-box">
                <p className="url-label">献杯ページURL</p>
                <p className="url-text">{BASE_URL}/{createdProject.slug}</p>
              </div>
              <button className="copy-btn" onClick={() => copyToClipboard(`${BASE_URL}/${createdProject.slug}`)}>
                📋 URLをコピー
              </button>
              <div className="qr-container">
                <p style={{ fontSize: '11px', color: '#666', marginBottom: '12px', letterSpacing: '0.1em' }}>QRコード</p>
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`${BASE_URL}/${createdProject.slug}`)}`} 
                  alt="QR Code"
                  style={{ width: '160px', height: '160px' }}
                />
              </div>
              <div className="info-box">
                <p className="info-label">ご遺族様用パスワード</p>
                <p className="info-value">{createdProject.password}</p>
              </div>
              <button className="close-btn" onClick={() => setCreatedProject(null)}>閉じる</button>
            </div>
          </div>
        </div>
      )}

      <div className="mobile-header">
        <div className="mobile-logo">
          <div className="mobile-logo-icon">礼</div>
          <span style={{ fontWeight: 500, fontSize: '14px' }}>Rei</span>
        </div>
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="/admin" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>ホーム</a>
        <a href="/admin/payments" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>ご入金管理</a>
        <a href="/admin/settings" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>設定</a>
        <button className="mobile-nav-logout" onClick={handleLogout}>ログアウト</button>
      </div>

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
          <a href="/admin" className="sidebar-link active">ホーム</a>
          <a href="/admin/payments" className="sidebar-link">ご入金管理</a>
          <a href="/admin/settings" className="sidebar-link">設定</a>
        </nav>
        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={handleLogout} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '13px' }}>
            ログアウト
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="welcome-bar">
          <span className="welcome-text">
            <span className="welcome-name">{funeralHomeName}</span> 様
          </span>
          <button className="logout-btn" onClick={handleLogout}>ログアウト</button>
        </div>

        <div className="hero-section">
          <div className="hero-badge">
            <span>✦</span>
            <span>COMPETITIVE ADVANTAGE</span>
          </div>
          <h2 className="hero-title">
            <strong>見積もり競争</strong>を勝ち抜く<br />
            新しい提案ツール
          </h2>
          <p className="hero-text">
            献杯ページを発行し、支援金で葬儀費用の負担を軽減。<br />
            他社との差別化を実現します。
          </p>
          <div className="hero-stats">
            <span className="hero-stats-dot"></span>
            現在 {stats.active_projects} 件のページが稼働中
          </div>
        </div>

        <header className="page-header" style={{ marginBottom: '1.5rem' }}>
          <div>
            <h2 className="page-header-title">新規ご案件作成</h2>
            <p className="page-header-subtitle">献杯ページの作成</p>
          </div>
          <div className="page-header-date">
            <div className="page-header-date-main">
              令和{toKanji(japaneseYear)}年 {toKanji(today.getMonth() + 1)}月{toKanji(today.getDate())}日
            </div>
            <div>{['日', '月', '火', '水', '木', '金', '土'][today.getDay()]}曜日</div>
          </div>
        </header>

        <button className="preview-toggle" onClick={() => setShowPreview(!showPreview)}>
          📱 {showPreview ? 'プレビューを隠す' : 'プレビューを表示'}
        </button>

        <div className="content-grid">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {message && (
                  <div className={`message ${message.type === 'success' ? 'message-success' : 'message-error'}`}>
                    {message.text}
                  </div>
                )}
                
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      故人様のお名前
                      <span className="form-label-required">必須</span>
                    </label>
                    <input type="text" className="form-input" placeholder="例：山田 太郎" value={formData.deceased_name} onChange={(e) => setFormData({ ...formData, deceased_name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      URL用ID
                      <span className="form-label-required">必須</span>
                    </label>
                    <input type="text" className="form-input" placeholder="例：yamada-taro" value={formData.slug} onChange={(e) => handleSlugChange(e.target.value)} />
                  </div>
                </div>
                
                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label className="form-label">
                    ご遺族様用パスワード
                    <span className="form-label-required">必須</span>
                  </label>
                  <input type="text" className="form-input" style={{ fontFamily: 'monospace', letterSpacing: '0.1em' }} placeholder="例：1234" value={formData.family_password} onChange={(e) => setFormData({ ...formData, family_password: e.target.value })} />
                  <p className="form-hint">ご遺族様が入金状況を確認する際に使用（4文字以上）</p>
                </div>
                
                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label className="form-label">ご遺影のお写真</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    {photoPreview && (
                      <div style={{ width: '100px', height: '125px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                        <img src={photoPreview} alt="プレビュー" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: '150px' }}>
                      <input type="file" ref={fileInputRef} accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                      <button type="button" className="btn btn-secondary" onClick={() => fileInputRef.current?.click()} style={{ width: '100%' }}>
                        {photoPreview ? '写真を変更' : '写真を選択'}
                      </button>
                      <p className="form-hint" style={{ marginTop: '0.5rem' }}>献杯ページに表示（任意）</p>
                    </div>
                  </div>
                </div>
                
                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label className="form-label">ご遺族様からのメッセージ</label>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      <input type="radio" name="messageType" checked={formData.use_default_message} onChange={() => setFormData({ ...formData, use_default_message: true, family_message: '' })} />
                      <span>定型文を使用</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input type="radio" name="messageType" checked={!formData.use_default_message} onChange={() => setFormData({ ...formData, use_default_message: false })} />
                      <span>カスタムメッセージ</span>
                    </label>
                  </div>
                  {!formData.use_default_message && (
                    <textarea className="form-input" style={{ minHeight: '100px', resize: 'vertical' }} placeholder="例：父は生前、皆様との出会いに深く感謝しておりました。" value={formData.family_message} onChange={(e) => setFormData({ ...formData, family_message: e.target.value })} />
                  )}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--sumi-100)', flexWrap: 'wrap' }}>
                  <button type="button" className="btn btn-secondary" style={{ flex: '1', minWidth: '120px' }}>キャンセル</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: '1', minWidth: '120px' }} disabled={submitting}>
                    {submitting ? '作成中...' : '＋ ご案件を作成'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {showPreview && (
            <div style={{ position: 'sticky', top: '100px' }}>
              <KenpaiPreview
                deceasedName={formData.deceased_name}
                photoPreview={photoPreview}
                familyMessage={formData.family_message}
                useDefaultMessage={formData.use_default_message}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
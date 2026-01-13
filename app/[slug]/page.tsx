'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function KenpaiPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const [project, setProject] = useState<any>(null);
  const [kenpaiCount, setKenpaiCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [formData, setFormData] = useState({ donor_name: '', message: '', is_anonymous: false });
  const [selectedAmount, setSelectedAmount] = useState<number>(10000);
  const [customAmount, setCustomAmount] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const supabase = createClient();

  useEffect(() => { 
    if (searchParams.get('success') === 'true') { 
      setSubmitStatus('success'); 
      window.history.replaceState({}, '', `/${slug}`); 
    } 
  }, [searchParams, slug]);

  const fetchData = async () => {
    const { data: projectData, error } = await supabase.from('projects').select('*').eq('slug', slug).single();
    if (error || !projectData) { setNotFound(true); setLoading(false); return; }
    setProject(projectData);
    const { count } = await supabase.from('kenpai').select('*', { count: 'exact', head: true }).eq('project_id', projectData.id);
    setKenpaiCount(count || 0);
    setLoading(false);
  };

  useEffect(() => { if (slug) fetchData(); }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setSubmitStatus('loading'); 
    setErrorMessage('');
    const amount = customAmount ? parseInt(customAmount) : selectedAmount;
    if (!formData.donor_name && !formData.is_anonymous) { 
      setErrorMessage('お名前をご入力いただくか、匿名をお選びください'); 
      setSubmitStatus('error'); 
      return; 
    }
    if (!amount || amount < 1000) { 
      setErrorMessage('1,000円以上をご指定ください'); 
      setSubmitStatus('error'); 
      return; 
    }
    try {
      const donorName = formData.is_anonymous ? '匿名' : formData.donor_name;
      const response = await fetch('/api/checkout', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          amount, 
          donor_name: donorName, 
          project_id: project.id, 
          slug, 
          message: formData.message, 
          is_anonymous: formData.is_anonymous 
        }) 
      });
      const { url, error } = await response.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch (error) { 
      setErrorMessage('お手続きを開始できませんでした'); 
      setSubmitStatus('error'); 
    }
  };

  const defaultMessage = '故人様のご生前は格別のご厚情を賜り\n心より御礼申し上げます';
  const displayMessage = project?.use_default_message || !project?.family_message ? defaultMessage : project.family_message;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #faf9f7 0%, #f5f3f0 100%)' }}>
        <style jsx>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        `}</style>
        <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '3px solid #e8e8e8', 
            borderTopColor: '#b8860b',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>読み込み中...</p>
        </div>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #faf9f7 0%, #f5f3f0 100%)' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.3 }}>🕯</div>
          <h1 style={{ fontSize: '1.25rem', color: '#333', marginBottom: '0.5rem' }}>ページが見つかりません</h1>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>URLをご確認ください</p>
        </div>
      </div>
    );
  }

  if (project.status === 'draft' || project.status === 'closed') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #faf9f7 0%, #f5f3f0 100%)' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.3 }}>🕯</div>
          <h1 style={{ fontSize: '1.25rem', color: '#333', marginBottom: '0.5rem' }}>
            {project.status === 'closed' ? '受付終了' : '準備中'}
          </h1>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>
            {project.status === 'closed' ? 'このページの受付は終了いたしました' : 'このページは現在準備中でございます'}
          </p>
        </div>
      </div>
    );
  }

  const amountOptions = [
    { value: 5000, label: '¥5,000', popular: false },
    { value: 10000, label: '¥10,000', popular: true },
    { value: 30000, label: '¥30,000', popular: false }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #faf9f7 0%, #f0eeeb 100%)' }}>
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .fade-in-up {
          animation: fadeInUp 0.6s ease forwards;
        }
        .delay-1 { animation-delay: 0.1s; opacity: 0; }
        .delay-2 { animation-delay: 0.2s; opacity: 0; }
        .delay-3 { animation-delay: 0.3s; opacity: 0; }
        .delay-4 { animation-delay: 0.4s; opacity: 0; }
        .kenpai-input {
          width: 100%;
          padding: 1rem 1.25rem;
          border: 2px solid #e8e8e8;
          border-radius: 12px;
          font-size: 1rem;
          font-family: 'Noto Serif JP', serif;
          background: white;
          transition: all 0.3s ease;
        }
        .kenpai-input:focus {
          outline: none;
          border-color: #b8860b;
          box-shadow: 0 0 0 4px rgba(184, 134, 11, 0.1);
        }
        .kenpai-input:disabled {
          background: #f5f5f5;
          color: #999;
        }
        .kenpai-input::placeholder {
          color: #bbb;
        }
        .amount-btn {
          position: relative;
          padding: 1.25rem 1rem;
          border: 2px solid #e8e8e8;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          font-size: 1.1rem;
          font-family: 'Noto Serif JP', serif;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .amount-btn:hover {
          border-color: #b8860b;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .amount-btn.selected {
          border-color: #1a1a1a;
          background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }
        .amount-btn.selected:hover {
          border-color: #1a1a1a;
        }
        .popular-badge {
          position: absolute;
          top: -10px;
          right: -10px;
          background: linear-gradient(135deg, #b8860b 0%, #d4a84b 100%);
          color: white;
          font-size: 0.65rem;
          padding: 0.25rem 0.5rem;
          border-radius: 10px;
          font-weight: 600;
        }
        .submit-btn {
          width: 100%;
          padding: 1.25rem;
          background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 500;
          cursor: pointer;
          font-family: 'Noto Serif JP', serif;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .submit-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 0.5s ease;
        }
        .submit-btn:hover::before {
          left: 100%;
        }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }
        .submit-btn:active {
          transform: translateY(0);
        }
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          font-size: 0.95rem;
          padding: 0.5rem 0;
        }
        .checkbox-label input {
          width: 20px;
          height: 20px;
          cursor: pointer;
          accent-color: #b8860b;
        }
        .photo-frame {
          position: relative;
          width: 160px;
          height: 200px;
          margin: 0 auto 2rem;
        }
        .photo-frame::before {
          content: '';
          position: absolute;
          inset: -8px;
          background: linear-gradient(135deg, #b8860b 0%, #d4a84b 50%, #b8860b 100%);
          border-radius: 8px;
          z-index: 0;
        }
        .photo-inner {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 4px;
          overflow: hidden;
          z-index: 1;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }
        .candle-icon {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <header style={{ 
        padding: '1rem 1.5rem', 
        borderBottom: '1px solid rgba(0,0,0,0.06)', 
        background: 'rgba(250,249,247,0.95)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ 
              width: '40px', 
              height: '40px', 
              background: 'linear-gradient(135deg, #b8860b 0%, #d4a84b 100%)', 
              borderRadius: '10px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'white', 
              fontSize: '1.25rem',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(184, 134, 11, 0.3)'
            }}>礼</span>
            <span style={{ fontSize: '1.1rem', letterSpacing: '0.15em', fontWeight: 500 }}>Rei</span>
          </div>
          <span className="candle-icon" style={{ fontSize: '1.5rem' }}>🕯</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="fade-in-up" style={{ 
        padding: '3rem 1.5rem 2.5rem', 
        textAlign: 'center',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%)'
      }}>
        <p className="fade-in-up delay-1" style={{ 
          fontSize: '0.8rem', 
          color: '#b8860b', 
          marginBottom: '1.5rem', 
          letterSpacing: '0.3em',
          fontWeight: 500
        }}>追 悼</p>

        {project.photo_url && (
          <div className="photo-frame fade-in-up delay-2">
            <div className="photo-inner">
              <img 
                src={project.photo_url} 
                alt={`故 ${project.deceased_name} 様`} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
          </div>
        )}

        <h1 className="fade-in-up delay-2" style={{ 
          fontSize: '1.75rem', 
          fontWeight: 500, 
          color: '#1a1a1a', 
          marginBottom: '2rem',
          letterSpacing: '0.1em'
        }}>
          故 {project.deceased_name} 様
        </h1>

        <div className="fade-in-up delay-3" style={{ 
          maxWidth: '420px', 
          margin: '0 auto', 
          padding: '1.75rem 2rem', 
          background: 'white', 
          borderRadius: '16px', 
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.04)'
        }}>
          <p style={{ 
            color: '#444', 
            lineHeight: 2.2, 
            fontSize: '0.95rem', 
            whiteSpace: 'pre-line' 
          }}>
            {displayMessage}
          </p>
          {!project.use_default_message && project.family_message && (
            <p style={{ marginTop: '1.25rem', fontSize: '0.85rem', color: '#b8860b', fontWeight: 500 }}>
              — ご遺族より
            </p>
          )}
        </div>

        {kenpaiCount > 0 && (
          <p className="fade-in-up delay-4" style={{ 
            marginTop: '1.5rem', 
            fontSize: '0.9rem', 
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ color: '#b8860b' }}>✦</span>
            {kenpaiCount}名の方より献杯を賜りました
            <span style={{ color: '#b8860b' }}>✦</span>
          </p>
        )}
      </section>

      {/* Form Section */}
      <section style={{ padding: '0 1.5rem 3rem', maxWidth: '600px', margin: '0 auto' }}>
        {submitStatus === 'success' ? (
          <div className="fade-in-up" style={{ 
            background: 'white', 
            borderRadius: '20px', 
            padding: '3rem 2rem', 
            textAlign: 'center', 
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.04)'
          }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              margin: '0 auto 1.5rem', 
              background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(72, 187, 120, 0.3)'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20,6 9,17 4,12" />
              </svg>
            </div>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem', lineHeight: 1.6 }}>
              ご厚志を賜り<br />誠にありがとうございます
            </h2>
            <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.8 }}>
              お心遣いに深く感謝申し上げます<br />
              故人もさぞかしお喜びのことと存じます
            </p>
            <button 
              onClick={() => { 
                setSubmitStatus('idle'); 
                setFormData({ donor_name: '', message: '', is_anonymous: false }); 
                fetchData(); 
              }} 
              style={{ 
                marginTop: '2rem', 
                padding: '0.875rem 2.5rem', 
                border: '2px solid #e8e8e8', 
                borderRadius: '12px', 
                background: 'white', 
                cursor: 'pointer', 
                fontFamily: 'inherit',
                fontSize: '0.95rem',
                transition: 'all 0.3s ease'
              }}
            >
              続けてお申し込み
            </button>
          </div>
        ) : (
          <div className="fade-in-up" style={{ 
            background: 'white', 
            borderRadius: '20px', 
            padding: '2rem', 
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.04)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#1a1a1a' }}>
                献杯のお申し込み
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#888' }}>
                故人様への想いをお届けいたします
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {submitStatus === 'error' && (
                <div style={{ 
                  marginBottom: '1.5rem', 
                  padding: '1rem 1.25rem', 
                  background: 'linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%)', 
                  border: '1px solid #fc8181', 
                  borderRadius: '12px', 
                  color: '#c53030', 
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <span>⚠️</span>
                  {errorMessage}
                </div>
              )}

              {/* Name */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, fontSize: '0.95rem', color: '#333' }}>
                  お名前
                </label>
                <input 
                  type="text" 
                  className="kenpai-input" 
                  placeholder="例：山田 花子" 
                  value={formData.donor_name} 
                  onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })} 
                  disabled={formData.is_anonymous} 
                />
                <label className="checkbox-label" style={{ marginTop: '0.75rem' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.is_anonymous} 
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      is_anonymous: e.target.checked, 
                      donor_name: e.target.checked ? '' : formData.donor_name 
                    })} 
                  />
                  <span style={{ color: '#555' }}>匿名で献杯する</span>
                </label>
              </div>

              {/* Amount */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, fontSize: '0.95rem', color: '#333' }}>
                  金額
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                  {amountOptions.map((opt) => (
                    <button 
                      key={opt.value} 
                      type="button" 
                      className={`amount-btn ${selectedAmount === opt.value && !customAmount ? 'selected' : ''}`} 
                      onClick={() => { setSelectedAmount(opt.value); setCustomAmount(''); }}
                    >
                      {opt.popular && <span className="popular-badge">人気</span>}
                      {opt.label}
                    </button>
                  ))}
                </div>
                <input 
                  type="number" 
                  className="kenpai-input" 
                  placeholder="その他の金額（1,000円以上）" 
                  value={customAmount} 
                  onChange={(e) => { setCustomAmount(e.target.value); if (e.target.value) setSelectedAmount(0); }} 
                  min="1000" 
                  step="1000" 
                />
              </div>

              {/* Message */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, fontSize: '0.95rem', color: '#333' }}>
                  故人様へのメッセージ
                  <span style={{ fontWeight: 400, color: '#aaa', marginLeft: '0.5rem', fontSize: '0.85rem' }}>任意</span>
                </label>
                <textarea 
                  className="kenpai-input" 
                  style={{ minHeight: '120px', resize: 'vertical' }} 
                  placeholder="故人様へのお言葉をお書きください" 
                  value={formData.message} 
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
                />
              </div>

              <button type="submit" className="submit-btn" disabled={submitStatus === 'loading'}>
                {submitStatus === 'loading' ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                    <span style={{ 
                      width: '20px', 
                      height: '20px', 
                      border: '2px solid rgba(255,255,255,0.3)', 
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></span>
                    お手続き中...
                  </span>
                ) : 'お支払いへ進む'}
              </button>

              <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.8rem', color: '#aaa', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  決済は安全なStripeシステムで処理されます
                </p>
              </div>
            </form>
          </div>
        )}

        {/* Footer Links */}
        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <a 
            href="/admin/payments" 
            style={{ 
              fontSize: '0.85rem', 
              color: '#888', 
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              transition: 'all 0.3s ease'
            }}
          >
            ご遺族様専用ページはこちら →
          </a>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: '#bbb', lineHeight: 1.8 }}>
            ご不明な点がございましたら<br />
            葬儀社までお問い合わせください
          </p>
          <a href="/terms" style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.5rem', display: 'inline-block' }}>
            利用規約
          </a>
        </div>
      </section>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
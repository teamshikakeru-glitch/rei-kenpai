'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function KenpaiPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const [project, setProject] = useState<any>(null);
  const [kenpaiList, setKenpaiList] = useState<any[]>([]);
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
    
    const { data: kenpaiData } = await supabase
      .from('kenpai')
      .select('id, donor_name, message, is_anonymous, created_at')
      .eq('project_id', projectData.id)
      .order('created_at', { ascending: false });
    
    setKenpaiList(kenpaiData || []);
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

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  };

  const defaultMessage = '故人様のご生前は格別のご厚情を賜り\n心より御礼申し上げます';
  const displayMessage = project?.use_default_message || !project?.family_message ? defaultMessage : project.family_message;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)' }}>
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ width: '40px', height: '40px', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#c9a227', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)', color: 'white' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>404</p>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>ページが見つかりません</p>
        </div>
      </div>
    );
  }

  if (project.status === 'draft' || project.status === 'closed') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)', color: 'white' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#c9a227', letterSpacing: '0.2em', marginBottom: '16px' }}>
            {project.status === 'closed' ? 'CLOSED' : 'COMING SOON'}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>
            {project.status === 'closed' ? '受付は終了しました' : '準備中です'}
          </p>
        </div>
      </div>
    );
  }

  const amountOptions = [
    { value: 5000, label: '5,000' },
    { value: 10000, label: '10,000' },
    { value: 30000, label: '30,000' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)' }}>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(201, 162, 39, 0.3); }
          50% { box-shadow: 0 0 40px rgba(201, 162, 39, 0.5); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .fade-in { animation: fadeIn 0.8s ease forwards; }
        .delay-1 { animation-delay: 0.1s; opacity: 0; }
        .delay-2 { animation-delay: 0.2s; opacity: 0; }
        .delay-3 { animation-delay: 0.3s; opacity: 0; }
        .delay-4 { animation-delay: 0.4s; opacity: 0; }
        .input-field {
          width: 100%;
          padding: 18px 20px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          font-size: 16px;
          background: rgba(255,255,255,0.03);
          color: white;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }
        .input-field:focus {
          outline: none;
          border-color: #c9a227;
          background: rgba(255,255,255,0.05);
          box-shadow: 0 0 0 3px rgba(201,162,39,0.1);
        }
        .input-field:disabled {
          opacity: 0.5;
        }
        .input-field::placeholder {
          color: rgba(255,255,255,0.3);
        }
        .amount-btn {
          flex: 1;
          padding: 20px 16px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }
        .amount-btn:hover {
          border-color: rgba(201,162,39,0.5);
          background: rgba(201,162,39,0.1);
        }
        .amount-btn.selected {
          border-color: #c9a227;
          background: linear-gradient(135deg, rgba(201,162,39,0.2) 0%, rgba(201,162,39,0.1) 100%);
        }
        .amount-btn.selected .amount-value {
          color: #c9a227;
        }
        .amount-value {
          font-size: 20px;
          font-weight: 600;
          color: white;
          margin-bottom: 4px;
        }
        .amount-unit {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
        }
        .submit-btn {
          width: 100%;
          padding: 20px;
          background: linear-gradient(135deg, #c9a227 0%, #a08020 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.05em;
        }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(201,162,39,0.4);
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .checkbox-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          padding: 12px 0;
        }
        .checkbox-wrap input {
          width: 20px;
          height: 20px;
          accent-color: #c9a227;
        }
        .history-item {
          padding: 20px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .history-item:last-child {
          border-bottom: none;
        }
        .photo-frame {
          width: 140px;
          height: 180px;
          margin: 0 auto 32px;
          position: relative;
          animation: float 6s ease-in-out infinite;
        }
        .photo-frame::before {
          content: '';
          position: absolute;
          inset: -4px;
          background: linear-gradient(135deg, #c9a227, #8b6914, #c9a227);
          border-radius: 8px;
          animation: glow 3s ease-in-out infinite;
        }
        .photo-inner {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 6px;
          overflow: hidden;
          z-index: 1;
        }
      `}</style>

      {/* Header */}
      <header style={{ 
        padding: '16px 24px', 
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(10,10,10,0.9)',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              background: 'linear-gradient(135deg, #c9a227, #8b6914)', 
              borderRadius: '10px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'white', 
              fontSize: '16px',
              fontWeight: 600
            }}>礼</div>
            <span style={{ fontSize: '15px', fontWeight: 500, color: 'white', letterSpacing: '0.1em' }}>Rei</span>
          </div>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em' }}>KENPAI</span>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: '480px', margin: '0 auto', padding: '0 24px 60px' }}>
        
        {/* Hero */}
        <section className="fade-in" style={{ textAlign: 'center', padding: '48px 0 40px' }}>
          <p className="fade-in delay-1" style={{ 
            fontSize: '11px', 
            color: '#c9a227', 
            letterSpacing: '0.3em', 
            marginBottom: '32px',
            fontWeight: 500
          }}>
            ✦ 追 悼 ✦
          </p>
          
          {project.photo_url && (
            <div className="photo-frame fade-in delay-2">
              <div className="photo-inner">
                <img src={project.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          )}
          
          <h1 className="fade-in delay-2" style={{ 
            fontSize: '28px', 
            fontWeight: 300, 
            color: 'white', 
            marginBottom: '32px',
            letterSpacing: '0.1em'
          }}>
            故 <span style={{ fontWeight: 500 }}>{project.deceased_name}</span> 様
          </h1>
          
          <div className="fade-in delay-3" style={{ 
            padding: '28px 24px', 
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px'
          }}>
            <p style={{ 
              color: 'rgba(255,255,255,0.7)', 
              lineHeight: 2.2, 
              fontSize: '14px', 
              whiteSpace: 'pre-line' 
            }}>
              {displayMessage}
            </p>
            {!project.use_default_message && project.family_message && (
              <p style={{ marginTop: '20px', fontSize: '12px', color: '#c9a227' }}>— ご遺族より</p>
            )}
          </div>

          {kenpaiList.length > 0 && (
            <p className="fade-in delay-4" style={{ 
              marginTop: '24px', 
              fontSize: '13px', 
              color: 'rgba(255,255,255,0.4)'
            }}>
              {kenpaiList.length}名の方より献杯を賜りました
            </p>
          )}
        </section>

        {/* Form */}
        {submitStatus === 'success' ? (
          <section className="fade-in" style={{ 
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px', 
            padding: '48px 28px',
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            <div style={{ 
              width: '72px', 
              height: '72px', 
              margin: '0 auto 24px', 
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20,6 9,17 4,12" />
              </svg>
            </div>
            <h2 style={{ fontSize: '20px', color: 'white', marginBottom: '12px', fontWeight: 400 }}>
              ありがとうございます
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.8 }}>
              ご厚志を賜り<br />心より御礼申し上げます
            </p>
            <button 
              onClick={() => { setSubmitStatus('idle'); setFormData({ donor_name: '', message: '', is_anonymous: false }); fetchData(); }} 
              style={{ 
                marginTop: '32px', 
                padding: '14px 32px', 
                border: '1px solid rgba(255,255,255,0.2)', 
                borderRadius: '10px', 
                background: 'transparent', 
                color: 'white',
                cursor: 'pointer', 
                fontSize: '14px'
              }}
            >
              続けてお申し込み
            </button>
          </section>
        ) : (
          <section className="fade-in" style={{ 
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px', 
            padding: '32px 24px',
            marginBottom: '24px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <h2 style={{ fontSize: '18px', color: 'white', marginBottom: '8px', fontWeight: 400, letterSpacing: '0.05em' }}>
                献杯のお申し込み
              </h2>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>故人様への想いをお届けします</p>
            </div>

            <form onSubmit={handleSubmit}>
              {submitStatus === 'error' && (
                <div style={{ 
                  marginBottom: '20px', 
                  padding: '16px', 
                  background: 'rgba(239,68,68,0.1)', 
                  border: '1px solid rgba(239,68,68,0.3)', 
                  borderRadius: '12px', 
                  color: '#f87171', 
                  fontSize: '13px',
                  textAlign: 'center'
                }}>
                  {errorMessage}
                </div>
              )}

              {/* Name */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '12px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>
                  お名前
                </label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="山田 花子" 
                  value={formData.donor_name} 
                  onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })} 
                  disabled={formData.is_anonymous} 
                />
                <label className="checkbox-wrap">
                  <input 
                    type="checkbox" 
                    checked={formData.is_anonymous} 
                    onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked, donor_name: '' })} 
                  />
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>匿名で献杯する</span>
                </label>
              </div>

              {/* Amount */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '12px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>
                  金額
                </label>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                  {amountOptions.map((opt) => (
                    <button 
                      key={opt.value} 
                      type="button" 
                      className={`amount-btn ${selectedAmount === opt.value && !customAmount ? 'selected' : ''}`} 
                      onClick={() => { setSelectedAmount(opt.value); setCustomAmount(''); }}
                    >
                      <div className="amount-value">¥{opt.label}</div>
                      <div className="amount-unit">YEN</div>
                    </button>
                  ))}
                </div>
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder="その他の金額（1,000円以上）" 
                  value={customAmount} 
                  onChange={(e) => { setCustomAmount(e.target.value); if (e.target.value) setSelectedAmount(0); }} 
                  min="1000" 
                  step="1000" 
                />
              </div>

              {/* Message */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '12px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>
                  メッセージ
                  <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: '8px' }}>任意</span>
                </label>
                <textarea 
                  className="input-field" 
                  style={{ minHeight: '100px', resize: 'vertical' }} 
                  placeholder="故人様へのお言葉" 
                  value={formData.message} 
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
                />
              </div>

              <button type="submit" className="submit-btn" disabled={submitStatus === 'loading'}>
                {submitStatus === 'loading' ? '処理中...' : 'お支払いへ進む'}
              </button>

              <p style={{ marginTop: '16px', fontSize: '11px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Stripeで安全に処理されます
              </p>
            </form>
          </section>
        )}

        {/* History */}
        <section className="fade-in" style={{ 
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.04)',
          borderRadius: '20px', 
          padding: '24px',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#c9a227' }}>✦</span>
              献杯された皆様
            </h3>
            {kenpaiList.length > 0 && (
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{kenpaiList.length}名</span>
            )}
          </div>
          
          {kenpaiList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>まだ献杯はありません</p>
            </div>
          ) : (
            <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
              {kenpaiList.map((kenpai) => (
                <div key={kenpai.id} className="history-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: '14px', color: 'white', fontWeight: 500 }}>
                        {kenpai.is_anonymous || kenpai.donor_name === '匿名' ? '匿名の方' : `${kenpai.donor_name} 様`}
                      </p>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>{formatDate(kenpai.created_at)}</p>
                    </div>
                  </div>
                  {kenpai.message && (
                    <p style={{ 
                      fontSize: '13px', 
                      color: 'rgba(255,255,255,0.5)', 
                      lineHeight: 1.7,
                      padding: '12px 14px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '10px',
                      marginTop: '12px'
                    }}>
                      {kenpai.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer style={{ textAlign: 'center', paddingBottom: '20px' }}>
          <a href="/admin/payments" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>
            ご遺族様専用ページ →
          </a>
          <p style={{ marginTop: '16px', fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>
            ご不明な点は葬儀社まで
          </p>
          <a href="/terms" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.15)', marginTop: '8px', display: 'inline-block' }}>
            利用規約
          </a>
        </footer>
      </main>
    </div>
  );
}
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
    
    // Fetch kenpai list
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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f6f3' }}>
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #e0e0e0', borderTopColor: '#8b7355', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
        </div>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f6f3' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1 style={{ fontSize: '1.25rem', color: '#333', marginBottom: '0.5rem' }}>ページが見つかりません</h1>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>URLをご確認ください</p>
        </div>
      </div>
    );
  }

  if (project.status === 'draft' || project.status === 'closed') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f6f3' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
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
    { value: 5000, label: '5,000円' },
    { value: 10000, label: '10,000円' },
    { value: 30000, label: '30,000円' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8f6f3' }}>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade {
          animation: fadeIn 0.6s ease forwards;
        }
        .input-field {
          width: 100%;
          padding: 16px 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          background: #fff;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }
        .input-field:focus {
          outline: none;
          border-color: #8b7355;
          box-shadow: 0 0 0 3px rgba(139, 115, 85, 0.1);
        }
        .input-field:disabled {
          background: #f5f5f5;
          color: #999;
        }
        .input-field::placeholder {
          color: #bbb;
        }
        .amount-option {
          flex: 1;
          padding: 16px 12px;
          border: 2px solid #e8e8e8;
          border-radius: 8px;
          background: #fff;
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;
          text-align: center;
          transition: all 0.2s ease;
        }
        .amount-option:hover {
          border-color: #ccc;
        }
        .amount-option.selected {
          border-color: #8b7355;
          background: #8b7355;
          color: #fff;
        }
        .submit-button {
          width: 100%;
          padding: 18px;
          background: #2d2d2d;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .submit-button:hover {
          background: #1a1a1a;
        }
        .submit-button:disabled {
          background: #999;
          cursor: not-allowed;
        }
        .checkbox-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          padding: 8px 0;
        }
        .checkbox-wrap input {
          width: 18px;
          height: 18px;
          accent-color: #8b7355;
        }
        .history-item {
          padding: 16px 0;
          border-bottom: 1px solid #eee;
          animation: slideIn 0.4s ease forwards;
        }
        .history-item:last-child {
          border-bottom: none;
        }
      `}</style>

      {/* Header */}
      <header style={{ 
        background: '#fff', 
        borderBottom: '1px solid #eee',
        padding: '12px 20px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            background: 'linear-gradient(135deg, #8b7355, #a08060)', 
            borderRadius: '6px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#fff', 
            fontSize: '14px',
            fontWeight: 600
          }}>礼</div>
          <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>Rei</span>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '500px', margin: '0 auto', padding: '0 20px 40px' }}>
        
        {/* Hero */}
        <section className="animate-fade" style={{ textAlign: 'center', padding: '40px 0 30px' }}>
          <p style={{ fontSize: '12px', color: '#8b7355', letterSpacing: '4px', marginBottom: '20px' }}>追 悼</p>
          
          {project.photo_url && (
            <div style={{ 
              width: '120px', 
              height: '150px', 
              margin: '0 auto 20px',
              borderRadius: '4px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              border: '3px solid #fff'
            }}>
              <img src={project.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          
          <h1 style={{ fontSize: '24px', fontWeight: 400, color: '#2d2d2d', marginBottom: '24px', letterSpacing: '2px' }}>
            故 {project.deceased_name} 様
          </h1>
          
          <div style={{ 
            background: '#fff', 
            padding: '24px', 
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
          }}>
            <p style={{ color: '#555', lineHeight: 2, fontSize: '14px', whiteSpace: 'pre-line' }}>
              {displayMessage}
            </p>
            {!project.use_default_message && project.family_message && (
              <p style={{ marginTop: '16px', fontSize: '12px', color: '#8b7355' }}>— ご遺族より</p>
            )}
          </div>
        </section>

        {/* Kenpai History */}
        {kenpaiList.length > 0 && (
          <section className="animate-fade" style={{ 
            background: '#fff', 
            borderRadius: '12px', 
            padding: '20px 24px',
            marginBottom: '24px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
          }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#2d2d2d', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#8b7355' }}>✦</span>
              献杯いただいた皆様
              <span style={{ fontSize: '12px', fontWeight: 400, color: '#999', marginLeft: 'auto' }}>{kenpaiList.length}名</span>
            </h2>
            
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {kenpaiList.map((kenpai, index) => (
                <div key={kenpai.id} className="history-item" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: kenpai.message ? '8px' : 0 }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                        {kenpai.is_anonymous || kenpai.donor_name === '匿名' ? '匿名の方' : `${kenpai.donor_name} 様`}
                      </p>
                      <p style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{formatDate(kenpai.created_at)}</p>
                    </div>
                  </div>
                  {kenpai.message && (
                    <p style={{ 
                      fontSize: '13px', 
                      color: '#666', 
                      lineHeight: 1.6,
                      padding: '10px 12px',
                      background: '#f8f6f3',
                      borderRadius: '6px',
                      marginTop: '8px'
                    }}>
                      {kenpai.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Form */}
        {submitStatus === 'success' ? (
          <section className="animate-fade" style={{ 
            background: '#fff', 
            borderRadius: '12px', 
            padding: '40px 24px',
            textAlign: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
          }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              margin: '0 auto 20px', 
              background: '#4a9c6d', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20,6 9,17 4,12" />
              </svg>
            </div>
            <h2 style={{ fontSize: '18px', marginBottom: '12px', color: '#2d2d2d' }}>
              ありがとうございます
            </h2>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.7 }}>
              ご厚志を賜り<br />心より御礼申し上げます
            </p>
            <button 
              onClick={() => { setSubmitStatus('idle'); setFormData({ donor_name: '', message: '', is_anonymous: false }); fetchData(); }} 
              style={{ marginTop: '24px', padding: '12px 32px', border: '1px solid #ddd', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '14px' }}
            >
              続けてお申し込み
            </button>
          </section>
        ) : (
          <section className="animate-fade" style={{ 
            background: '#fff', 
            borderRadius: '12px', 
            padding: '28px 24px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#2d2d2d', marginBottom: '6px' }}>
                献杯のお申し込み
              </h2>
              <p style={{ fontSize: '12px', color: '#999' }}>故人様への想いをお届けします</p>
            </div>

            <form onSubmit={handleSubmit}>
              {submitStatus === 'error' && (
                <div style={{ 
                  marginBottom: '20px', 
                  padding: '14px 16px', 
                  background: '#fef2f2', 
                  border: '1px solid #fecaca', 
                  borderRadius: '8px', 
                  color: '#dc2626', 
                  fontSize: '13px'
                }}>
                  {errorMessage}
                </div>
              )}

              {/* Name */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500, color: '#333' }}>
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
                <label className="checkbox-wrap" style={{ marginTop: '10px' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.is_anonymous} 
                    onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked, donor_name: '' })} 
                  />
                  <span style={{ fontSize: '13px', color: '#666' }}>匿名で献杯する（履歴にも匿名で表示されます）</span>
                </label>
              </div>

              {/* Amount */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500, color: '#333' }}>
                  金額
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  {amountOptions.map((opt) => (
                    <button 
                      key={opt.value} 
                      type="button" 
                      className={`amount-option ${selectedAmount === opt.value && !customAmount ? 'selected' : ''}`} 
                      onClick={() => { setSelectedAmount(opt.value); setCustomAmount(''); }}
                    >
                      {opt.label}
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
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500, color: '#333' }}>
                  故人様へのメッセージ
                  <span style={{ fontWeight: 400, color: '#aaa', marginLeft: '6px' }}>任意</span>
                </label>
                <textarea 
                  className="input-field" 
                  style={{ minHeight: '100px', resize: 'vertical' }} 
                  placeholder="故人様へのお言葉をお書きください" 
                  value={formData.message} 
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
                />
              </div>

              <button type="submit" className="submit-button" disabled={submitStatus === 'loading'}>
                {submitStatus === 'loading' ? 'お手続き中...' : 'お支払いへ進む'}
              </button>

              <p style={{ marginTop: '14px', fontSize: '11px', color: '#aaa', textAlign: 'center' }}>
                🔒 決済はStripeで安全に処理されます
              </p>
            </form>
          </section>
        )}

        {/* Footer */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <a href="/admin/payments" style={{ fontSize: '13px', color: '#888', textDecoration: 'none' }}>
            ご遺族様専用ページ →
          </a>
          <p style={{ marginTop: '20px', fontSize: '11px', color: '#bbb', lineHeight: 1.7 }}>
            ご不明な点は葬儀社までお問い合わせください
          </p>
          <a href="/terms" style={{ fontSize: '11px', color: '#aaa', marginTop: '8px', display: 'inline-block' }}>
            利用規約
          </a>
        </div>
      </main>
    </div>
  );
}
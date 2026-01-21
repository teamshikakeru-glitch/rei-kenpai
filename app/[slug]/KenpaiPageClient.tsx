'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function KenpaiPageClient() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const [project, setProject] = useState<any>(null);
  const [kenpaiList, setKenpaiList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  // フォーム状態
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ donor_name: '', message: '', is_anonymous: false });
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const supabase = createClient();

  useEffect(() => { 
    if (searchParams.get('success') === 'true') { 
      setSubmitStatus('success'); 
      setStep(1);
      window.history.replaceState({}, '', `/${slug}`); 
    } 
  }, [searchParams, slug]);

  const fetchData = async () => {
    const { data: projectData, error } = await supabase.from('projects').select('*').eq('slug', slug).single();
    if (error || !projectData) { setNotFound(true); setLoading(false); return; }
    setProject(projectData);
    
    const { data: kenpaiData } = await supabase
      .from('kenpai')
      .select('id, donor_name, amount, message, is_anonymous, created_at')
      .eq('project_id', projectData.id)
      .order('created_at', { ascending: false });
    
    setKenpaiList(kenpaiData || []);
    setLoading(false);
  };

  useEffect(() => { if (slug) fetchData(); }, [slug]);

  const handleNext = () => {
    setErrorMessage('');
    if (step === 1) {
      const amount = showCustomInput ? parseInt(customAmount) : selectedAmount;
      if (!amount || amount < 1000) {
        setErrorMessage('金額を選択してください（1,000円以上）');
        return;
      }
    }
    if (step === 2) {
      if (!formData.donor_name && !formData.is_anonymous) {
        setErrorMessage('お名前を入力するか、匿名を選択してください');
        return;
      }
    }
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    setErrorMessage('');
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setSubmitStatus('loading');
    setErrorMessage('');
    const amount = showCustomInput ? parseInt(customAmount) : selectedAmount;
    
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
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  };

  const defaultMessage = '故人様のご生前は格別のご厚情を賜り\n心より御礼申し上げます';
  const displayMessage = project?.use_default_message || !project?.family_message ? defaultMessage : project.family_message;
  const totalAmount = kenpaiList.reduce((sum, k) => sum + (k.amount || 0), 0);
  const currentAmount = showCustomInput ? parseInt(customAmount) || 0 : selectedAmount || 0;

  // 金額選択肢（「人気」表示を削除）
  const amounts = [
    { value: 3000, label: '3,000円' },
    { value: 5000, label: '5,000円' },
    { value: 10000, label: '10,000円' },
    { value: 30000, label: '30,000円' },
  ];

  // ローディング画面
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #faf8f5 0%, #f5f0e8 100%)' }}>
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ width: '48px', height: '48px', border: '3px solid #e8e4dc', borderTopColor: '#c9a227', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  // 404画面
  if (notFound || !project) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #faf8f5 0%, #f5f0e8 100%)', fontFamily: '"Noto Serif JP", serif' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '64px', marginBottom: '16px', color: '#d4cfc4' }}>404</p>
          <p style={{ color: '#888' }}>ページが見つかりません</p>
        </div>
      </div>
    );
  }

  // 下書き・終了画面
  if (project.status === 'draft' || project.status === 'closed') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #faf8f5 0%, #f5f0e8 100%)', fontFamily: '"Noto Serif JP", serif' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#c9a227', letterSpacing: '0.2em', marginBottom: '16px' }}>
            {project.status === 'closed' ? 'CLOSED' : 'COMING SOON'}
          </p>
          <p style={{ color: '#888' }}>
            {project.status === 'closed' ? '受付は終了しました' : '準備中です'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #faf8f5 0%, #f5f0e8 100%)', fontFamily: '"Noto Serif JP", "Hiragino Mincho ProN", serif' }}>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .fade-in { animation: fadeIn 0.5s ease-out; }
        .fade-in-up { animation: fadeInUp 0.6s ease-out; }
        .input-focus:focus {
          outline: none;
          border-color: #c9a227 !important;
          box-shadow: 0 0 0 4px rgba(201,162,39,0.1);
        }
        .btn-hover:hover {
          transform: translateY(-2px);
        }
        .btn-hover:active {
          transform: translateY(0);
        }
      `}</style>

      {/* ヘッダー */}
      <header style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #c9a227 0%, #d4af37 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(201,162,39,0.3)',
          }}>礼</div>
          <span style={{ color: 'white', fontSize: '18px', fontWeight: '500', letterSpacing: '0.1em' }}>Rei</span>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', letterSpacing: '0.15em' }}>KENPAI</span>
      </header>

      {/* メインコンテンツ */}
      <main style={{ maxWidth: '520px', margin: '0 auto', padding: '24px 16px 40px' }}>
        
        {/* 故人情報カード */}
        <div className="fade-in-up" style={{
          background: 'white',
          borderRadius: '24px',
          padding: '36px 24px',
          marginBottom: '24px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          textAlign: 'center',
        }}>
          {/* 遺影（写真がある場合のみ表示） */}
          {project.photo_url && (
            <div style={{
              width: '160px',
              height: '200px',
              margin: '0 auto 24px',
              position: 'relative',
              animation: 'float 6s ease-in-out infinite',
            }}>
              <div style={{
                position: 'absolute',
                inset: '-4px',
                background: 'linear-gradient(135deg, #c9a227, #d4af37)',
                borderRadius: '14px',
                boxShadow: '0 8px 32px rgba(201,162,39,0.25)',
              }} />
              <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                borderRadius: '12px',
                overflow: 'hidden',
                zIndex: 1,
              }}>
                <img src={project.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          )}
          
          <p style={{ fontSize: '12px', color: '#c9a227', letterSpacing: '0.3em', marginBottom: '12px' }}>
            ✦ 追 悼 ✦
          </p>
          
          <h1 style={{ fontSize: '32px', fontWeight: '500', color: '#1a1a1a', marginBottom: '20px', letterSpacing: '0.1em' }}>
            故 {project.deceased_name} 様
          </h1>
          
          <p style={{ fontSize: '15px', color: '#666', lineHeight: '2.2', padding: '20px 0', borderTop: '1px solid #f0ebe3', whiteSpace: 'pre-line' }}>
            {displayMessage}
          </p>
          {!project.use_default_message && project.family_message && (
            <p style={{ fontSize: '13px', color: '#c9a227' }}>— ご遺族より</p>
          )}
        </div>

        {/* 献杯総額サマリー */}
        {kenpaiList.length > 0 && (
          <div className="fade-in" style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            borderRadius: '16px',
            padding: '20px 24px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}>
            <div>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
                皆様からのお気持ち
              </p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
                {kenpaiList.length}名の方々より
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '28px', fontWeight: '600', color: '#c9a227', letterSpacing: '0.02em' }}>
                ¥{totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* 成功メッセージ */}
        {submitStatus === 'success' ? (
          <div className="fade-in-up" style={{
            background: 'white',
            borderRadius: '24px',
            padding: '48px 24px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            textAlign: 'center',
            marginBottom: '24px',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(34,197,94,0.3)',
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20,6 9,17 4,12" />
              </svg>
            </div>
            <h2 style={{ fontSize: '22px', color: '#1a1a1a', marginBottom: '12px', fontWeight: '500' }}>
              ありがとうございます
            </h2>
            <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.9' }}>
              ご厚志を賜り<br />心より御礼申し上げます
            </p>
            <button
              onClick={() => { setSubmitStatus('idle'); setStep(1); setFormData({ donor_name: '', message: '', is_anonymous: false }); setSelectedAmount(null); fetchData(); }}
              className="btn-hover"
              style={{
                marginTop: '32px',
                padding: '16px 32px',
                border: '2px solid #e8e4dc',
                borderRadius: '12px',
                background: 'white',
                color: '#666',
                cursor: 'pointer',
                fontSize: '15px',
                transition: 'all 0.3s ease',
              }}
            >
              続けてお申し込み
            </button>
          </div>
        ) : (
          <>
            {/* ステップインジケーター */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '24px',
            }}>
              {[1, 2, 3].map((s) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: step >= s ? 'linear-gradient(135deg, #c9a227 0%, #d4af37 100%)' : '#e8e4dc',
                    color: step >= s ? 'white' : '#999',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    boxShadow: step >= s ? '0 4px 12px rgba(201,162,39,0.3)' : 'none',
                  }}>{s}</div>
                  {s < 3 && (
                    <div style={{
                      width: '48px',
                      height: '2px',
                      background: step > s ? '#c9a227' : '#e8e4dc',
                      transition: 'all 0.3s ease',
                    }} />
                  )}
                </div>
              ))}
            </div>

            {/* ステップ1: 金額選択 */}
            {step === 1 && (
              <div className="fade-in" style={{
                background: 'white',
                borderRadius: '24px',
                padding: '32px 24px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                marginBottom: '24px',
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: '500', color: '#1a1a1a', textAlign: 'center', marginBottom: '8px' }}>
                  献杯金額をお選びください
                </h2>
                <p style={{ fontSize: '13px', color: '#888', textAlign: 'center', marginBottom: '28px' }}>
                  故人様への想いをお届けします
                </p>

                {errorMessage && (
                  <div style={{ marginBottom: '20px', padding: '14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', color: '#dc2626', fontSize: '13px', textAlign: 'center' }}>
                    {errorMessage}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  {amounts.map((amount) => (
                    <button
                      key={amount.value}
                      onClick={() => { setSelectedAmount(amount.value); setShowCustomInput(false); setCustomAmount(''); }}
                      className="btn-hover"
                      style={{
                        position: 'relative',
                        padding: '24px 16px',
                        border: selectedAmount === amount.value && !showCustomInput ? '2px solid #c9a227' : '2px solid #e8e4dc',
                        borderRadius: '16px',
                        background: selectedAmount === amount.value && !showCustomInput ? 'linear-gradient(135deg, #fffbf0 0%, #fff8e7 100%)' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        transform: selectedAmount === amount.value && !showCustomInput ? 'scale(1.02)' : 'scale(1)',
                        boxShadow: selectedAmount === amount.value && !showCustomInput ? '0 8px 24px rgba(201,162,39,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
                      }}
                    >
                      <span style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        color: selectedAmount === amount.value && !showCustomInput ? '#c9a227' : '#1a1a1a',
                      }}>{amount.label}</span>
                    </button>
                  ))}
                </div>

                {/* その他金額 */}
                <div style={{ marginTop: '16px' }}>
                  {!showCustomInput ? (
                    <button
                      onClick={() => { setShowCustomInput(true); setSelectedAmount(null); }}
                      style={{
                        width: '100%',
                        padding: '18px',
                        border: '2px dashed #d4cfc4',
                        borderRadius: '14px',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: '#888',
                        fontSize: '14px',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      その他の金額を入力
                    </button>
                  ) : (
                    <div style={{
                      padding: '16px',
                      border: '2px solid #c9a227',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #fffbf0 0%, #fff8e7 100%)',
                    }}>
                      <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '8px' }}>金額を入力（1,000円以上）</label>
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="10000"
                        min="1000"
                        step="1000"
                        className="input-focus"
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          border: '2px solid #e8e4dc',
                          borderRadius: '10px',
                          fontSize: '20px',
                          textAlign: 'center',
                          fontWeight: '600',
                          boxSizing: 'border-box',
                        }}
                      />
                      <button
                        onClick={() => { setShowCustomInput(false); setCustomAmount(''); }}
                        style={{ marginTop: '12px', fontSize: '13px', color: '#888', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        ← 戻る
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNext}
                  disabled={!selectedAmount && !customAmount}
                  className="btn-hover"
                  style={{
                    width: '100%',
                    marginTop: '28px',
                    padding: '20px',
                    background: (selectedAmount || customAmount) ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' : '#e8e4dc',
                    color: (selectedAmount || customAmount) ? 'white' : '#999',
                    border: 'none',
                    borderRadius: '14px',
                    fontSize: '17px',
                    fontWeight: '500',
                    cursor: (selectedAmount || customAmount) ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s ease',
                    boxShadow: (selectedAmount || customAmount) ? '0 8px 24px rgba(0,0,0,0.15)' : 'none',
                  }}
                >
                  次へ進む →
                </button>
              </div>
            )}

            {/* ステップ2: お名前・メッセージ */}
            {step === 2 && (
              <div className="fade-in" style={{
                background: 'white',
                borderRadius: '24px',
                padding: '32px 24px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                marginBottom: '24px',
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: '500', color: '#1a1a1a', textAlign: 'center', marginBottom: '28px' }}>
                  お名前とメッセージ
                </h2>

                {errorMessage && (
                  <div style={{ marginBottom: '20px', padding: '14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', color: '#dc2626', fontSize: '13px', textAlign: 'center' }}>
                    {errorMessage}
                  </div>
                )}

                {/* 匿名チェック */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '18px',
                  background: formData.is_anonymous ? 'linear-gradient(135deg, #fffbf0 0%, #fff8e7 100%)' : '#f8f6f2',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  marginBottom: '24px',
                  border: formData.is_anonymous ? '2px solid #c9a227' : '2px solid transparent',
                  transition: 'all 0.3s ease',
                }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '8px',
                    border: formData.is_anonymous ? '2px solid #c9a227' : '2px solid #ccc',
                    background: formData.is_anonymous ? '#c9a227' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    flexShrink: 0,
                  }}>
                    {formData.is_anonymous && <span style={{ color: 'white', fontSize: '16px' }}>✓</span>}
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.is_anonymous}
                    onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked, donor_name: '' })}
                    style={{ display: 'none' }}
                  />
                  <span style={{ fontSize: '16px', color: '#1a1a1a' }}>匿名で献杯する</span>
                </label>

                {/* お名前入力 */}
                {!formData.is_anonymous && (
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#666', marginBottom: '10px' }}>
                      お名前 <span style={{ color: '#c9a227' }}>必須</span>
                    </label>
                    <input
                      type="text"
                      value={formData.donor_name}
                      onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
                      placeholder="山田 花子"
                      className="input-focus"
                      style={{
                        width: '100%',
                        padding: '18px',
                        border: '2px solid #e8e4dc',
                        borderRadius: '14px',
                        fontSize: '17px',
                        boxSizing: 'border-box',
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </div>
                )}

                {/* メッセージ入力 */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#666', marginBottom: '10px' }}>
                    メッセージ <span style={{ color: '#888' }}>任意</span>
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="ご冥福をお祈りいたします..."
                    rows={4}
                    className="input-focus"
                    style={{
                      width: '100%',
                      padding: '18px',
                      border: '2px solid #e8e4dc',
                      borderRadius: '14px',
                      fontSize: '16px',
                      resize: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                      lineHeight: '1.8',
                      transition: 'all 0.3s ease',
                    }}
                  />
                </div>

                {/* ボタン */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handleBack}
                    className="btn-hover"
                    style={{
                      flex: 1,
                      padding: '18px',
                      background: 'white',
                      color: '#666',
                      border: '2px solid #e8e4dc',
                      borderRadius: '14px',
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    ← 戻る
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!formData.is_anonymous && !formData.donor_name}
                    className="btn-hover"
                    style={{
                      flex: 2,
                      padding: '18px',
                      background: (formData.is_anonymous || formData.donor_name) ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' : '#e8e4dc',
                      color: (formData.is_anonymous || formData.donor_name) ? 'white' : '#999',
                      border: 'none',
                      borderRadius: '14px',
                      fontSize: '16px',
                      fontWeight: '500',
                      cursor: (formData.is_anonymous || formData.donor_name) ? 'pointer' : 'not-allowed',
                      transition: 'all 0.3s ease',
                      boxShadow: (formData.is_anonymous || formData.donor_name) ? '0 8px 24px rgba(0,0,0,0.15)' : 'none',
                    }}
                  >
                    確認画面へ →
                  </button>
                </div>
              </div>
            )}

            {/* ステップ3: 確認 */}
            {step === 3 && (
              <div className="fade-in" style={{
                background: 'white',
                borderRadius: '24px',
                padding: '32px 24px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                marginBottom: '24px',
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: '500', color: '#1a1a1a', textAlign: 'center', marginBottom: '28px' }}>
                  内容のご確認
                </h2>

                {/* 確認内容 */}
                <div style={{
                  background: '#f8f6f2',
                  borderRadius: '18px',
                  padding: '24px',
                  marginBottom: '24px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '18px', borderBottom: '1px solid #e8e4dc', marginBottom: '18px' }}>
                    <span style={{ color: '#666', fontSize: '15px' }}>献杯金額</span>
                    <span style={{ fontSize: '28px', fontWeight: '600', color: '#c9a227' }}>
                      ¥{currentAmount.toLocaleString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ color: '#666', fontSize: '15px' }}>お名前</span>
                    <span style={{ fontSize: '16px', color: '#1a1a1a', fontWeight: '500' }}>
                      {formData.is_anonymous ? '匿名' : formData.donor_name}
                    </span>
                  </div>

                  {formData.message && (
                    <div style={{ marginTop: '18px', paddingTop: '18px', borderTop: '1px solid #e8e4dc' }}>
                      <span style={{ color: '#666', fontSize: '14px', display: 'block', marginBottom: '10px' }}>メッセージ</span>
                      <p style={{ fontSize: '15px', color: '#1a1a1a', lineHeight: '1.9' }}>{formData.message}</p>
                    </div>
                  )}
                </div>

                {/* 注意事項 */}
                <div style={{
                  background: '#fffbf0',
                  border: '1px solid #f0e6c8',
                  borderRadius: '14px',
                  padding: '18px',
                  marginBottom: '28px',
                }}>
                  <p style={{ fontSize: '13px', color: '#92400e', lineHeight: '1.9' }}>
                    ※ 決済はStripe（クレジットカード）で安全に処理されます<br />
                    ※ 献杯後のキャンセルはできません
                  </p>
                </div>

                {submitStatus === 'error' && (
                  <div style={{ marginBottom: '20px', padding: '14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', color: '#dc2626', fontSize: '13px', textAlign: 'center' }}>
                    {errorMessage}
                  </div>
                )}

                {/* ボタン */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handleBack}
                    className="btn-hover"
                    style={{
                      flex: 1,
                      padding: '18px',
                      background: 'white',
                      color: '#666',
                      border: '2px solid #e8e4dc',
                      borderRadius: '14px',
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    ← 戻る
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitStatus === 'loading'}
                    className="btn-hover"
                    style={{
                      flex: 2,
                      padding: '20px',
                      background: 'linear-gradient(135deg, #c9a227 0%, #d4af37 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '14px',
                      fontSize: '17px',
                      fontWeight: '600',
                      cursor: submitStatus === 'loading' ? 'not-allowed' : 'pointer',
                      boxShadow: '0 8px 24px rgba(201,162,39,0.3)',
                      transition: 'all 0.3s ease',
                      opacity: submitStatus === 'loading' ? 0.7 : 1,
                    }}
                  >
                    {submitStatus === 'loading' ? '処理中...' : '献杯する'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* 献杯履歴セクション */}
        <div className="fade-in-up" style={{
          background: 'white',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}>
          {/* ヘッダー */}
          <div style={{
            background: 'linear-gradient(135deg, #f8f6f2 0%, #f0ebe3 100%)',
            padding: '20px 24px',
            borderBottom: '1px solid #e8e4dc',
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '500', color: '#1a1a1a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#c9a227' }}>✦</span>
              献杯いただいた皆様
              <span style={{ marginLeft: 'auto', fontSize: '13px', color: '#888', fontWeight: '400' }}>
                全{kenpaiList.length}件
              </span>
            </h3>
          </div>

          {/* 履歴リスト */}
          {kenpaiList.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: '#999' }}>まだ献杯はありません</p>
            </div>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {kenpaiList.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    padding: '20px 24px',
                    borderBottom: index < kenpaiList.length - 1 ? '1px solid #f0ebe3' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: item.message ? '12px' : 0 }}>
                    <div>
                      <p style={{ fontSize: '16px', fontWeight: '500', color: '#1a1a1a', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {item.is_anonymous || item.donor_name === '匿名' ? (
                          <>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '28px',
                              height: '28px',
                              background: '#e8e4dc',
                              borderRadius: '50%',
                              fontSize: '12px',
                              color: '#888',
                            }}>匿</span>
                            匿名の方
                          </>
                        ) : (
                          <>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '28px',
                              height: '28px',
                              background: 'linear-gradient(135deg, #c9a227 0%, #d4af37 100%)',
                              borderRadius: '50%',
                              color: 'white',
                              fontSize: '12px',
                              fontWeight: '600',
                            }}>{item.donor_name.charAt(0)}</span>
                            {item.donor_name} 様
                          </>
                        )}
                      </p>
                      <p style={{ fontSize: '12px', color: '#999' }}>{formatDate(item.created_at)}</p>
                    </div>
                    {item.amount && (
                      <p style={{ fontSize: '18px', fontWeight: '600', color: '#c9a227' }}>
                        ¥{item.amount.toLocaleString()}
                      </p>
                    )}
                  </div>

                  {item.message && (
                    <div style={{
                      background: '#faf9f7',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginTop: '8px',
                    }}>
                      <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.8', margin: 0 }}>{item.message}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* フッター */}
        <footer style={{ textAlign: 'center', padding: '32px 16px' }}>
          <a href={`/family/${slug}`} style={{ fontSize: '13px', color: '#888', textDecoration: 'none' }}>
            ご遺族様専用ページ →
          </a>
          <p style={{ marginTop: '16px', fontSize: '12px', color: '#aaa' }}>
            ご不明な点は葬儀社まで
          </p>
          <a href="/terms" style={{ fontSize: '11px', color: '#ccc', marginTop: '8px', display: 'inline-block' }}>
            利用規約
          </a>
          <p style={{ marginTop: '20px', fontSize: '11px', color: '#ccc' }}>
            Powered by Rei © 2026 SHIKAKERU Inc.
          </p>
        </footer>
      </main>
    </div>
  );
}
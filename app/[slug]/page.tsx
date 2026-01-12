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

  useEffect(() => { if (searchParams.get('success') === 'true') { setSubmitStatus('success'); window.history.replaceState({}, '', `/${slug}`); } }, [searchParams, slug]);

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
    e.preventDefault(); setSubmitStatus('loading'); setErrorMessage('');
    const amount = customAmount ? parseInt(customAmount) : selectedAmount;
    if (!formData.donor_name && !formData.is_anonymous) { setErrorMessage('お名前をご入力いただくか、匿名をお選びください'); setSubmitStatus('error'); return; }
    if (!amount || amount < 1000) { setErrorMessage('1,000円以上をご指定ください'); setSubmitStatus('error'); return; }
    try {
      const donorName = formData.is_anonymous ? '匿名' : formData.donor_name;
      const response = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount, donor_name: donorName, project_id: project.id, slug, message: formData.message, is_anonymous: formData.is_anonymous }) });
      const { url, error } = await response.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch (error) { setErrorMessage('お手続きを開始できませんでした'); setSubmitStatus('error'); }
  };

  const defaultMessage = '故人様のご生前は格別のご厚情を賜り\n心より御礼申し上げます';
  const displayMessage = project?.use_default_message || !project?.family_message ? defaultMessage : project.family_message;

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#faf9f7' }}>読み込み中...</div>;
  if (notFound || !project) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#faf9f7' }}><div style={{ textAlign: 'center' }}><h1>ページが見つかりません</h1><p>URLをご確認ください</p></div></div>;
  if (project.status === 'draft') return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#faf9f7' }}><div style={{ textAlign: 'center' }}><h1>準備中</h1><p>このページは現在準備中でございます</p></div></div>;

  const amountOptions = [{ value: 5000, label: '¥5,000' }, { value: 10000, label: '¥10,000' }, { value: 30000, label: '¥30,000' }];

  return (
    <div style={{ minHeight: '100vh', background: '#faf9f7', fontFamily: "'Noto Serif JP', serif" }}>
      <style>{`.kenpai-input { width: 100%; padding: 1rem; border: 1px solid #d4d4d4; border-radius: 8px; font-size: 1rem; font-family: inherit; } .kenpai-input:focus { outline: none; border-color: #1a1a1a; } .kenpai-input:disabled { background: #f5f5f5; color: #999; } .amount-btn { padding: 1rem; border: 2px solid #d4d4d4; border-radius: 8px; background: white; cursor: pointer; font-size: 1.1rem; font-family: inherit; } .amount-btn:hover { border-color: #8a8a8a; } .amount-btn.selected { border-color: #1a1a1a; background: #1a1a1a; color: white; } .submit-btn { width: 100%; padding: 1rem; background: #1a1a1a; color: white; border: none; border-radius: 8px; font-size: 1.1rem; cursor: pointer; font-family: inherit; } .submit-btn:hover { background: #333; } .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; } .checkbox-label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.95rem; } .checkbox-label input { width: 18px; height: 18px; cursor: pointer; }`}</style>
      
      <header style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e8e8e8', background: 'rgba(250,249,247,0.95)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #b8860b, #d4a84b)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.1rem' }}>礼</span>
          <span style={{ fontSize: '1rem', letterSpacing: '0.1em' }}>Rei</span>
        </div>
      </header>

      <section style={{ padding: '3rem 1.5rem', textAlign: 'center', borderBottom: '1px solid #e8e8e8', background: 'linear-gradient(180deg, #faf9f7 0%, #f5f3f0 100%)' }}>
        <p style={{ fontSize: '0.85rem', color: '#8a8a8a', marginBottom: '1.5rem', letterSpacing: '0.2em' }}>追悼</p>
        {project.photo_url && (
          <div style={{ width: '140px', height: '180px', margin: '0 auto 1.5rem', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '4px solid white' }}>
            <img src={project.photo_url} alt={`故 ${project.deceased_name} 様`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <h1 style={{ fontSize: '1.75rem', fontWeight: 500, color: '#1a1a1a', marginBottom: '1.5rem' }}>故 {project.deceased_name} 様</h1>
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <p style={{ color: '#555', lineHeight: 2, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>{displayMessage}</p>
          {!project.use_default_message && project.family_message && <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#999' }}>— ご遺族より</p>}
        </div>
        {kenpaiCount > 0 && <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#666' }}>{kenpaiCount}名の方より献杯を賜りました</p>}
      </section>

      <section style={{ padding: '2rem 1.5rem 3rem', maxWidth: '600px', margin: '0 auto' }}>
        {submitStatus === 'success' ? (
          <div style={{ background: 'white', borderRadius: '12px', padding: '3rem 2rem', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <div style={{ width: '60px', height: '60px', margin: '0 auto 1.5rem', background: '#1a1a1a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="20,6 9,17 4,12" /></svg>
            </div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>ご厚志を賜り<br />誠にありがとうございます</h2>
            <p style={{ color: '#6b6b6b', fontSize: '0.9rem', lineHeight: 1.7 }}>お心遣いに深く感謝申し上げます<br />故人もさぞかしお喜びのことと存じます</p>
            <button onClick={() => { setSubmitStatus('idle'); setFormData({ donor_name: '', message: '', is_anonymous: false }); fetchData(); }} style={{ marginTop: '2rem', padding: '0.75rem 2rem', border: '1px solid #d4d4d4', borderRadius: '8px', background: 'white', cursor: 'pointer', fontFamily: 'inherit' }}>続けてお申し込み</button>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', textAlign: 'center' }}>献杯のお申し込み</h2>
            <p style={{ fontSize: '0.85rem', color: '#6b6b6b', textAlign: 'center', marginBottom: '1.5rem' }}>故人様への想いをお届けいたします</p>
            <form onSubmit={handleSubmit}>
              {submitStatus === 'error' && <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '0.9rem' }}>{errorMessage}</div>}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.95rem' }}>お名前</label>
                <input type="text" className="kenpai-input" placeholder="例：山田 花子" value={formData.donor_name} onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })} disabled={formData.is_anonymous} />
                <label className="checkbox-label" style={{ marginTop: '0.75rem' }}><input type="checkbox" checked={formData.is_anonymous} onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked, donor_name: e.target.checked ? '' : formData.donor_name })} /><span>匿名で献杯する</span></label>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.95rem' }}>金額</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>{amountOptions.map((opt) => (<button key={opt.value} type="button" className={`amount-btn ${selectedAmount === opt.value && !customAmount ? 'selected' : ''}`} onClick={() => { setSelectedAmount(opt.value); setCustomAmount(''); }}>{opt.label}</button>))}</div>
                <input type="number" className="kenpai-input" placeholder="その他の金額（1,000円以上）" value={customAmount} onChange={(e) => { setCustomAmount(e.target.value); if (e.target.value) setSelectedAmount(0); }} min="1000" step="1000" />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.95rem' }}>故人様へのメッセージ<span style={{ fontWeight: 400, color: '#999', marginLeft: '0.5rem' }}>任意</span></label>
                <textarea className="kenpai-input" style={{ minHeight: '100px', resize: 'vertical' }} placeholder="故人様へのお言葉をお書きください" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
              </div>
              <button type="submit" className="submit-btn" disabled={submitStatus === 'loading'}>{submitStatus === 'loading' ? 'お手続き中...' : 'お支払いへ進む'}</button>
              <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#8a8a8a', textAlign: 'center' }}>決済は安全なStripeシステムで処理されます</p>
            </form>
          </div>
        )}

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <a href="/family" style={{ fontSize: '0.85rem', color: '#666', textDecoration: 'underline' }}>ご遺族様専用ページはこちら</a>
        </div>

        <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#999', textAlign: 'center', lineHeight: 1.7 }}>ご不明な点がございましたら<br />葬儀社までお問い合わせください</p>
      </section>
    </div>
  );
}
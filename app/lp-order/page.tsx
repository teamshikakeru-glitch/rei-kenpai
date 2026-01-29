'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type FormData = {
  company_name: string
  contact_name: string
  email: string
  phone: string
  service_name: string
  industry: string
  purpose: string
  target_audience: string
  feature_1: string
  feature_2: string
  feature_3: string
  achievements: string
  pain_points: string
  cta_url: string
  contact_info: string
  design_mood: string
  reference_url: string
  notes: string
}

const initialFormData: FormData = {
  company_name: '',
  contact_name: '',
  email: '',
  phone: '',
  service_name: '',
  industry: '',
  purpose: '',
  target_audience: '',
  feature_1: '',
  feature_2: '',
  feature_3: '',
  achievements: '',
  pain_points: '',
  cta_url: '',
  contact_info: '',
  design_mood: '',
  reference_url: '',
  notes: '',
}

const purposes = [
  'LINE登録',
  '問い合わせ',
  '購入',
  '予約',
  '資料請求',
  'その他',
]

const moods = [
  'シンプル・クリーン',
  '信頼感・誠実',
  'ポップ・カジュアル',
  '高級感・洗練',
  'ナチュラル・温かみ',
  'クール・スタイリッシュ',
]

export default function LPOrderPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()

      const { data: client, error: clientError } = await supabase
        .from('lp_clients')
        .insert({
          company_name: formData.company_name,
          contact_name: formData.contact_name,
          email: formData.email,
          phone: formData.phone || null,
        })
        .select()
        .single()

      if (clientError) throw clientError

      const { data: project, error: projectError } = await supabase
        .from('lp_projects')
        .insert({
          client_id: client.id,
          project_name: `${formData.service_name} LP制作`,
          status: '受付',
        })
        .select()
        .single()

      if (projectError) throw projectError

      const { error: intakeError } = await supabase
        .from('lp_intake_forms')
        .insert({
          project_id: project.id,
          service_name: formData.service_name,
          industry: formData.industry,
          purpose: formData.purpose,
          target_audience: formData.target_audience,
          features: [formData.feature_1, formData.feature_2, formData.feature_3].filter(Boolean),
          achievements: formData.achievements || null,
          pain_points: formData.pain_points || null,
          cta_url: formData.cta_url,
          contact_info: formData.contact_info || null,
          design_mood: formData.design_mood || null,
          reference_url: formData.reference_url || null,
          notes: formData.notes || null,
        })

      if (intakeError) throw intakeError

      setIsCompleted(true)
    } catch (err) {
      console.error('送信エラー:', err)
      setError('送信に失敗しました。もう一度お試しください。')
    } finally {
      setIsSubmitting(false)
    }
  }

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap');
    
    .lp-order-container * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    .lp-order-container {
      font-family: 'Zen Kaku Gothic New', 'Outfit', sans-serif !important;
      min-height: 100vh;
      background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%);
      padding: 48px 24px;
      line-height: 1.6;
      color: #ffffff;
    }
    
    .lp-order-container input,
    .lp-order-container select,
    .lp-order-container textarea,
    .lp-order-container button {
      font-family: inherit;
    }
    
    .lp-order-inner {
      max-width: 720px;
      margin: 0 auto;
    }
    
    .lp-order-header {
      text-align: center;
      margin-bottom: 48px;
    }
    
    .lp-order-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #00d4aa 0%, #00a8cc 100%);
      padding: 8px 20px;
      border-radius: 100px;
      margin-bottom: 24px;
    }
    
    .lp-order-badge span {
      color: white;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.05em;
    }
    
    .lp-order-title {
      font-size: 36px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 16px;
      letter-spacing: -0.02em;
      line-height: 1.3;
    }
    
    .lp-order-subtitle {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 400;
    }
    
    .lp-order-subtitle .price {
      color: #00d4aa;
      font-weight: 600;
    }
    
    .lp-order-notice {
      background: linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%);
      border: 1px solid rgba(255, 193, 7, 0.2);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 32px;
    }
    
    .lp-order-notice-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }
    
    .lp-order-notice-header span {
      color: #ffc107;
      font-weight: 600;
      font-size: 15px;
    }
    
    .lp-order-notice ul {
      margin: 0;
      padding: 0 0 0 20px;
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      line-height: 2;
    }
    
    .lp-order-section {
      background: rgba(255, 255, 255, 0.02);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.06);
      padding: 32px;
      margin-bottom: 24px;
    }
    
    .lp-order-section-title {
      font-size: 18px;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .lp-order-section-number {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
      color: #fff;
    }
    
    .lp-order-field {
      margin-bottom: 20px;
    }
    
    .lp-order-field:last-child {
      margin-bottom: 0;
    }
    
    .lp-order-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 8px;
    }
    
    .lp-order-required {
      color: #ff6b6b;
    }
    
    .lp-order-input {
      width: 100%;
      padding: 16px 20px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      font-size: 16px;
      color: #ffffff;
      outline: none;
      transition: all 0.3s ease;
    }
    
    .lp-order-input::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
    
    .lp-order-input:focus {
      border-color: rgba(0, 212, 170, 0.5);
      box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
    }
    
    .lp-order-select {
      width: 100%;
      padding: 16px 20px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      font-size: 16px;
      color: #ffffff;
      outline: none;
      transition: all 0.3s ease;
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 16px center;
      background-size: 20px;
    }
    
    .lp-order-select:focus {
      border-color: rgba(0, 212, 170, 0.5);
      box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
    }
    
    .lp-order-select option {
      background: #1a1a2e;
      color: #ffffff;
    }
    
    .lp-order-textarea {
      width: 100%;
      padding: 16px 20px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      font-size: 16px;
      color: #ffffff;
      outline: none;
      transition: all 0.3s ease;
      resize: vertical;
      min-height: 80px;
    }
    
    .lp-order-textarea::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
    
    .lp-order-textarea:focus {
      border-color: rgba(0, 212, 170, 0.5);
      box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
    }
    
    .lp-order-hint {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.4);
      margin-top: 8px;
    }
    
    .lp-order-section-hint {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 20px;
    }
    
    .lp-order-error {
      background: rgba(255, 107, 107, 0.1);
      border: 1px solid rgba(255, 107, 107, 0.3);
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 24px;
      color: #ff6b6b;
      font-size: 14px;
    }
    
    .lp-order-submit {
      width: 100%;
      padding: 20px;
      background: linear-gradient(135deg, #00d4aa 0%, #00a8cc 100%);
      border: none;
      border-radius: 16px;
      font-size: 18px;
      font-weight: 600;
      color: #ffffff;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 8px 32px rgba(0, 212, 170, 0.3);
    }
    
    .lp-order-submit:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(0, 212, 170, 0.4);
    }
    
    .lp-order-submit:disabled {
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.5);
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }
    
    .lp-order-footer {
      text-align: center;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.4);
      margin-top: 20px;
      line-height: 1.8;
    }
    
    .lp-order-complete {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      font-family: 'Zen Kaku Gothic New', 'Outfit', sans-serif;
    }
    
    .lp-order-complete-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 48px;
      max-width: 480px;
      width: 100%;
      text-align: center;
    }
    
    .lp-order-complete-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #00d4aa 0%, #00a8cc 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      box-shadow: 0 8px 32px rgba(0, 212, 170, 0.3);
    }
    
    .lp-order-complete-title {
      font-size: 28px;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 12px;
      letter-spacing: 0.02em;
    }
    
    .lp-order-complete-text {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.8;
      margin-bottom: 24px;
    }
    
    .lp-order-complete-note {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 16px;
    }
    
    .lp-order-complete-note p {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.5);
      margin: 0;
    }
    
    @media (max-width: 640px) {
      .lp-order-container {
        padding: 32px 16px;
      }
      
      .lp-order-title {
        font-size: 28px;
      }
      
      .lp-order-section {
        padding: 24px;
      }
    }
  `

  if (isCompleted) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <div className="lp-order-complete">
          <div className="lp-order-complete-card">
            <div className="lp-order-complete-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h1 className="lp-order-complete-title">送信完了</h1>
            <p className="lp-order-complete-text">
              お申し込みありがとうございます。<br />
              内容を確認の上、ご連絡いたします。
            </p>
            <div className="lp-order-complete-note">
              <p>通常2〜3営業日以内に初稿をお届けします</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="lp-order-container">
        <div className="lp-order-inner">
          {/* ヘッダー */}
          <div className="lp-order-header">
            <div className="lp-order-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span>10社限定</span>
            </div>
            <h1 className="lp-order-title">
              LP制作<br />ヒアリングシート
            </h1>
            <p className="lp-order-subtitle">
              3セクションLP / <span className="price">¥1,000</span>（税込）/ 修正3回まで
            </p>
          </div>

          {/* 注意事項 */}
          <div className="lp-order-notice">
            <div className="lp-order-notice-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffc107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>ご確認ください</span>
            </div>
            <ul>
              <li>素材（画像・ロゴ等）はこちらで選定します。指定はお受けできません。</li>
              <li>修正は3回まで無料。4回目以降は追加料金が発生します。</li>
              <li>納品形式はHTMLファイルです。</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit}>
            {/* お客様情報 */}
            <div className="lp-order-section">
              <h2 className="lp-order-section-title">
                <span className="lp-order-section-number" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>1</span>
                お客様情報
              </h2>
              <div className="lp-order-field">
                <label className="lp-order-label">
                  会社名・屋号 <span className="lp-order-required">*</span>
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  required
                  placeholder="株式会社〇〇 / 〇〇屋"
                  className="lp-order-input"
                />
              </div>
              <div className="lp-order-field">
                <label className="lp-order-label">
                  担当者名 <span className="lp-order-required">*</span>
                </label>
                <input
                  type="text"
                  name="contact_name"
                  value={formData.contact_name}
                  onChange={handleChange}
                  required
                  placeholder="山田 太郎"
                  className="lp-order-input"
                />
              </div>
              <div className="lp-order-field">
                <label className="lp-order-label">
                  メールアドレス <span className="lp-order-required">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="example@email.com"
                  className="lp-order-input"
                />
              </div>
              <div className="lp-order-field">
                <label className="lp-order-label">電話番号（任意）</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="090-1234-5678"
                  className="lp-order-input"
                />
              </div>
            </div>

            {/* サービス情報 */}
            <div className="lp-order-section">
              <h2 className="lp-order-section-title">
                <span className="lp-order-section-number" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>2</span>
                サービス情報
              </h2>
              <div className="lp-order-field">
                <label className="lp-order-label">
                  サービス名・商品名 <span className="lp-order-required">*</span>
                </label>
                <input
                  type="text"
                  name="service_name"
                  value={formData.service_name}
                  onChange={handleChange}
                  required
                  placeholder="〇〇コンサルティング / △△オンラインスクール"
                  className="lp-order-input"
                />
              </div>
              <div className="lp-order-field">
                <label className="lp-order-label">
                  業種・ジャンル <span className="lp-order-required">*</span>
                </label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                  placeholder="飲食 / 美容 / IT / 教育 / コンサル など"
                  className="lp-order-input"
                />
              </div>
              <div className="lp-order-field">
                <label className="lp-order-label">
                  LPの目的 <span className="lp-order-required">*</span>
                </label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  className="lp-order-select"
                >
                  <option value="">選択してください</option>
                  {purposes.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="lp-order-field">
                <label className="lp-order-label">
                  ターゲット <span className="lp-order-required">*</span>
                </label>
                <input
                  type="text"
                  name="target_audience"
                  value={formData.target_audience}
                  onChange={handleChange}
                  required
                  placeholder="30代女性 / 中小企業の経営者 / 副業を始めたい会社員"
                  className="lp-order-input"
                />
              </div>
            </div>

            {/* 強み・特徴 */}
            <div className="lp-order-section">
              <h2 className="lp-order-section-title">
                <span className="lp-order-section-number" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>3</span>
                サービスの強み・特徴
              </h2>
              <p className="lp-order-section-hint">LPに載せたい特徴を3つまでご記入ください</p>
              <div className="lp-order-field">
                <label className="lp-order-label">
                  特徴① <span className="lp-order-required">*</span>
                </label>
                <input
                  type="text"
                  name="feature_1"
                  value={formData.feature_1}
                  onChange={handleChange}
                  required
                  placeholder="初心者でも安心のサポート体制"
                  className="lp-order-input"
                />
              </div>
              <div className="lp-order-field">
                <label className="lp-order-label">特徴②</label>
                <input
                  type="text"
                  name="feature_2"
                  value={formData.feature_2}
                  onChange={handleChange}
                  placeholder="業界最安値の料金設定"
                  className="lp-order-input"
                />
              </div>
              <div className="lp-order-field">
                <label className="lp-order-label">特徴③</label>
                <input
                  type="text"
                  name="feature_3"
                  value={formData.feature_3}
                  onChange={handleChange}
                  placeholder="実績1,000件以上"
                  className="lp-order-input"
                />
              </div>
            </div>

            {/* 追加情報 */}
            <div className="lp-order-section">
              <h2 className="lp-order-section-title">
                <span className="lp-order-section-number" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>4</span>
                追加情報
              </h2>
              <div className="lp-order-field">
                <label className="lp-order-label">実績・数字（任意）</label>
                <textarea
                  name="achievements"
                  value={formData.achievements}
                  onChange={handleChange}
                  rows={2}
                  placeholder="導入企業500社 / 満足度98% / 累計1万人が受講"
                  className="lp-order-textarea"
                />
              </div>
              <div className="lp-order-field">
                <label className="lp-order-label">解決できる悩み・提供できる価値（任意）</label>
                <textarea
                  name="pain_points"
                  value={formData.pain_points}
                  onChange={handleChange}
                  rows={2}
                  placeholder="集客に困っている / 時間がない / 何から始めればいいかわからない"
                  className="lp-order-textarea"
                />
              </div>
            </div>

            {/* CTA・リンク */}
            <div className="lp-order-section">
              <h2 className="lp-order-section-title">
                <span className="lp-order-section-number" style={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', color: '#333' }}>5</span>
                CTA・リンク先
              </h2>
              <div className="lp-order-field">
                <label className="lp-order-label">
                  CTAの遷移先URL <span className="lp-order-required">*</span>
                </label>
                <input
                  type="url"
                  name="cta_url"
                  value={formData.cta_url}
                  onChange={handleChange}
                  required
                  placeholder="https://line.me/... または https://forms.gle/..."
                  className="lp-order-input"
                />
                <p className="lp-order-hint">LINE登録URL、予約フォーム、ECサイト等のリンク</p>
              </div>
              <div className="lp-order-field">
                <label className="lp-order-label">問い合わせ先（任意）</label>
                <input
                  type="text"
                  name="contact_info"
                  value={formData.contact_info}
                  onChange={handleChange}
                  placeholder="info@example.com / 03-1234-5678"
                  className="lp-order-input"
                />
              </div>
            </div>

            {/* デザイン */}
            <div className="lp-order-section">
              <h2 className="lp-order-section-title">
                <span className="lp-order-section-number" style={{ background: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', color: '#333' }}>6</span>
                デザインの方向性
              </h2>
              <div className="lp-order-field">
                <label className="lp-order-label">希望の雰囲気</label>
                <select
                  name="design_mood"
                  value={formData.design_mood}
                  onChange={handleChange}
                  className="lp-order-select"
                >
                  <option value="">選択してください（任意）</option>
                  {moods.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="lp-order-field">
                <label className="lp-order-label">参考サイトURL（任意）</label>
                <input
                  type="url"
                  name="reference_url"
                  value={formData.reference_url}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="lp-order-input"
                />
              </div>
            </div>

            {/* その他 */}
            <div className="lp-order-section">
              <h2 className="lp-order-section-title">
                <span className="lp-order-section-number" style={{ background: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)' }}>7</span>
                その他
              </h2>
              <div className="lp-order-field">
                <label className="lp-order-label">特記事項・伝えておきたいこと（任意）</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="その他ご要望があればご記入ください"
                  className="lp-order-textarea"
                  style={{ minHeight: '100px' }}
                />
              </div>
            </div>

            {/* エラー表示 */}
            {error && (
              <div className="lp-order-error">{error}</div>
            )}

            {/* 送信ボタン */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="lp-order-submit"
            >
              {isSubmitting ? '送信中...' : '申し込む（¥1,000）'}
            </button>

            <p className="lp-order-footer">
              送信後、確認メールをお送りします。<br />
              お支払い方法は別途ご案内いたします。
            </p>
          </form>
        </div>
      </div>
    </>
  )
}
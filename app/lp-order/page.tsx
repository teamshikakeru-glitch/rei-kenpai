'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type FormData = {
  // 顧客情報
  company_name: string
  contact_name: string
  email: string
  phone: string
  // ヒアリング内容
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

      // 1. 顧客を作成
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

      // 2. 案件を作成
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

      // 3. ヒアリング回答を保存
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

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">送信完了</h1>
          <p className="text-gray-600 mb-6">
            お申し込みありがとうございます。<br />
            内容を確認の上、ご連絡いたします。
          </p>
          <p className="text-sm text-gray-500">
            通常2〜3営業日以内に初稿をお届けします。
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            LP制作 ヒアリングシート
          </h1>
          <p className="text-gray-600">
            3セクションLP / ¥1,000（税込）/ 修正3回まで
          </p>
        </div>

        {/* 注意事項 */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
          <h2 className="font-semibold text-amber-800 mb-2">ご確認ください</h2>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>・素材（画像・ロゴ等）はこちらで選定します。指定はお受けできません。</li>
            <li>・修正は3回まで無料。4回目以降は追加料金が発生します。</li>
            <li>・納品形式はHTMLファイルです。</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* お客様情報 */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
              お客様情報
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  会社名・屋号 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="株式会社〇〇 / 〇〇屋"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  担当者名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="contact_name"
                  value={formData.contact_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="山田 太郎"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="example@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  電話番号（任意）
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="090-1234-5678"
                />
              </div>
            </div>
          </section>

          {/* サービス情報 */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
              サービス情報
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  サービス名・商品名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="service_name"
                  value={formData.service_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="〇〇コンサルティング / △△オンラインスクール"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  業種・ジャンル <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="飲食 / 美容 / IT / 教育 / コンサル など"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LPの目的 <span className="text-red-500">*</span>
                </label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">選択してください</option>
                  {purposes.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ターゲット <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="target_audience"
                  value={formData.target_audience}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="30代女性 / 中小企業の経営者 / 副業を始めたい会社員"
                />
              </div>
            </div>
          </section>

          {/* 強み・特徴 */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
              サービスの強み・特徴
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              LPに載せたい特徴を3つまでご記入ください
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  特徴①  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="feature_1"
                  value={formData.feature_1}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="初心者でも安心のサポート体制"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  特徴②
                </label>
                <input
                  type="text"
                  name="feature_2"
                  value={formData.feature_2}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="業界最安値の料金設定"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  特徴③
                </label>
                <input
                  type="text"
                  name="feature_3"
                  value={formData.feature_3}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="実績1,000件以上"
                />
              </div>
            </div>
          </section>

          {/* 追加情報 */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
              追加情報
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  実績・数字（任意）
                </label>
                <textarea
                  name="achievements"
                  value={formData.achievements}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="導入企業500社 / 満足度98% / 累計1万人が受講"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  解決できる悩み・提供できる価値（任意）
                </label>
                <textarea
                  name="pain_points"
                  value={formData.pain_points}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="集客に困っている / 時間がない / 何から始めればいいかわからない"
                />
              </div>
            </div>
          </section>

          {/* CTA・リンク */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
              CTA・リンク先
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CTAの遷移先URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="cta_url"
                  value={formData.cta_url}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://line.me/... または https://forms.gle/..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  LINE登録URL、予約フォーム、ECサイト等のリンク
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  問い合わせ先（任意）
                </label>
                <input
                  type="text"
                  name="contact_info"
                  value={formData.contact_info}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="info@example.com / 03-1234-5678"
                />
              </div>
            </div>
          </section>

          {/* デザイン */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
              デザインの方向性
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  希望の雰囲気
                </label>
                <select
                  name="design_mood"
                  value={formData.design_mood}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">選択してください（任意）</option>
                  {moods.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  参考サイトURL（任意）
                </label>
                <input
                  type="url"
                  name="reference_url"
                  value={formData.reference_url}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </section>

          {/* その他 */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
              その他
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                特記事項・伝えておきたいこと（任意）
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="その他ご要望があればご記入ください"
              />
            </div>
          </section>

          {/* エラー表示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '送信中...' : '申し込む（¥1,000）'}
          </button>

          <p className="text-center text-sm text-gray-500">
            送信後、確認メールをお送りします。<br />
            お支払い方法は別途ご案内いたします。
          </p>
        </form>
      </div>
    </div>
  )
}
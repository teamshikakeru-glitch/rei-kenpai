"use client";

import { useState } from "react";
// import { createClient } from "@/lib/supabase/client"; // ← 本番ではこちらを使用

export default function ContactForm() {
  const [formData, setFormData] = useState({
    inquiryType: "",
    companyName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    contactMessage: "",
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, boolean> = {};
    if (!formData.inquiryType) newErrors.inquiryType = true;
    if (!formData.contactName.trim()) newErrors.contactName = true;
    if (!formData.contactEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail))
      newErrors.contactEmail = true;
    if (!formData.contactMessage.trim()) newErrors.contactMessage = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);

    // ── 本番ではSupabaseに保存 ──
    // const supabase = createClient();
    // await supabase.from('contact_inquiries').insert({
    //   type: formData.inquiryType,
    //   company_name: formData.companyName,
    //   name: formData.contactName,
    //   email: formData.contactEmail,
    //   phone: formData.contactPhone,
    //   message: formData.contactMessage,
    // });

    // 仮の送信遅延（本番では上記Supabase insertに差し替え）
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  if (submitted) {
    return (
      <div className="ct-form-card co-reveal">
        <div className="ct-success">
          <div className="ct-success-icon">✓</div>
          <h3>お問い合わせを<br />受け付けました。</h3>
          <p>
            内容を確認の上、2営業日以内にご連絡いたします。<br />
            しばらくお待ちくださいませ。
          </p>
        </div>

        <style jsx global>{`${contactStyles}`}</style>
      </div>
    );
  }

  return (
    <div className="ct-form-card co-reveal">
      <div className={`ct-form-group ${errors.inquiryType ? "error" : ""}`}>
        <label className="ct-label">
          お問い合わせ種別<span className="ct-required">必須</span>
        </label>
        <select
          className="ct-select"
          value={formData.inquiryType}
          onChange={(e) => handleChange("inquiryType", e.target.value)}
        >
          <option value="" disabled>選択してください</option>
          <option value="rei">礼（Rei）の導入相談</option>
          <option value="rei-custom">礼カスタムのご相談</option>
          <option value="partner">パートナー提携のご相談</option>
          <option value="other">その他</option>
        </select>
        <div className="ct-error-text">お問い合わせ種別を選択してください</div>
      </div>

      <div className="ct-form-group">
        <label className="ct-label">
          会社名・組織名<span className="ct-optional">任意</span>
        </label>
        <input
          type="text" className="ct-input" placeholder="例：○○葬祭"
          value={formData.companyName}
          onChange={(e) => handleChange("companyName", e.target.value)}
        />
      </div>

      <div className={`ct-form-group ${errors.contactName ? "error" : ""}`}>
        <label className="ct-label">
          お名前<span className="ct-required">必須</span>
        </label>
        <input
          type="text" className="ct-input" placeholder="例：山田 太郎"
          value={formData.contactName}
          onChange={(e) => handleChange("contactName", e.target.value)}
        />
        <div className="ct-error-text">お名前を入力してください</div>
      </div>

      <div className={`ct-form-group ${errors.contactEmail ? "error" : ""}`}>
        <label className="ct-label">
          メールアドレス<span className="ct-required">必須</span>
        </label>
        <input
          type="email" className="ct-input" placeholder="例：yamada@example.com"
          value={formData.contactEmail}
          onChange={(e) => handleChange("contactEmail", e.target.value)}
        />
        <div className="ct-error-text">正しいメールアドレスを入力してください</div>
      </div>

      <div className="ct-form-group">
        <label className="ct-label">
          電話番号<span className="ct-optional">任意</span>
        </label>
        <input
          type="tel" className="ct-input" placeholder="例：090-1234-5678"
          value={formData.contactPhone}
          onChange={(e) => handleChange("contactPhone", e.target.value)}
        />
      </div>

      <div className={`ct-form-group ${errors.contactMessage ? "error" : ""}`}>
        <label className="ct-label">
          お問い合わせ内容<span className="ct-required">必須</span>
        </label>
        <textarea
          className="ct-textarea"
          placeholder={`ご質問やご相談内容をお書きください。\n\n例：礼の導入を検討しています。費用や導入の流れについて詳しく教えてください。`}
          value={formData.contactMessage}
          onChange={(e) => handleChange("contactMessage", e.target.value)}
        />
        <div className="ct-error-text">お問い合わせ内容を入力してください</div>
      </div>

      <button
        className="ct-submit"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? "送信中..." : <>送信する<span className="co-btn-arrow">→</span></>}
      </button>

      <style jsx global>{`${contactStyles}`}</style>
    </div>
  );
}

const contactStyles = `
  /* ── Contact Page Layout ── */
  .ct-section { padding: 0 0 120px; }
  .ct-grid { display: grid; grid-template-columns: 1fr 380px; gap: 56px; align-items: start; }

  /* Form Card */
  .ct-form-card {
    background: var(--color-surface); border: 1px solid var(--color-border-light);
    border-radius: 20px; padding: 48px;
  }
  .ct-form-group { margin-bottom: 28px; }
  .ct-label {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; font-weight: 600; margin-bottom: 8px; color: var(--color-text);
  }
  .ct-required {
    font-size: 10px; font-weight: 600; color: white;
    background: var(--color-accent); padding: 2px 6px; border-radius: 3px;
  }
  .ct-optional {
    font-size: 10px; font-weight: 500; color: var(--color-text-light);
    background: var(--color-border-light); padding: 2px 6px; border-radius: 3px;
  }
  .ct-input, .ct-textarea, .ct-select {
    width: 100%; padding: 14px 16px;
    border: 1px solid var(--color-border); border-radius: 8px;
    font-family: var(--font-sans); font-size: 14px; color: var(--color-text);
    background: var(--color-bg); transition: border-color 0.3s, box-shadow 0.3s; outline: none;
  }
  .ct-input:focus, .ct-textarea:focus, .ct-select:focus {
    border-color: var(--color-accent); box-shadow: 0 0 0 3px var(--color-accent-soft);
  }
  .ct-input::placeholder, .ct-textarea::placeholder { color: var(--color-text-light); }
  .ct-textarea { resize: vertical; min-height: 160px; line-height: 1.8; }
  .ct-select {
    appearance: none; cursor: pointer; padding-right: 40px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%238A8A8A' viewBox='0 0 16 16'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 14px center;
  }
  .ct-error-text { font-size: 12px; color: var(--color-error); margin-top: 6px; display: none; }
  .ct-form-group.error .ct-input,
  .ct-form-group.error .ct-textarea,
  .ct-form-group.error .ct-select { border-color: var(--color-error); }
  .ct-form-group.error .ct-error-text { display: block; }

  .ct-submit {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 16px 40px; font-size: 15px; font-weight: 500;
    background: var(--color-accent); color: white; border: none; border-radius: 8px;
    cursor: pointer; font-family: var(--font-sans);
    width: 100%; justify-content: center;
    transition: all 0.3s var(--ease-out);
  }
  .ct-submit:hover { background: var(--color-accent-light); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(44,74,62,0.2); }
  .ct-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }

  /* Success */
  .ct-success { text-align: center; padding: 60px 32px; }
  .ct-success-icon {
    width: 64px; height: 64px; border-radius: 50%;
    background: rgba(44,122,91,0.1); color: var(--color-success);
    display: flex; align-items: center; justify-content: center;
    font-size: 28px; margin: 0 auto 24px;
  }
  .ct-success h3 { font-family: var(--font-serif); font-size: 22px; font-weight: 500; margin-bottom: 12px; }
  .ct-success p { font-size: 14px; color: var(--color-text-secondary); line-height: 2; }

  /* Sidebar */
  .ct-sidebar { position: sticky; top: 96px; }
  .ct-sidebar-card {
    background: var(--color-surface); border: 1px solid var(--color-border-light);
    border-radius: 16px; padding: 36px; margin-bottom: 20px;
  }
  .ct-sidebar-card h3 { font-family: var(--font-serif); font-size: 17px; font-weight: 500; margin-bottom: 20px; }
  .ct-method { padding: 16px 0; border-bottom: 1px solid var(--color-border-light); }
  .ct-method:last-child { border-bottom: none; }
  .ct-method-label { font-size: 11px; font-weight: 600; color: var(--color-text-light); letter-spacing: 0.06em; margin-bottom: 4px; }
  .ct-method-value { font-size: 14px; color: var(--color-text); }
  .ct-method-value a { color: var(--color-accent); transition: opacity 0.3s; text-decoration: none; }
  .ct-method-value a:hover { opacity: 0.7; }
  .ct-sidebar-note { background: var(--color-accent-soft); border-radius: 12px; padding: 24px; }
  .ct-sidebar-note p { font-size: 13px; color: var(--color-text-secondary); line-height: 1.9; }
  .ct-sidebar-note strong { color: var(--color-accent); font-weight: 600; }

  /* Responsive */
  @media (max-width: 1024px) { .ct-grid { grid-template-columns: 1fr 320px; gap: 36px; } }
  @media (max-width: 768px) {
    .ct-section { padding-bottom: 80px; }
    .ct-grid { grid-template-columns: 1fr; gap: 32px; }
    .ct-sidebar { position: static; }
    .ct-form-card { padding: 32px 24px; }
  }
`;
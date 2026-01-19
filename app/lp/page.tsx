'use client';

import { useState } from 'react';

export default function LPPage() {
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // TODO: 実際のフォーム送信処理を実装
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div className="lp-page">
      <style jsx>{`
        .lp-page {
          min-height: 100vh;
          background: #ffffff;
          color: #333333;
          font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif;
        }

        /* ヘッダー */
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        .header-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(145deg, #2563eb, #1d4ed8);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: bold;
          color: white;
        }
        .logo-text {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
          letter-spacing: 0.05em;
        }
        .header-cta {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #ffffff;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .header-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);
        }

        /* キャンペーンバナー */
        .campaign-banner {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          text-align: center;
          padding: 12px 24px;
          position: fixed;
          top: 73px;
          left: 0;
          right: 0;
          z-index: 99;
          font-size: 14px;
          font-weight: 600;
        }
        .campaign-banner-highlight {
          color: #fde047;
        }

        /* ヒーローセクション */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 160px 24px 80px;
          overflow: hidden;
          background: linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%);
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at top right, rgba(37, 99, 235, 0.08) 0%, transparent 50%),
                      radial-gradient(ellipse at bottom left, rgba(14, 165, 233, 0.08) 0%, transparent 50%);
        }
        .hero-content {
          position: relative;
          max-width: 900px;
          text-align: center;
        }
        .hero-campaign {
          display: inline-block;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          padding: 12px 28px;
          border-radius: 100px;
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 20px;
        }
        .hero-campaign-highlight {
          color: #fde047;
        }
        .hero-badge {
          display: inline-block;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #2563eb;
          padding: 8px 20px;
          border-radius: 100px;
          font-size: 14px;
          margin-bottom: 32px;
          letter-spacing: 0.05em;
        }
        .hero-title {
          font-size: clamp(32px, 5vw, 56px);
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 24px;
          color: #1f2937;
        }
        .hero-title-blue {
          color: #2563eb;
        }
        .hero-subtitle {
          font-size: clamp(16px, 2vw, 20px);
          color: #6b7280;
          line-height: 1.8;
          margin-bottom: 48px;
        }
        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #ffffff;
          padding: 20px 48px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 18px;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
        }
        .hero-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(37, 99, 235, 0.4);
        }

        /* セクション共通 */
        .section {
          padding: 100px 24px;
        }
        .section-gray {
          background: #f9fafb;
        }
        .section-blue {
          background: linear-gradient(180deg, #eff6ff 0%, #f9fafb 100%);
        }
        .section-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .section-label {
          color: #2563eb;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.2em;
          margin-bottom: 16px;
          text-align: center;
        }
        .section-title {
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 700;
          text-align: center;
          margin-bottom: 24px;
          line-height: 1.4;
          color: #1f2937;
        }
        .section-desc {
          font-size: 16px;
          color: #6b7280;
          text-align: center;
          max-width: 700px;
          margin: 0 auto 60px;
          line-height: 1.8;
        }

        /* キャンペーンセクション */
        .campaign-section {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          position: relative;
          overflow: hidden;
        }
        .campaign-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .campaign-inner {
          position: relative;
          text-align: center;
          color: white;
        }
        .campaign-label {
          display: inline-block;
          background: #fde047;
          color: #1e40af;
          padding: 8px 24px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 24px;
        }
        .campaign-title {
          font-size: clamp(28px, 5vw, 48px);
          font-weight: 700;
          margin-bottom: 16px;
          color: #ffffff;
        }
        .campaign-title-highlight {
          color: #fde047;
        }
        .campaign-subtitle {
          font-size: clamp(18px, 3vw, 24px);
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 32px;
        }
        .campaign-subtitle-highlight {
          color: #fde047;
        }
        .campaign-detail {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 32px;
          max-width: 700px;
          margin: 0 auto 32px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .campaign-detail-title {
          font-size: 18px;
          color: #fde047;
          margin-bottom: 16px;
          font-weight: 600;
        }
        .campaign-detail-text {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.95);
          line-height: 1.8;
        }
        .campaign-detail-highlight {
          color: #fde047;
          font-weight: 600;
        }
        .campaign-example {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
          margin-top: 24px;
        }
        .campaign-example-item {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 20px 32px;
          text-align: center;
        }
        .campaign-example-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 8px;
        }
        .campaign-example-value {
          font-size: 28px;
          font-weight: 700;
          color: #fde047;
        }
        .campaign-example-sub {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 4px;
        }
        .campaign-note {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 24px;
        }
        .campaign-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          color: #2563eb;
          padding: 20px 48px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 18px;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
        }
        .campaign-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
        }

        /* 課題セクション */
        .problem-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }
        .problem-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 32px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
        }
        .problem-card-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }
        .problem-card-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #1f2937;
        }
        .problem-card-text {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.7;
        }

        /* ソリューションセクション */
        .solution-box {
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          border: 1px solid #bfdbfe;
          border-radius: 24px;
          padding: 48px;
          text-align: center;
          margin-bottom: 60px;
        }
        .solution-box-title {
          font-size: clamp(24px, 3vw, 32px);
          font-weight: 700;
          margin-bottom: 16px;
          color: #1f2937;
        }
        .solution-box-text {
          font-size: 18px;
          color: #4b5563;
        }
        .text-blue {
          color: #2563eb;
          font-weight: 600;
        }

        /* 仕組みセクション */
        .flow-steps {
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 700px;
          margin: 0 auto;
        }
        .flow-step {
          display: flex;
          align-items: center;
          gap: 20px;
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
        }
        .flow-step-num {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          flex-shrink: 0;
        }
        .flow-step-text {
          font-size: 18px;
          color: #1f2937;
        }
        .flow-step-highlight {
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          border: 2px solid #2563eb;
        }

        /* 特徴セクション */
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 32px;
        }
        .feature-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 40px 32px;
          border-top: 4px solid #2563eb;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }
        .feature-num {
          color: #2563eb;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 12px;
        }
        .feature-title {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 16px;
          color: #1f2937;
        }
        .feature-text {
          font-size: 15px;
          color: #6b7280;
          line-height: 1.8;
        }

        /* 料金セクション */
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 32px;
          margin-bottom: 48px;
        }
        .pricing-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
        }
        .pricing-card-highlight {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          border: none;
        }
        .pricing-label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 12px;
        }
        .pricing-card-highlight .pricing-label {
          color: rgba(255, 255, 255, 0.8);
        }
        .pricing-value {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 8px;
          color: #1f2937;
        }
        .pricing-card-highlight .pricing-value {
          color: #ffffff;
        }
        .pricing-value-unit {
          font-size: 24px;
        }
        .pricing-note {
          font-size: 13px;
          color: #9ca3af;
        }
        .pricing-card-highlight .pricing-note {
          color: rgba(255, 255, 255, 0.7);
        }
        .subsidy-box {
          background: #ffffff;
          border-radius: 20px;
          padding: 40px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
        }
        .subsidy-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 24px;
          grid-column: 1 / -1;
          color: #1f2937;
        }
        .subsidy-item {
          background: #eff6ff;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }
        .subsidy-item-label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 8px;
        }
        .subsidy-item-value {
          font-size: 32px;
          font-weight: 700;
          color: #2563eb;
        }
        .subsidy-note {
          grid-column: 1 / -1;
          font-size: 13px;
          color: #9ca3af;
          text-align: center;
        }

        /* 手数料セクション */
        .fee-box {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          color: #ffffff;
          margin-bottom: 40px;
        }
        .fee-box-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .fee-box-subtitle {
          font-size: 16px;
          opacity: 0.9;
        }
        .fee-examples {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }
        .fee-example {
          background: #ffffff;
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
        }
        .fee-example-label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 8px;
        }
        .fee-example-value {
          font-size: 24px;
          font-weight: 700;
          color: #2563eb;
        }
        .fee-breakdown {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px 32px;
          display: flex;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
        }
        .fee-breakdown-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          color: #4b5563;
        }
        .fee-breakdown-dot {
          width: 10px;
          height: 10px;
          background: #2563eb;
          border-radius: 50%;
        }
        .fee-breakdown-total {
          color: #9ca3af;
        }

        /* 比較セクション */
        .compare-box {
          background: #ffffff;
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
        }
        .compare-title {
          font-size: 18px;
          color: #6b7280;
          margin-bottom: 24px;
        }
        .compare-row {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 32px;
          flex-wrap: wrap;
        }
        .compare-item {
          text-align: center;
        }
        .compare-item-label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 8px;
        }
        .compare-item-value {
          font-size: 48px;
          font-weight: 700;
        }
        .compare-item-value-red {
          color: #ef4444;
        }
        .compare-item-value-blue {
          color: #2563eb;
        }
        .compare-vs {
          font-size: 24px;
          color: #d1d5db;
        }
        .compare-message {
          margin-top: 24px;
          font-size: 18px;
          color: #4b5563;
        }

        /* CTAセクション */
        .cta-section {
          background: linear-gradient(180deg, #eff6ff 0%, #ffffff 100%);
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
        }
        .cta-content {
          text-align: center;
        }
        .cta-title {
          font-size: clamp(24px, 4vw, 36px);
          font-weight: 700;
          margin-bottom: 16px;
          color: #1f2937;
        }
        .cta-text {
          font-size: 16px;
          color: #6b7280;
          margin-bottom: 32px;
        }

        /* フォームセクション */
        .form-container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 24px;
          padding: 48px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
        }
        .form-campaign-note {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 32px;
          text-align: center;
          font-size: 14px;
          color: #ffffff;
        }
        .form-campaign-highlight {
          color: #fde047;
          font-weight: 600;
        }
        .form-group {
          margin-bottom: 24px;
        }
        .form-label {
          display: block;
          font-size: 14px;
          color: #4b5563;
          margin-bottom: 8px;
          font-weight: 500;
        }
        .form-required {
          color: #ef4444;
          margin-left: 4px;
        }
        .form-input {
          width: 100%;
          padding: 16px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          color: #1f2937;
          font-size: 16px;
          transition: all 0.3s ease;
        }
        .form-input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          background: #ffffff;
        }
        .form-input::placeholder {
          color: #9ca3af;
        }
        .form-textarea {
          min-height: 120px;
          resize: vertical;
        }
        .form-submit {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
        }
        .form-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
        }
        .form-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .form-success {
          text-align: center;
          padding: 40px;
        }
        .form-success-icon {
          width: 80px;
          height: 80px;
          background: #dcfce7;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          font-size: 40px;
          color: #22c55e;
        }
        .form-success-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 12px;
          color: #1f2937;
        }
        .form-success-text {
          color: #6b7280;
        }

        /* フッター */
        .footer {
          background: #f9fafb;
          padding: 60px 24px 40px;
          border-top: 1px solid #e5e7eb;
        }
        .footer-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .footer-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 40px;
          margin-bottom: 40px;
          padding-bottom: 40px;
          border-bottom: 1px solid #e5e7eb;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .footer-company {
          text-align: right;
        }
        .footer-company-name {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 4px;
          color: #1f2937;
        }
        .footer-company-rep {
          font-size: 14px;
          color: #6b7280;
        }
        .footer-bottom {
          text-align: center;
          font-size: 13px;
          color: #9ca3af;
        }

        @media (max-width: 768px) {
          .header-cta {
            display: none;
          }
          .campaign-banner {
            top: 73px;
            font-size: 12px;
            padding: 10px 16px;
          }
          .hero {
            padding-top: 180px;
          }
          .section {
            padding: 60px 20px;
          }
          .form-container {
            padding: 32px 24px;
          }
          .pricing-card, .feature-card {
            padding: 32px 24px;
          }
          .subsidy-box {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* ヘッダー */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-icon">礼</div>
            <span className="logo-text">Rei</span>
          </div>
          <a href="#contact" className="header-cta">お問い合わせ</a>
        </div>
      </header>

      {/* キャンペーンバナー */}
      <div className="campaign-banner">
        🎉 <span className="campaign-banner-highlight">先着10社限定</span>：システム利用料8%を<span className="campaign-banner-highlight">半年間 貴社に還元</span>キャンペーン実施中！
      </div>

      {/* ヒーロー */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-campaign">
            🎁 先着<span className="hero-campaign-highlight">10社限定</span>：半年間 手数料8%が<span className="hero-campaign-highlight">貴社の収益に</span>
          </div>
          <span className="hero-badge">葬儀社様向け 遠隔献杯システム</span>
          <h1 className="hero-title">
            競合他社の相見積もりに<br />
            <span className="hero-title-blue">負けない</span>ための新提案
          </h1>
          <p className="hero-subtitle">
            遠方の方から献杯（支援金）を集め、<br />
            ご遺族の負担を軽減。見積もりの印象を変える仕組みです。
          </p>
          <a href="#contact" className="hero-cta">
            資料請求・お問い合わせ
            <span>→</span>
          </a>
        </div>
      </section>

      {/* キャンペーンセクション */}
      <section className="section campaign-section">
        <div className="section-inner campaign-inner">
          <span className="campaign-label">🎉 期間限定キャンペーン</span>
          <h2 className="campaign-title">
            先着<span className="campaign-title-highlight">10社</span>限定<br />
            システム利用料8%を<span className="campaign-title-highlight">半年間 貴社に還元</span>
          </h2>
          <p className="campaign-subtitle">
            献杯が集まるほど、<span className="campaign-subtitle-highlight">葬儀社様の収益もアップ</span>！
          </p>
          <div className="campaign-detail">
            <p className="campaign-detail-title">キャンペーン内容</p>
            <p className="campaign-detail-text">
              導入から<span className="campaign-detail-highlight">6ヶ月間</span>、システム利用料<span className="campaign-detail-highlight">8%を貴社に還元</span>いたします。<br />
              献杯金額の8%が<span className="campaign-detail-highlight">葬儀社様の収益</span>になります。
            </p>
            <div className="campaign-example">
              <div className="campaign-example-item">
                <p className="campaign-example-label">10万円の献杯で</p>
                <p className="campaign-example-value">8,000円</p>
                <p className="campaign-example-sub">貴社の収益に</p>
              </div>
              <div className="campaign-example-item">
                <p className="campaign-example-label">50万円の献杯で</p>
                <p className="campaign-example-value">40,000円</p>
                <p className="campaign-example-sub">貴社の収益に</p>
              </div>
            </div>
            <p className="campaign-note">
              ※先着10社に達し次第、キャンペーンは終了となります
            </p>
          </div>
          <a href="#contact" className="campaign-cta">
            今すぐキャンペーンに申し込む
            <span>→</span>
          </a>
        </div>
      </section>

      {/* 課題セクション */}
      <section className="section section-gray">
        <div className="section-inner">
          <p className="section-label">PROBLEM</p>
          <h2 className="section-title">葬儀業界の&quot;本当の課題&quot;</h2>
          <p className="section-desc">
            葬儀業界は&quot;値上げしづらい&quot;業界。<br />
            物価も人件費も上がっているのに、見積もりは上げられない。
          </p>
          <div className="problem-cards">
            <div className="problem-card">
              <div className="problem-card-icon">📊</div>
              <h3 className="problem-card-title">価格競争の激化</h3>
              <p className="problem-card-text">
                他社より高く見えたら選ばれない。<br />
                &quot;内容&quot;ではなく&quot;金額の見え方&quot;で決まる時代。
              </p>
            </div>
            <div className="problem-card">
              <div className="problem-card-icon">💰</div>
              <h3 className="problem-card-title">遺族の経済的負担</h3>
              <p className="problem-card-text">
                葬儀費用の全国平均は約150万円。<br />
                「もっと安くできませんか」という相談が増加。
              </p>
            </div>
            <div className="problem-card">
              <div className="problem-card-icon">🌏</div>
              <h3 className="problem-card-title">参列できない方の増加</h3>
              <p className="problem-card-text">
                遠方・高齢・仕事の都合で参列できない方が、<br />
                お気持ちを届ける手段がない。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ソリューションセクション */}
      <section className="section">
        <div className="section-inner">
          <p className="section-label">SOLUTION</p>
          <h2 className="section-title">Reiとは</h2>
          <div className="solution-box">
            <h3 className="solution-box-title">
              香典をデジタル化するシステムではありません。
            </h3>
            <p className="solution-box-text">
              <span className="text-blue">成約率</span>と<span className="text-blue">見積の印象</span>を変える仕組みです。
            </p>
          </div>
          <div className="flow-steps">
            <div className="flow-step">
              <div className="flow-step-num">1</div>
              <p className="flow-step-text">葬儀社様が献杯ページを作成<span className="text-blue">（3分で完了）</span></p>
            </div>
            <div className="flow-step">
              <div className="flow-step-num">2</div>
              <p className="flow-step-text">専用リンクを遺族にお伝え</p>
            </div>
            <div className="flow-step">
              <div className="flow-step-num">3</div>
              <p className="flow-step-text"><span className="text-blue">遺族がリンクをLINEで共有</span>（遠方の親族・知人へ）</p>
            </div>
            <div className="flow-step">
              <div className="flow-step-num">4</div>
              <p className="flow-step-text">遠方の方がスマホから献杯（支援金）を送金</p>
            </div>
            <div className="flow-step flow-step-highlight">
              <div className="flow-step-num">5</div>
              <p className="flow-step-text"><span className="text-blue">集まったお金は葬儀費用に充当可能</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="section section-gray">
        <div className="section-inner">
          <p className="section-label">FEATURES</p>
          <h2 className="section-title">Reiが選ばれる理由</h2>
          <div className="features">
            <div className="feature-card">
              <p className="feature-num">01</p>
              <h3 className="feature-title">現場の負担ゼロ</h3>
              <p className="feature-text">
                リンクを1つ伝えるだけ。遺族がそれを遠方の方にLINEで送る。それだけで献杯が集まります。映像配信も、複雑な操作も不要です。
              </p>
            </div>
            <div className="feature-card">
              <p className="feature-num">02</p>
              <h3 className="feature-title">「物」ではなく「お金」が集まる</h3>
              <p className="feature-text">
                物販型サービスと違い、集まったお金はそのまま葬儀費用に充当可能。「実質▲10万円」の提案ができるようになります。
              </p>
            </div>
            <div className="feature-card">
              <p className="feature-num">03</p>
              <h3 className="feature-title">安心・安全なお金の管理</h3>
              <p className="feature-text">
                貴社の口座へ直接入金。弊社はお金を預かりません。運営会社の倒産リスクや入金遅延の心配がありません。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 料金セクション */}
      <section className="section section-blue" id="pricing">
        <div className="section-inner">
          <p className="section-label">PRICING</p>
          <h2 className="section-title">料金体系</h2>
          <div className="pricing-grid">
            <div className="pricing-card">
              <p className="pricing-label">初期導入費用</p>
              <p className="pricing-value">500<span className="pricing-value-unit">万円</span></p>
              <p className="pricing-note">（税別）</p>
            </div>
            <div className="pricing-card pricing-card-highlight">
              <p className="pricing-label">月額費用</p>
              <p className="pricing-value">0<span className="pricing-value-unit">円</span></p>
              <p className="pricing-note">完全無料</p>
            </div>
          </div>
          <div className="subsidy-box">
            <h3 className="subsidy-title">🎉 IT導入補助金で最大75%OFF</h3>
            <div className="subsidy-item">
              <p className="subsidy-item-label">補助率 50%の場合</p>
              <p className="subsidy-item-value">250万円</p>
            </div>
            <div className="subsidy-item">
              <p className="subsidy-item-label">補助率 75%の場合</p>
              <p className="subsidy-item-value">125万円</p>
            </div>
            <p className="subsidy-note">
              ※採択率 約70〜80%　※申請サポートも弊社で対応可能
            </p>
          </div>
        </div>
      </section>

      {/* 手数料セクション */}
      <section className="section">
        <div className="section-inner">
          <p className="section-label">FEE</p>
          <h2 className="section-title">献杯手数料</h2>
          <div className="fee-box">
            <p className="fee-box-title">献杯金額の約9割がご遺族に届きます</p>
            <p className="fee-box-subtitle">月額0円の成果報酬型</p>
          </div>
          <div className="fee-examples">
            <div className="fee-example">
              <p className="fee-example-label">献杯 5万円</p>
              <p className="fee-example-value">約44,200円</p>
            </div>
            <div className="fee-example">
              <p className="fee-example-label">献杯 10万円</p>
              <p className="fee-example-value">約88,400円</p>
            </div>
            <div className="fee-example">
              <p className="fee-example-label">献杯 30万円</p>
              <p className="fee-example-value">約265,200円</p>
            </div>
            <div className="fee-example">
              <p className="fee-example-label">献杯 50万円</p>
              <p className="fee-example-value">約442,000円</p>
            </div>
          </div>
          <div className="fee-breakdown">
            <div className="fee-breakdown-item">
              <div className="fee-breakdown-dot" />
              <span>決済手数料（Stripe）：<span className="text-blue">3.6%</span></span>
            </div>
            <div className="fee-breakdown-item">
              <div className="fee-breakdown-dot" />
              <span>システム利用料：<span className="text-blue">8%</span></span>
            </div>
            <div className="fee-breakdown-item">
              <span className="fee-breakdown-total">合計：<strong>11.6%</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* 比較セクション */}
      <section className="section section-gray">
        <div className="section-inner">
          <p className="section-label">COMPARISON</p>
          <h2 className="section-title">Reiを使わなければ、<br />遠方からの献杯は0円です</h2>
          <div className="compare-box">
            <p className="compare-title">10万円の献杯があった場合</p>
            <div className="compare-row">
              <div className="compare-item">
                <p className="compare-item-label">Reiなし</p>
                <p className="compare-item-value compare-item-value-red">0円</p>
              </div>
              <span className="compare-vs">vs</span>
              <div className="compare-item">
                <p className="compare-item-label">Reiあり</p>
                <p className="compare-item-value compare-item-value-blue">88,400円</p>
              </div>
            </div>
            <p className="compare-message">
              <span className="text-blue">0円</span>と<span className="text-blue">88,400円</span>。どちらがご遺族のためになりますか？
            </p>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="section cta-section">
        <div className="section-inner">
          <div className="cta-content">
            <h2 className="cta-title">
              「他社より安くできます」ではなく、<br />
              <span className="text-blue">「お客様の負担を減らせます」</span>という提案を。
            </h2>
            <p className="cta-text">
              Reiで、価格競争から価値競争へ。
            </p>
            <a href="#contact" className="hero-cta">
              資料請求・お問い合わせ
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* フォームセクション */}
      <section className="section section-gray" id="contact">
        <div className="section-inner">
          <p className="section-label">CONTACT</p>
          <h2 className="section-title">お問い合わせ</h2>
          <p className="section-desc">
            資料請求、デモのご依頼、ご質問など、<br />
            お気軽にお問い合わせください。
          </p>
          <div className="form-container">
            <div className="form-campaign-note">
              🎁 今なら<span className="form-campaign-highlight">先着10社限定</span>で、システム利用料8%が<span className="form-campaign-highlight">半年間 貴社の収益に</span>！
            </div>
            {submitted ? (
              <div className="form-success">
                <div className="form-success-icon">✓</div>
                <h3 className="form-success-title">送信完了</h3>
                <p className="form-success-text">
                  お問い合わせありがとうございます。<br />
                  2営業日以内にご連絡いたします。
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">
                    葬儀社名<span className="form-required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="例：〇〇葬儀社"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    お名前<span className="form-required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="例：山田 太郎"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    メールアドレス<span className="form-required">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="例：info@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">電話番号</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="例：03-1234-5678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">お問い合わせ内容</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="資料請求、デモのご依頼、ご質問など"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
                <button type="submit" className="form-submit" disabled={submitting}>
                  {submitting ? '送信中...' : '送信する'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-logo">
              <div className="logo-icon">礼</div>
              <span className="logo-text">Rei</span>
            </div>
            <div className="footer-company">
              <p className="footer-company-name">株式会社SHIKAKERU</p>
              <p className="footer-company-rep">代表取締役 中川 航輝</p>
            </div>
          </div>
          <p className="footer-bottom">
            © 2025 SHIKAKERU Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
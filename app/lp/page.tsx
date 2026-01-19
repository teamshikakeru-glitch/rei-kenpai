'use client';

import { useState, useEffect } from 'react';

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitted(true);
    setSubmitting(false);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="lp-page">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&display=swap');
        
        *, *::before, *::after {
          box-sizing: border-box;
        }
        
        html {
          scroll-behavior: smooth;
        }
      `}</style>
      
      <style jsx>{`
        .lp-page {
          --primary: #1a6b52;
          --primary-light: #2a8a6e;
          --primary-dark: #145542;
          --accent: #d4a853;
          --bg: #fafafa;
          --bg-alt: #f4f4f2;
          --text: #222;
          --text-light: #666;
          --border: #e0e0e0;
          --white: #fff;
          --radius: 12px;
          --radius-lg: 20px;
          
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: 'Noto Sans JP', sans-serif;
          font-size: 15px;
          line-height: 1.7;
          overflow-x: hidden;
          width: 100%;
        }

        /* ===== Header ===== */
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(255,255,255,0.97);
          border-bottom: 1px solid var(--border);
        }
        .header-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-mark {
          width: 36px;
          height: 36px;
          background: var(--primary);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
          color: var(--white);
        }
        .logo-text {
          font-size: 20px;
          font-weight: 700;
          color: var(--text);
        }
        .header-cta {
          background: var(--primary);
          color: var(--white);
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.3s;
        }
        .header-cta:hover {
          background: var(--primary-light);
        }

        /* ===== Hero ===== */
        .hero {
          padding: 80px 16px 40px;
          background: linear-gradient(180deg, #e8f5f0 0%, var(--bg) 100%);
        }
        .hero-inner {
          max-width: 800px;
          margin: 0 auto;
        }
        .hero-badge {
          display: inline-block;
          background: var(--accent);
          color: var(--white);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 16px;
        }
        .hero-title {
          font-size: clamp(24px, 6vw, 40px);
          font-weight: 700;
          line-height: 1.4;
          margin-bottom: 16px;
          color: var(--text);
        }
        .hero-title-accent {
          color: var(--primary);
        }

        /* ===== What is Rei（結論先出し）===== */
        .what-box {
          background: var(--white);
          border: 2px solid var(--primary);
          border-radius: var(--radius-lg);
          padding: 24px 20px;
          margin-bottom: 24px;
        }
        .what-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 12px;
          letter-spacing: 0.1em;
        }
        .what-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 16px;
          line-height: 1.5;
        }
        .what-points {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .what-point {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 14px;
          line-height: 1.6;
        }
        .what-point-icon {
          width: 22px;
          height: 22px;
          background: var(--primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
          font-size: 12px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* ===== Quick Stats ===== */
        .quick-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        .quick-stat {
          background: var(--white);
          border-radius: var(--radius);
          padding: 16px 12px;
          text-align: center;
          border: 1px solid var(--border);
        }
        .quick-stat-value {
          font-size: 20px;
          font-weight: 700;
          color: var(--primary);
          line-height: 1.2;
        }
        .quick-stat-label {
          font-size: 11px;
          color: var(--text-light);
          margin-top: 4px;
        }

        /* ===== CTA Group ===== */
        .cta-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 32px;
        }
        .cta-primary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: var(--primary);
          color: var(--white);
          padding: 16px 24px;
          border-radius: var(--radius);
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s;
        }
        .cta-primary:hover {
          background: var(--primary-light);
          transform: translateY(-2px);
        }
        .cta-secondary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: var(--white);
          color: var(--text);
          padding: 14px 24px;
          border-radius: var(--radius);
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          border: 1px solid var(--border);
          transition: all 0.3s;
        }
        .cta-secondary:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        /* ===== Detail Links ===== */
        .detail-links {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        .detail-link {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 14px 12px;
          text-align: center;
          text-decoration: none;
          color: var(--text);
          font-size: 13px;
          font-weight: 600;
          transition: all 0.3s;
          cursor: pointer;
        }
        .detail-link:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: #f0faf6;
        }
        .detail-link-icon {
          display: block;
          font-size: 20px;
          margin-bottom: 6px;
        }

        /* ===== Campaign Banner ===== */
        .campaign-banner {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          padding: 24px 16px;
          text-align: center;
          color: var(--white);
        }
        .campaign-banner-inner {
          max-width: 600px;
          margin: 0 auto;
        }
        .campaign-banner-badge {
          display: inline-block;
          background: var(--accent);
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 12px;
        }
        .campaign-banner-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 8px;
          line-height: 1.5;
        }
        .campaign-banner-text {
          font-size: 13px;
          opacity: 0.9;
          margin-bottom: 16px;
        }
        .campaign-banner-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--white);
          color: var(--primary);
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: transform 0.3s;
        }
        .campaign-banner-cta:hover {
          transform: scale(1.02);
        }

        /* ===== Section Base ===== */
        .section {
          padding: 56px 16px;
        }
        .section-alt {
          background: var(--bg-alt);
        }
        .section-inner {
          max-width: 800px;
          margin: 0 auto;
        }
        .section-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .section-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--primary);
          letter-spacing: 0.15em;
          margin-bottom: 8px;
        }
        .section-title {
          font-size: clamp(20px, 5vw, 28px);
          font-weight: 700;
          line-height: 1.5;
        }

        /* ===== Flow Section ===== */
        .flow-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .flow-item {
          display: flex;
          gap: 14px;
          background: var(--white);
          border-radius: var(--radius);
          padding: 16px;
          border: 1px solid var(--border);
        }
        .flow-num {
          width: 32px;
          height: 32px;
          background: var(--primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          color: var(--white);
          flex-shrink: 0;
        }
        .flow-text {
          font-size: 14px;
          line-height: 1.6;
          padding-top: 4px;
        }
        .flow-text strong {
          color: var(--primary);
        }
        .flow-highlight {
          background: linear-gradient(135deg, #e8f5f0, #d4eddf);
          border-color: var(--primary);
        }
        .flow-highlight .flow-num {
          background: var(--accent);
        }

        /* ===== Features Section ===== */
        .features-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .feature-card {
          background: var(--white);
          border-radius: var(--radius);
          padding: 20px;
          border: 1px solid var(--border);
        }
        .feature-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .feature-num {
          font-size: 12px;
          font-weight: 700;
          color: var(--primary);
        }
        .feature-title {
          font-size: 16px;
          font-weight: 700;
        }
        .feature-text {
          font-size: 14px;
          color: var(--text-light);
          line-height: 1.7;
        }

        /* ===== Pricing Section ===== */
        .pricing-cards {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }
        .pricing-card {
          background: var(--white);
          border-radius: var(--radius);
          padding: 24px 20px;
          text-align: center;
          border: 1px solid var(--border);
        }
        .pricing-card-highlight {
          background: var(--primary);
          color: var(--white);
          border: none;
        }
        .pricing-label {
          font-size: 13px;
          margin-bottom: 8px;
        }
        .pricing-card-highlight .pricing-label {
          opacity: 0.85;
        }
        .pricing-value {
          font-size: 36px;
          font-weight: 700;
          line-height: 1.2;
        }
        .pricing-unit {
          font-size: 18px;
        }
        .pricing-note {
          font-size: 12px;
          margin-top: 4px;
          opacity: 0.7;
        }
        .subsidy-box {
          background: var(--white);
          border-radius: var(--radius);
          padding: 20px;
          border: 1px solid var(--border);
        }
        .subsidy-title {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 16px;
          text-align: center;
        }
        .subsidy-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 12px;
        }
        .subsidy-item {
          background: var(--bg-alt);
          border-radius: 8px;
          padding: 16px 12px;
          text-align: center;
        }
        .subsidy-item-label {
          font-size: 11px;
          color: var(--text-light);
          margin-bottom: 4px;
        }
        .subsidy-item-value {
          font-size: 22px;
          font-weight: 700;
          color: var(--primary);
        }
        .subsidy-note {
          font-size: 11px;
          color: var(--text-light);
          text-align: center;
        }

        /* ===== Fee Section ===== */
        .fee-box {
          background: var(--primary);
          color: var(--white);
          border-radius: var(--radius);
          padding: 24px 20px;
          text-align: center;
          margin-bottom: 20px;
        }
        .fee-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .fee-subtitle {
          font-size: 13px;
          opacity: 0.85;
        }
        .fee-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }
        .fee-item {
          background: var(--white);
          border-radius: 8px;
          padding: 16px 12px;
          text-align: center;
          border: 1px solid var(--border);
        }
        .fee-item-label {
          font-size: 12px;
          color: var(--text-light);
          margin-bottom: 4px;
        }
        .fee-item-value {
          font-size: 18px;
          font-weight: 700;
          color: var(--primary);
        }
        .fee-breakdown {
          background: var(--white);
          border-radius: 8px;
          padding: 16px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 16px;
          font-size: 13px;
          border: 1px solid var(--border);
        }
        .fee-breakdown-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .fee-breakdown-dot {
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
        }

        /* ===== Comparison ===== */
        .compare-box {
          background: var(--white);
          border-radius: var(--radius);
          padding: 24px 20px;
          text-align: center;
          border: 1px solid var(--border);
        }
        .compare-title {
          font-size: 14px;
          color: var(--text-light);
          margin-bottom: 20px;
        }
        .compare-row {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }
        .compare-item {
          flex: 1;
          max-width: 120px;
        }
        .compare-label {
          font-size: 12px;
          color: var(--text-light);
          margin-bottom: 6px;
        }
        .compare-value {
          font-size: 28px;
          font-weight: 700;
        }
        .compare-value-red {
          color: #dc3545;
        }
        .compare-value-green {
          color: var(--primary);
        }
        .compare-vs {
          font-size: 16px;
          color: var(--border);
        }
        .compare-message {
          font-size: 14px;
          line-height: 1.6;
        }
        .compare-message strong {
          color: var(--primary);
        }

        /* ===== CTA Section ===== */
        .cta-section {
          background: linear-gradient(180deg, var(--bg-alt), var(--bg));
          text-align: center;
        }
        .cta-section-title {
          font-size: clamp(18px, 4.5vw, 24px);
          font-weight: 700;
          margin-bottom: 12px;
          line-height: 1.6;
        }
        .cta-section-title-accent {
          color: var(--primary);
        }
        .cta-section-text {
          font-size: 14px;
          color: var(--text-light);
          margin-bottom: 24px;
        }

        /* ===== Form Section ===== */
        .form-container {
          background: var(--white);
          border-radius: var(--radius-lg);
          padding: 24px 20px;
          border: 1px solid var(--border);
        }
        .form-campaign-note {
          background: var(--primary);
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 24px;
          text-align: center;
          font-size: 13px;
          color: var(--white);
        }
        .form-campaign-highlight {
          color: var(--accent);
          font-weight: 700;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .form-required {
          color: #dc3545;
          margin-left: 4px;
        }
        .form-input {
          width: 100%;
          padding: 14px 16px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-family: inherit;
          font-size: 16px;
          color: var(--text);
          transition: all 0.3s;
          -webkit-appearance: none;
        }
        .form-input:focus {
          outline: none;
          border-color: var(--primary);
          background: var(--white);
        }
        .form-input::placeholder {
          color: #999;
        }
        .form-textarea {
          min-height: 100px;
          resize: vertical;
        }
        .form-submit {
          width: 100%;
          padding: 16px;
          background: var(--primary);
          color: var(--white);
          border: none;
          border-radius: 8px;
          font-family: inherit;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
        }
        .form-submit:hover:not(:disabled) {
          background: var(--primary-light);
        }
        .form-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .form-success {
          text-align: center;
          padding: 32px 16px;
        }
        .form-success-icon {
          width: 56px;
          height: 56px;
          background: #e8f5f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          font-size: 24px;
          color: var(--primary);
        }
        .form-success-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .form-success-text {
          font-size: 14px;
          color: var(--text-light);
          line-height: 1.7;
        }

        /* ===== Footer ===== */
        .footer {
          background: var(--white);
          padding: 32px 16px;
          border-top: 1px solid var(--border);
        }
        .footer-inner {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 16px;
        }
        .footer-company {
          font-size: 13px;
          color: var(--text-light);
          margin-bottom: 8px;
        }
        .footer-copyright {
          font-size: 11px;
          color: #999;
        }

        /* ===== Desktop ===== */
        @media (min-width: 768px) {
          .header-inner {
            padding: 16px 32px;
          }
          .hero {
            padding: 120px 32px 60px;
            text-align: center;
          }
          .hero-inner {
            max-width: 900px;
          }
          .what-box {
            padding: 32px;
          }
          .what-points {
            flex-direction: row;
            justify-content: center;
            gap: 32px;
          }
          .what-point {
            flex-direction: column;
            align-items: center;
            text-align: center;
            max-width: 200px;
          }
          .what-point-icon {
            width: 40px;
            height: 40px;
            font-size: 18px;
            margin-top: 0;
            margin-bottom: 8px;
          }
          .quick-stats {
            max-width: 500px;
            margin: 0 auto 32px;
          }
          .quick-stat-value {
            font-size: 28px;
          }
          .cta-group {
            flex-direction: row;
            justify-content: center;
          }
          .cta-primary, .cta-secondary {
            width: auto;
            min-width: 200px;
          }
          .detail-links {
            grid-template-columns: repeat(4, 1fr);
            max-width: 600px;
            margin: 0 auto;
          }
          .section {
            padding: 80px 32px;
          }
          .section-inner {
            max-width: 900px;
          }
          .flow-list {
            max-width: 600px;
            margin: 0 auto;
          }
          .features-list {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }
          .pricing-cards {
            flex-direction: row;
          }
          .pricing-card {
            flex: 1;
          }
          .fee-grid {
            grid-template-columns: repeat(4, 1fr);
          }
          .form-container {
            max-width: 500px;
            margin: 0 auto;
            padding: 40px;
          }
        }
      `}</style>

      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-mark">礼</div>
            <span className="logo-text">Rei</span>
          </div>
          <a href="#contact" className="header-cta">お問い合わせ</a>
        </div>
      </header>

      {/* Hero - 結論先出し */}
      <section className="hero">
        <div className="hero-inner">
          <span className="hero-badge">🎁 先着10社限定キャンペーン中</span>
          <h1 className="hero-title">
            遠方からの<span className="hero-title-accent">献杯</span>を集めて<br />
            <span className="hero-title-accent">葬儀費用の負担</span>を軽減
          </h1>

          {/* What is Rei - 結論ボックス */}
          <div className="what-box">
            <p className="what-label">Reiとは？</p>
            <p className="what-title">参列できない方からオンラインで献杯（支援金）を集めるシステムです</p>
            <div className="what-points">
              <div className="what-point">
                <div className="what-point-icon">✓</div>
                <span>遺族がLINEでリンクを共有するだけ</span>
              </div>
              <div className="what-point">
                <div className="what-point-icon">✓</div>
                <span>集まったお金は葬儀費用に充当</span>
              </div>
              <div className="what-point">
                <div className="what-point-icon">✓</div>
                <span>現場の負担ゼロ</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="quick-stat">
              <div className="quick-stat-value">約9割</div>
              <div className="quick-stat-label">遺族に届く</div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-value">0円</div>
              <div className="quick-stat-label">月額費用</div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-value">3分</div>
              <div className="quick-stat-label">ページ作成</div>
            </div>
          </div>

          {/* CTA */}
          <div className="cta-group">
            <a href="#contact" className="cta-primary">
              資料請求・お問い合わせ →
            </a>
            <a href="#pricing" className="cta-secondary">
              料金を見る
            </a>
          </div>

          {/* 詳細へのリンク */}
          <div className="detail-links">
            <button className="detail-link" onClick={() => scrollToSection('flow')}>
              <span className="detail-link-icon">📋</span>
              使い方
            </button>
            <button className="detail-link" onClick={() => scrollToSection('features')}>
              <span className="detail-link-icon">✨</span>
              特徴
            </button>
            <button className="detail-link" onClick={() => scrollToSection('pricing')}>
              <span className="detail-link-icon">💰</span>
              料金
            </button>
            <button className="detail-link" onClick={() => scrollToSection('fee')}>
              <span className="detail-link-icon">📊</span>
              手数料
            </button>
          </div>
        </div>
      </section>

      {/* Campaign Banner */}
      <section className="campaign-banner">
        <div className="campaign-banner-inner">
          <span className="campaign-banner-badge">期間限定</span>
          <h2 className="campaign-banner-title">
            先着10社限定<br />手数料8%を半年間 貴社に還元
          </h2>
          <p className="campaign-banner-text">
            10万円の献杯で8,000円、50万円で40,000円が貴社の収益に
          </p>
          <a href="#contact" className="campaign-banner-cta">
            キャンペーンに申し込む →
          </a>
        </div>
      </section>

      {/* Flow Section */}
      <section className="section section-alt" id="flow">
        <div className="section-inner">
          <div className="section-header">
            <p className="section-label">HOW IT WORKS</p>
            <h2 className="section-title">使い方はシンプル</h2>
          </div>
          <div className="flow-list">
            <div className="flow-item">
              <div className="flow-num">1</div>
              <p className="flow-text">葬儀社様が献杯ページを作成<strong>（3分）</strong></p>
            </div>
            <div className="flow-item">
              <div className="flow-num">2</div>
              <p className="flow-text">専用リンクを遺族にお伝え</p>
            </div>
            <div className="flow-item">
              <div className="flow-num">3</div>
              <p className="flow-text"><strong>遺族がLINEで共有</strong>（遠方の方へ）</p>
            </div>
            <div className="flow-item">
              <div className="flow-num">4</div>
              <p className="flow-text">遠方の方がスマホから献杯を送金</p>
            </div>
            <div className="flow-item flow-highlight">
              <div className="flow-num">5</div>
              <p className="flow-text"><strong>集まったお金は葬儀費用に充当可能</strong></p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section" id="features">
        <div className="section-inner">
          <div className="section-header">
            <p className="section-label">FEATURES</p>
            <h2 className="section-title">選ばれる3つの理由</h2>
          </div>
          <div className="features-list">
            <div className="feature-card">
              <div className="feature-header">
                <span className="feature-num">01</span>
                <h3 className="feature-title">現場の負担ゼロ</h3>
              </div>
              <p className="feature-text">
                リンクを1つ伝えるだけ。映像配信も複雑な操作も不要です。
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-header">
                <span className="feature-num">02</span>
                <h3 className="feature-title">お金が直接集まる</h3>
              </div>
              <p className="feature-text">
                物販ではなく現金。そのまま葬儀費用に充当できます。
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-header">
                <span className="feature-num">03</span>
                <h3 className="feature-title">安心の直接入金</h3>
              </div>
              <p className="feature-text">
                貴社口座に直接入金。弊社はお金を預かりません。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section section-alt" id="pricing">
        <div className="section-inner">
          <div className="section-header">
            <p className="section-label">PRICING</p>
            <h2 className="section-title">料金体系</h2>
          </div>
          <div className="pricing-cards">
            <div className="pricing-card">
              <p className="pricing-label">初期導入費用</p>
              <p className="pricing-value">500<span className="pricing-unit">万円</span></p>
              <p className="pricing-note">（税別）</p>
            </div>
            <div className="pricing-card pricing-card-highlight">
              <p className="pricing-label">月額費用</p>
              <p className="pricing-value">0<span className="pricing-unit">円</span></p>
              <p className="pricing-note">完全無料</p>
            </div>
          </div>
          <div className="subsidy-box">
            <h3 className="subsidy-title">🎉 IT導入補助金で最大75%OFF</h3>
            <div className="subsidy-grid">
              <div className="subsidy-item">
                <p className="subsidy-item-label">補助率 50%</p>
                <p className="subsidy-item-value">250万円</p>
              </div>
              <div className="subsidy-item">
                <p className="subsidy-item-label">補助率 75%</p>
                <p className="subsidy-item-value">125万円</p>
              </div>
            </div>
            <p className="subsidy-note">※採択率 約70〜80% ※申請サポート対応可</p>
          </div>
        </div>
      </section>

      {/* Fee Section */}
      <section className="section" id="fee">
        <div className="section-inner">
          <div className="section-header">
            <p className="section-label">FEE</p>
            <h2 className="section-title">献杯手数料</h2>
          </div>
          <div className="fee-box">
            <p className="fee-title">献杯金額の約9割がご遺族に届きます</p>
            <p className="fee-subtitle">月額0円の成果報酬型</p>
          </div>
          <div className="fee-grid">
            <div className="fee-item">
              <p className="fee-item-label">5万円</p>
              <p className="fee-item-value">約44,200円</p>
            </div>
            <div className="fee-item">
              <p className="fee-item-label">10万円</p>
              <p className="fee-item-value">約88,400円</p>
            </div>
            <div className="fee-item">
              <p className="fee-item-label">30万円</p>
              <p className="fee-item-value">約265,200円</p>
            </div>
            <div className="fee-item">
              <p className="fee-item-label">50万円</p>
              <p className="fee-item-value">約442,000円</p>
            </div>
          </div>
          <div className="fee-breakdown">
            <div className="fee-breakdown-item">
              <div className="fee-breakdown-dot" />
              <span>決済手数料 3.6%</span>
            </div>
            <div className="fee-breakdown-item">
              <div className="fee-breakdown-dot" />
              <span>システム利用料 8%</span>
            </div>
            <div className="fee-breakdown-item">
              <span style={{ color: '#666' }}>合計 11.6%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="section section-alt">
        <div className="section-inner">
          <div className="section-header">
            <p className="section-label">COMPARISON</p>
            <h2 className="section-title">Reiがなければ0円です</h2>
          </div>
          <div className="compare-box">
            <p className="compare-title">10万円の献杯があった場合</p>
            <div className="compare-row">
              <div className="compare-item">
                <p className="compare-label">Reiなし</p>
                <p className="compare-value compare-value-red">0円</p>
              </div>
              <span className="compare-vs">vs</span>
              <div className="compare-item">
                <p className="compare-label">Reiあり</p>
                <p className="compare-value compare-value-green">88,400円</p>
              </div>
            </div>
            <p className="compare-message">
              <strong>0円</strong>と<strong>88,400円</strong>。<br />どちらがご遺族のためになりますか？
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="section-inner">
          <h2 className="cta-section-title">
            「他社より安くできます」ではなく<br />
            <span className="cta-section-title-accent">「お客様の負担を減らせます」</span>
          </h2>
          <p className="cta-section-text">価格競争から価値競争へ</p>
          <a href="#contact" className="cta-primary" style={{ display: 'inline-flex' }}>
            資料請求・お問い合わせ →
          </a>
        </div>
      </section>

      {/* Form Section */}
      <section className="section section-alt" id="contact">
        <div className="section-inner">
          <div className="section-header">
            <p className="section-label">CONTACT</p>
            <h2 className="section-title">お問い合わせ</h2>
          </div>
          <div className="form-container">
            <div className="form-campaign-note">
              🎁 今なら<span className="form-campaign-highlight">先着10社限定</span>で手数料8%が<span className="form-campaign-highlight">半年間 貴社の収益に</span>
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

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">
            <div className="logo-mark">礼</div>
            <span className="logo-text">Rei</span>
          </div>
          <p className="footer-company">株式会社SHIKAKERU　代表取締役 中川 航輝</p>
          <p className="footer-copyright">© 2025 SHIKAKERU Inc.</p>
        </div>
      </footer>
    </div>
  );
}
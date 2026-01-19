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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitted(true);
    setSubmitting(false);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="page">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
      `}</style>
      
      <style jsx>{`
        .page {
          --primary: #1a6b52;
          --primary-light: #238c6a;
          --primary-dark: #145542;
          --accent: #e8a830;
          --bg: #fafaf8;
          --bg-alt: #f2f2ef;
          --text: #1a1a1a;
          --text-sub: #555;
          --border: #ddd;
          --white: #fff;
          
          font-family: 'Noto Sans JP', sans-serif;
          font-size: 15px;
          line-height: 1.8;
          color: var(--text);
          background: var(--bg);
          min-height: 100vh;
          word-break: keep-all;
          overflow-wrap: break-word;
        }

        /* Header */
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        .header-inner {
          max-width: 1000px;
          margin: 0 auto;
          padding: 14px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-icon {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
          font-weight: 700;
          font-size: 18px;
          box-shadow: 0 2px 8px rgba(26, 107, 82, 0.25);
        }
        .logo-text {
          font-size: 20px;
          font-weight: 700;
        }
        .header-btn {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: var(--white);
          padding: 10px 22px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s;
          box-shadow: 0 2px 8px rgba(26, 107, 82, 0.25);
        }
        .header-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(26, 107, 82, 0.35);
        }

        /* Hero */
        .hero {
          padding: 100px 20px 60px;
          background: linear-gradient(180deg, #e6f2ee 0%, var(--bg) 100%);
          text-align: center;
        }
        .hero-inner {
          max-width: 700px;
          margin: 0 auto;
        }
        .hero-catch {
          font-size: 15px;
          color: var(--text-sub);
          margin-bottom: 8px;
        }
        .hero-title {
          font-size: clamp(24px, 5vw, 36px);
          font-weight: 700;
          line-height: 1.5;
          margin-bottom: 16px;
          word-break: keep-all;
          overflow-wrap: break-word;
        }
        .hero-title-em {
          color: var(--primary);
        }
        .hero-sub {
          font-size: 15px;
          color: var(--text-sub);
          line-height: 1.8;
          margin-bottom: 32px;
          word-break: keep-all;
          overflow-wrap: break-word;
        }
        .hero-badge {
          display: inline-block;
          background: var(--accent);
          color: var(--white);
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 24px;
        }

        /* What Box */
        .what-box {
          background: var(--white);
          border: 2px solid var(--primary);
          border-radius: 20px;
          padding: 32px 28px;
          margin-bottom: 36px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(26, 107, 82, 0.08);
        }
        .what-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--primary);
          letter-spacing: 0.15em;
          margin-bottom: 12px;
          text-transform: uppercase;
        }
        .what-title {
          font-size: 16px;
          font-weight: 700;
          line-height: 1.7;
          margin-bottom: 28px;
        }
        .what-points {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .what-point {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 500;
        }
        .what-check {
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          border-radius: 50%;
          color: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(26, 107, 82, 0.25);
        }

        /* Stats */
        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin: 0 auto 32px;
          max-width: 420px;
        }
        .stat {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px 16px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: var(--primary);
          line-height: 1.2;
        }
        .stat-label {
          font-size: 12px;
          color: var(--text-sub);
          margin-top: 6px;
        }

        /* CTA */
        .cta-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-bottom: 40px;
        }
        .cta-main {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: var(--white);
          padding: 18px 44px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s;
          box-shadow: 0 4px 16px rgba(26, 107, 82, 0.3);
        }
        .cta-main:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(26, 107, 82, 0.4);
        }
        .cta-sub {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: var(--white);
          color: var(--primary);
          padding: 14px 32px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          border: 2px solid var(--primary);
          transition: all 0.3s;
        }
        .cta-sub:hover {
          background: var(--primary);
          color: var(--white);
        }

        /* Nav Links */
        .nav-links {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          max-width: 480px;
          margin: 0 auto;
        }
        .nav-link {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px 12px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text);
          cursor: pointer;
          transition: all 0.3s;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .nav-link:hover {
          border-color: var(--primary);
          color: var(--primary);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(26, 107, 82, 0.12);
        }
        .nav-link-icon {
          display: block;
          font-size: 20px;
          margin-bottom: 6px;
        }

        /* Campaign */
        .campaign {
          background: linear-gradient(135deg, var(--primary), #0d4a38);
          color: var(--white);
          padding: 48px 20px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .campaign::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          pointer-events: none;
        }
        .campaign-inner {
          max-width: 600px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .campaign-badge {
          display: inline-block;
          background: var(--accent);
          padding: 6px 18px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 20px;
          letter-spacing: 0.05em;
        }
        .campaign-title {
          font-size: clamp(18px, 4vw, 24px);
          font-weight: 700;
          line-height: 1.6;
          margin-bottom: 12px;
        }
        .campaign-text {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 24px;
          line-height: 1.7;
        }
        .campaign-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--white);
          color: var(--primary);
          padding: 16px 32px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        .campaign-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(0,0,0,0.2);
        }

        /* Section */
        .section {
          padding: 72px 20px;
        }
        .section-alt {
          background: var(--bg-alt);
        }
        .section-inner {
          max-width: 800px;
          margin: 0 auto;
        }
        .section-head {
          text-align: center;
          margin-bottom: 48px;
        }
        .section-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--primary);
          letter-spacing: 0.2em;
          margin-bottom: 10px;
          text-transform: uppercase;
        }
        .section-title {
          font-size: clamp(22px, 5vw, 28px);
          font-weight: 700;
          line-height: 1.5;
        }
        .section-desc {
          font-size: 15px;
          color: var(--text-sub);
          margin-top: 14px;
          line-height: 1.8;
        }

        /* Flow */
        .flow-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 600px;
          margin: 0 auto;
        }
        .flow-item {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          gap: 18px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          transition: all 0.3s;
        }
        .flow-item:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
          transform: translateY(-2px);
        }
        .flow-num {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          border-radius: 12px;
          color: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 700;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(26, 107, 82, 0.25);
        }
        .flow-content {
          flex: 1;
        }
        .flow-title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 6px;
        }
        .flow-text {
          font-size: 14px;
          color: var(--text-sub);
          line-height: 1.7;
        }
        .flow-em {
          color: var(--primary);
          font-weight: 600;
        }
        .flow-highlight {
          background: linear-gradient(135deg, #e8f5f0, #d8efe7);
          border-color: var(--primary);
          border-width: 2px;
        }
        .flow-highlight .flow-num {
          background: linear-gradient(135deg, var(--accent), #d4922a);
        }

        /* Features */
        .features {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .feature {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          transition: all 0.3s;
        }
        .feature:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          transform: translateY(-4px);
        }
        .feature-head {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 14px;
        }
        .feature-num {
          font-size: 12px;
          font-weight: 700;
          color: var(--white);
          background: var(--primary);
          padding: 4px 10px;
          border-radius: 6px;
          flex-shrink: 0;
        }
        .feature-title {
          font-size: 18px;
          font-weight: 700;
          word-break: keep-all;
          overflow-wrap: break-word;
        }
        .feature-text {
          font-size: 14px;
          color: var(--text-sub);
          line-height: 1.8;
          word-break: keep-all;
          overflow-wrap: break-word;
        }
        .feature-list {
          margin-top: 16px;
          padding-left: 0;
          list-style: none;
        }
        .feature-list li {
          position: relative;
          padding-left: 24px;
          font-size: 14px;
          color: var(--text-sub);
          line-height: 1.8;
          margin-bottom: 8px;
          word-break: keep-all;
          overflow-wrap: break-word;
        }
        .feature-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--primary);
          font-weight: 700;
        }

        /* Pricing */
        .pricing-cards {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 28px;
        }
        .pricing-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 32px 28px;
          text-align: center;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }
        .pricing-card-main {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: var(--white);
          border: none;
          box-shadow: 0 4px 20px rgba(26, 107, 82, 0.3);
        }
        .pricing-label {
          font-size: 14px;
          margin-bottom: 10px;
        }
        .pricing-card-main .pricing-label {
          opacity: 0.85;
        }
        .pricing-value {
          font-size: 48px;
          font-weight: 700;
          line-height: 1.2;
        }
        .pricing-unit {
          font-size: 22px;
        }
        .pricing-note {
          font-size: 13px;
          margin-top: 6px;
          opacity: 0.7;
        }
        .subsidy {
          background: var(--white);
          border: 2px solid var(--accent);
          border-radius: 20px;
          padding: 28px;
          text-align: center;
          box-shadow: 0 4px 16px rgba(232, 168, 48, 0.15);
        }
        .subsidy-title {
          font-size: 17px;
          font-weight: 700;
          margin-bottom: 24px;
          color: var(--text);
        }
        .subsidy-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 16px;
        }
        .subsidy-item {
          background: linear-gradient(135deg, #fef9f0, #fdf3e0);
          border-radius: 12px;
          padding: 20px 16px;
          text-align: center;
        }
        .subsidy-item-label {
          font-size: 12px;
          color: var(--text-sub);
          margin-bottom: 6px;
        }
        .subsidy-item-value {
          font-size: 28px;
          font-weight: 700;
          color: var(--accent);
        }
        .subsidy-note {
          font-size: 12px;
          color: var(--text-sub);
        }

        /* Fee */
        .fee-main {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: var(--white);
          border-radius: 20px;
          padding: 32px 28px;
          text-align: center;
          margin-bottom: 28px;
          box-shadow: 0 4px 20px rgba(26, 107, 82, 0.3);
        }
        .fee-main-title {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 6px;
        }
        .fee-main-sub {
          font-size: 14px;
          opacity: 0.85;
        }
        .fee-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }
        .fee-item {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 20px 16px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .fee-item-label {
          font-size: 13px;
          color: var(--text-sub);
          margin-bottom: 6px;
        }
        .fee-item-value {
          font-size: 22px;
          font-weight: 700;
          color: var(--primary);
        }
        .fee-breakdown {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .fee-breakdown-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          font-size: 13px;
        }
        .fee-breakdown-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .fee-dot {
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
        }
        .fee-breakdown-text {
          margin-top: 16px;
          font-size: 12px;
          color: var(--text-sub);
          line-height: 1.7;
        }

        /* Compare */
        .compare {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 40px 28px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }
        .compare-label {
          font-size: 14px;
          color: var(--text-sub);
          margin-bottom: 28px;
        }
        .compare-row {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 24px;
          margin-bottom: 28px;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }
        .compare-item {
          text-align: center;
        }
        .compare-item-label {
          font-size: 13px;
          color: var(--text-sub);
          margin-bottom: 10px;
        }
        .compare-item-value {
          font-size: 40px;
          font-weight: 700;
        }
        .compare-red { 
          color: #dc3545; 
        }
        .compare-green { 
          color: var(--primary); 
        }
        .compare-vs {
          font-size: 16px;
          color: #bbb;
          font-weight: 600;
        }
        .compare-msg {
          font-size: 15px;
          line-height: 1.8;
        }
        .compare-msg strong {
          color: var(--primary);
        }

        /* CTA Section */
        .cta-section {
          text-align: center;
          background: linear-gradient(180deg, var(--bg-alt), var(--bg));
        }
        .cta-section-title {
          font-size: clamp(22px, 5vw, 30px);
          font-weight: 700;
          line-height: 1.6;
          margin-bottom: 16px;
        }
        .cta-section-em {
          color: var(--primary);
          background: linear-gradient(transparent 70%, rgba(26, 107, 82, 0.15) 70%);
        }
        .cta-section-text {
          font-size: 15px;
          color: var(--text-sub);
          margin-bottom: 28px;
        }

        /* Form */
        .form-wrap {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 36px 28px;
          max-width: 500px;
          margin: 0 auto;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        }
        .form-campaign {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          border-radius: 12px;
          padding: 16px 20px;
          text-align: center;
          color: var(--white);
          font-size: 14px;
          margin-bottom: 32px;
        }
        .form-campaign-em {
          color: var(--accent);
          font-weight: 700;
        }
        .form-group {
          margin-bottom: 22px;
        }
        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .form-req {
          color: #dc3545;
          margin-left: 4px;
        }
        .form-input {
          width: 100%;
          padding: 16px 18px;
          border: 2px solid var(--border);
          border-radius: 12px;
          font-size: 16px;
          font-family: inherit;
          background: var(--bg);
          color: var(--text);
          transition: all 0.3s;
        }
        .form-input:focus {
          outline: none;
          border-color: var(--primary);
          background: var(--white);
          box-shadow: 0 0 0 4px rgba(26, 107, 82, 0.1);
        }
        .form-input::placeholder {
          color: #999;
        }
        .form-textarea {
          min-height: 120px;
          resize: vertical;
        }
        .form-btn {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: var(--white);
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 16px rgba(26, 107, 82, 0.3);
        }
        .form-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(26, 107, 82, 0.4);
        }
        .form-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .form-success {
          text-align: center;
          padding: 48px 24px;
        }
        .form-success-icon {
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, #e8f5f0, #d8efe7);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          font-size: 32px;
          color: var(--primary);
        }
        .form-success-title {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 10px;
        }
        .form-success-text {
          font-size: 14px;
          color: var(--text-sub);
          line-height: 1.8;
        }

        /* Footer */
        .footer {
          background: var(--white);
          border-top: 1px solid var(--border);
          padding: 48px 20px;
          text-align: center;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .footer-info {
          font-size: 13px;
          color: var(--text-sub);
          margin-bottom: 10px;
        }
        .footer-copy {
          font-size: 12px;
          color: #999;
        }

        /* Desktop */
        @media (min-width: 768px) {
          .hero {
            padding: 130px 20px 80px;
          }
          .stats {
            max-width: 450px;
          }
          .cta-wrap {
            flex-direction: row;
            justify-content: center;
          }
          .section {
            padding: 96px 20px;
          }
          .features {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
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
          .form-wrap {
            padding: 48px;
          }
        }
      `}</style>

      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-icon">礼</div>
            <span className="logo-text">Rei</span>
          </div>
          <a href="#contact" className="header-btn">お問い合わせ</a>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-catch">「他社より安くできます」ではなく</p>
          <h1 className="hero-title">
            <span className="hero-title-em">「お客様の負担を減らせます」</span>という提案ができる仕組み
          </h1>
          <p className="hero-sub">
            遠方の方から献杯（支援金）を集めて葬儀費用の負担を軽減。見積もり競争で選ばれる葬儀社へ。
          </p>

          <span className="hero-badge">🎁 先着10社限定キャンペーン中</span>

          {/* What Box */}
          <div className="what-box">
            <p className="what-label">Reiとは？</p>
            <p className="what-title">
              参列できない方からオンラインで献杯を集めるシステムです
            </p>
            <div className="what-points">
              <div className="what-point">
                <span className="what-check">✓</span>
                <span>LINEで共有するだけ</span>
              </div>
              <div className="what-point">
                <span className="what-check">✓</span>
                <span>葬儀費用に充当可能</span>
              </div>
              <div className="what-point">
                <span className="what-check">✓</span>
                <span>現場の負担ゼロ</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="stats">
            <div className="stat">
              <div className="stat-value">約9割</div>
              <div className="stat-label">ご遺族に届く</div>
            </div>
            <div className="stat">
              <div className="stat-value">0円</div>
              <div className="stat-label">月額費用</div>
            </div>
            <div className="stat">
              <div className="stat-value">3分</div>
              <div className="stat-label">ページ作成</div>
            </div>
          </div>

          {/* CTA */}
          <div className="cta-wrap">
            <a href="#contact" className="cta-main">資料請求・お問い合わせ →</a>
            <a href="#pricing" className="cta-sub">料金を見る</a>
          </div>

          {/* Nav Links */}
          <div className="nav-links">
            <button className="nav-link" onClick={() => scrollTo('flow')}>
              <span className="nav-link-icon">📋</span>使い方
            </button>
            <button className="nav-link" onClick={() => scrollTo('features')}>
              <span className="nav-link-icon">✨</span>特徴
            </button>
            <button className="nav-link" onClick={() => scrollTo('pricing')}>
              <span className="nav-link-icon">💰</span>料金
            </button>
            <button className="nav-link" onClick={() => scrollTo('fee')}>
              <span className="nav-link-icon">📊</span>手数料
            </button>
          </div>
        </div>
      </section>

      {/* Campaign */}
      <section className="campaign">
        <div className="campaign-inner">
          <span className="campaign-badge">期間限定</span>
          <h2 className="campaign-title">
            先着10社限定で手数料8%を半年間貴社に還元
          </h2>
          <p className="campaign-text">
            10万円の献杯で8,000円、50万円なら40,000円が葬儀社様の収益に
          </p>
          <a href="#contact" className="campaign-btn">キャンペーンに申し込む →</a>
        </div>
      </section>

      {/* Flow */}
      <section className="section section-alt" id="flow">
        <div className="section-inner">
          <div className="section-head">
            <p className="section-label">HOW IT WORKS</p>
            <h2 className="section-title">使い方はシンプル</h2>
            <p className="section-desc">
              難しい操作は一切ありません。リンクを共有するだけで献杯が集まります。
            </p>
          </div>
          <div className="flow-list">
            <div className="flow-item">
              <div className="flow-num">1</div>
              <div className="flow-content">
                <p className="flow-title">献杯ページを作成</p>
                <p className="flow-text">
                  故人のお名前・写真・メッセージを入力。<span className="flow-em">約3分で完了</span>します。
                </p>
              </div>
            </div>
            <div className="flow-item">
              <div className="flow-num">2</div>
              <div className="flow-content">
                <p className="flow-title">リンクを遺族にお伝え</p>
                <p className="flow-text">
                  ページのURLを遺族にお渡し。QRコードも自動生成されます。
                </p>
              </div>
            </div>
            <div className="flow-item">
              <div className="flow-num">3</div>
              <div className="flow-content">
                <p className="flow-title">遺族がLINEで共有</p>
                <p className="flow-text">
                  遺族がリンクを親族・知人に送信。<span className="flow-em">葬儀社様の作業は完了</span>です。
                </p>
              </div>
            </div>
            <div className="flow-item">
              <div className="flow-num">4</div>
              <div className="flow-content">
                <p className="flow-title">遠方の方がスマホで送金</p>
                <p className="flow-text">
                  参列できない方がスマホから献杯（支援金）を送ります。
                </p>
              </div>
            </div>
            <div className="flow-item flow-highlight">
              <div className="flow-num">5</div>
              <div className="flow-content">
                <p className="flow-title">葬儀費用に充当</p>
                <p className="flow-text">
                  <span className="flow-em">集まった献杯は葬儀費用に充当可能。</span>「実質10万円引き」の提案ができます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" id="features">
        <div className="section-inner">
          <div className="section-head">
            <p className="section-label">FEATURES</p>
            <h2 className="section-title">選ばれる3つの理由</h2>
            <p className="section-desc">
              他社サービスとは異なる、Reiならではの強みをご紹介します。
            </p>
          </div>
          <div className="features">
            <div className="feature">
              <div className="feature-head">
                <span className="feature-num">01</span>
                <h3 className="feature-title">現場の負担ゼロ</h3>
              </div>
              <p className="feature-text">
                映像配信や複雑な操作は不要。リンクを1つお伝えするだけです。
              </p>
              <ul className="feature-list">
                <li>アプリのインストール不要</li>
                <li>スタッフ研修不要</li>
                <li>当日のオペ変更なし</li>
              </ul>
            </div>
            <div className="feature">
              <div className="feature-head">
                <span className="feature-num">02</span>
                <h3 className="feature-title">物ではなくお金</h3>
              </div>
              <p className="feature-text">
                返礼品を送る物販型と違い、集まったお金を葬儀費用に充当できます。
              </p>
              <ul className="feature-list">
                <li>返礼品の手配・発送不要</li>
                <li>在庫リスクなし</li>
                <li>遺族の負担を直接軽減</li>
              </ul>
            </div>
            <div className="feature">
              <div className="feature-head">
                <span className="feature-num">03</span>
                <h3 className="feature-title">安心の直接入金</h3>
              </div>
              <p className="feature-text">
                弊社はお金を預かりません。貴社の口座に直接入金されます。
              </p>
              <ul className="feature-list">
                <li>運営会社の倒産リスクなし</li>
                <li>入金遅延の心配なし</li>
                <li>法的にも安心な仕組み</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section section-alt" id="pricing">
        <div className="section-inner">
          <div className="section-head">
            <p className="section-label">PRICING</p>
            <h2 className="section-title">料金体系</h2>
            <p className="section-desc">
              初期導入費用のみで、月額費用は一切かかりません。
            </p>
          </div>
          <div className="pricing-cards">
            <div className="pricing-card">
              <p className="pricing-label">初期導入費用</p>
              <p className="pricing-value">500<span className="pricing-unit">万円</span></p>
              <p className="pricing-note">（税別）</p>
            </div>
            <div className="pricing-card pricing-card-main">
              <p className="pricing-label">月額費用</p>
              <p className="pricing-value">0<span className="pricing-unit">円</span></p>
              <p className="pricing-note">完全無料</p>
            </div>
          </div>
          <div className="subsidy">
            <h3 className="subsidy-title">🎉 IT導入補助金で最大75%OFF</h3>
            <div className="subsidy-grid">
              <div className="subsidy-item">
                <p className="subsidy-item-label">補助率 50%の場合</p>
                <p className="subsidy-item-value">250万円</p>
              </div>
              <div className="subsidy-item">
                <p className="subsidy-item-label">補助率 75%の場合</p>
                <p className="subsidy-item-value">125万円</p>
              </div>
            </div>
            <p className="subsidy-note">
              ※採択率 約70〜80%　※申請サポートも弊社で対応可能です
            </p>
          </div>
        </div>
      </section>

      {/* Fee */}
      <section className="section" id="fee">
        <div className="section-inner">
          <div className="section-head">
            <p className="section-label">FEE</p>
            <h2 className="section-title">献杯手数料</h2>
            <p className="section-desc">
              月額費用0円の成果報酬型。献杯があったときだけ手数料が発生します。
            </p>
          </div>
          <div className="fee-main">
            <p className="fee-main-title">献杯金額の約9割がご遺族に届きます</p>
            <p className="fee-main-sub">成果報酬型だからリスクなく導入できます</p>
          </div>
          <div className="fee-grid">
            <div className="fee-item">
              <p className="fee-item-label">献杯 5万円</p>
              <p className="fee-item-value">約44,200円</p>
            </div>
            <div className="fee-item">
              <p className="fee-item-label">献杯 10万円</p>
              <p className="fee-item-value">約88,400円</p>
            </div>
            <div className="fee-item">
              <p className="fee-item-label">献杯 30万円</p>
              <p className="fee-item-value">約265,200円</p>
            </div>
            <div className="fee-item">
              <p className="fee-item-label">献杯 50万円</p>
              <p className="fee-item-value">約442,000円</p>
            </div>
          </div>
          <div className="fee-breakdown">
            <div className="fee-breakdown-row">
              <div className="fee-breakdown-item">
                <span className="fee-dot" />
                <span>決済手数料（Stripe）：3.6%</span>
              </div>
              <div className="fee-breakdown-item">
                <span className="fee-dot" />
                <span>システム利用料：8%</span>
              </div>
              <div className="fee-breakdown-item">
                <span>合計：11.6%</span>
              </div>
            </div>
            <p className="fee-breakdown-text">
              ※Stripeは世界最大級の決済プラットフォームです。セキュリティも安心。
            </p>
          </div>
        </div>
      </section>

      {/* Compare */}
      <section className="section section-alt">
        <div className="section-inner">
          <div className="section-head">
            <p className="section-label">COMPARISON</p>
            <h2 className="section-title">Reiがなければ、0円です</h2>
            <p className="section-desc">
              遠方の方がお気持ちを届ける手段がなければ、支援金は0円のままです。
            </p>
          </div>
          <div className="compare">
            <p className="compare-label">10万円の献杯があった場合の比較</p>
            <div className="compare-row">
              <div className="compare-item">
                <p className="compare-item-label">Reiなし</p>
                <p className="compare-item-value compare-red">0円</p>
              </div>
              <span className="compare-vs">vs</span>
              <div className="compare-item">
                <p className="compare-item-label">Reiあり</p>
                <p className="compare-item-value compare-green">88,400円</p>
              </div>
            </div>
            <p className="compare-msg">
              <strong>0円</strong>と<strong>88,400円</strong>、どちらがご遺族のためになりますか？
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="section-inner">
          <h2 className="cta-section-title">
            価格競争から<span className="cta-section-em">価値競争</span>へ
          </h2>
          <p className="cta-section-text">
            Reiで、選ばれる葬儀社になりませんか？
          </p>
          <a href="#contact" className="cta-main">資料請求・お問い合わせ →</a>
        </div>
      </section>

      {/* Form */}
      <section className="section section-alt" id="contact">
        <div className="section-inner">
          <div className="section-head">
            <p className="section-label">CONTACT</p>
            <h2 className="section-title">お問い合わせ</h2>
            <p className="section-desc">
              資料請求・デモのご依頼・ご質問など、お気軽にお問い合わせください。
            </p>
          </div>
          <div className="form-wrap">
            <div className="form-campaign">
              🎁 今なら<span className="form-campaign-em">先着10社限定</span>で手数料8%が<span className="form-campaign-em">半年間貴社の収益に</span>
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
                  <label className="form-label">葬儀社名<span className="form-req">*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="例：〇〇葬儀社"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">お名前<span className="form-req">*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="例：山田 太郎"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">メールアドレス<span className="form-req">*</span></label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="例：info@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">お問い合わせ内容</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="資料請求、デモのご依頼、ご質問など"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>
                <button type="submit" className="form-btn" disabled={submitting}>
                  {submitting ? '送信中...' : '送信する'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-logo">
          <div className="logo-icon">礼</div>
          <span className="logo-text">Rei</span>
        </div>
        <p className="footer-info">株式会社SHIKAKERU　代表取締役 中川 航輝</p>
        <p className="footer-copy">© 2025 SHIKAKERU Inc.</p>
      </footer>
    </div>
  );
}
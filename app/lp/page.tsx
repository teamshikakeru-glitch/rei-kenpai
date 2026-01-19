'use client';

import { useState, useEffect, useLayoutEffect } from 'react';

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

  // ページ読み込み時に一番上にスクロール（レンダリング前に実行）
  useLayoutEffect(() => {
    // ブラウザの履歴によるスクロール復元を無効化
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    // 即座にスクロールをリセット
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // 追加の保険としてuseEffectでも実行
  useEffect(() => {
    // 複数回リセットを試行（ブラウザの復元処理対策）
    window.scrollTo(0, 0);
    const timers = [
      setTimeout(() => window.scrollTo(0, 0), 0),
      setTimeout(() => window.scrollTo(0, 0), 10),
      setTimeout(() => window.scrollTo(0, 0), 50),
      setTimeout(() => window.scrollTo(0, 0), 100),
      setTimeout(() => window.scrollTo(0, 0), 200),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

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
          word-break: break-word;
          overflow-wrap: break-word;
          overflow-x: hidden;
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
          min-height: 100vh;
          min-height: 100dvh;
          padding: 80px 20px 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: linear-gradient(165deg, #0d3d2d 0%, #1a6b52 50%, #238c6a 100%);
        }
        .hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .hero-bg-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.03);
        }
        .hero-bg-circle-1 {
          width: 600px;
          height: 600px;
          top: -200px;
          right: -200px;
          animation: float 20s ease-in-out infinite;
        }
        .hero-bg-circle-2 {
          width: 400px;
          height: 400px;
          bottom: -100px;
          left: -100px;
          animation: float 15s ease-in-out infinite reverse;
        }
        .hero-bg-circle-3 {
          width: 300px;
          height: 300px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: float 25s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.05); }
        }
        .hero-inner {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 1;
        }
        .hero-main {
          margin-bottom: 40px;
        }
        .hero-top-label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.3em;
          color: rgba(255,255,255,0.6);
          margin-bottom: 12px;
        }
        .hero-top-catch {
          font-size: clamp(24px, 6vw, 40px);
          font-weight: 800;
          color: var(--white);
          line-height: 1.3;
          margin-bottom: 20px;
          text-shadow: 0 2px 20px rgba(0,0,0,0.2);
        }
        .hero-divider {
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, var(--accent), rgba(232, 168, 48, 0.3));
          margin: 0 auto 24px;
          border-radius: 2px;
        }
        .hero-catch {
          display: inline-block;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(4px);
          padding: 8px 20px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.9);
          margin-bottom: 20px;
          letter-spacing: 0.05em;
        }
        .hero-title {
          color: var(--white);
          margin-bottom: 24px;
        }
        .hero-title-line {
          display: block;
          font-size: clamp(16px, 4vw, 22px);
          font-weight: 500;
          opacity: 0.9;
          margin-bottom: 8px;
        }
        .hero-title-big {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 4px;
          margin: 16px 0;
        }
        .hero-title-em {
          font-size: clamp(24px, 6vw, 36px);
          font-weight: 700;
        }
        .hero-title-number {
          font-size: clamp(72px, 18vw, 120px);
          font-weight: 800;
          line-height: 1;
          background: linear-gradient(135deg, #fff 0%, #ffd700 50%, #fff 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shine 3s ease-in-out infinite;
          text-shadow: 0 4px 30px rgba(255,215,0,0.3);
        }
        @keyframes shine {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .hero-desc {
          font-size: 14px;
          color: rgba(255,255,255,0.8);
          line-height: 1.8;
        }
        .sp-only { display: inline; }

        .hero-stats {
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr;
          align-items: center;
          justify-items: center;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(8px);
          border-radius: 14px;
          padding: 16px 12px;
          margin-bottom: 28px;
          border: 1px solid rgba(255,255,255,0.15);
          max-width: 340px;
          margin-left: auto;
          margin-right: auto;
        }
        .hero-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .hero-stat-value {
          font-size: clamp(20px, 5vw, 28px);
          font-weight: 700;
          color: var(--white);
          line-height: 1.2;
        }
        .hero-stat-label {
          font-size: 10px;
          color: rgba(255,255,255,0.7);
          margin-top: 2px;
        }
        .hero-stat-divider {
          width: 1px;
          height: 32px;
          background: rgba(255,255,255,0.2);
        }

        .hero-cta {
          margin-bottom: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .hero-cta-main {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: var(--white);
          color: var(--primary);
          padding: 16px 36px;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        }
        .hero-cta-main:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 12px 40px rgba(0,0,0,0.3);
        }
        .hero-cta-arrow {
          font-size: 18px;
          transition: transform 0.3s;
        }
        .hero-cta-main:hover .hero-cta-arrow {
          transform: translateX(4px);
        }
        .hero-cta-note {
          margin-top: 12px;
          font-size: 12px;
          color: var(--white);
          background: linear-gradient(135deg, rgba(220, 53, 69, 0.9), rgba(180, 40, 50, 0.9));
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 600;
          text-align: center;
          animation: pulse 2s ease-in-out infinite;
        }

        .hero-scroll {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.6);
          font-size: 12px;
          animation: bounce 2s ease-in-out infinite;
        }
        .hero-scroll-icon {
          font-size: 16px;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }

        /* Campaign */
        .campaign {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
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
          background: 
            radial-gradient(circle at 20% 50%, rgba(232, 168, 48, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(232, 168, 48, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }
        .campaign-inner {
          max-width: 600px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .campaign-badge-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .campaign-badge {
          background: linear-gradient(135deg, var(--accent), #d4922a);
          padding: 8px 20px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .campaign-badge-sub {
          background: rgba(220, 53, 69, 0.9);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .campaign-title {
          margin-bottom: 24px;
        }
        .campaign-title-small {
          display: block;
          font-size: 16px;
          font-weight: 500;
          opacity: 0.8;
          margin-bottom: 8px;
        }
        .campaign-title-big {
          display: block;
          font-size: clamp(28px, 7vw, 42px);
          font-weight: 800;
          line-height: 1.3;
        }
        .campaign-highlight {
          color: var(--accent);
          font-size: 1.2em;
        }
        .campaign-benefit {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
        }
        .campaign-benefit-label {
          font-size: 16px;
          opacity: 0.9;
          margin-bottom: 8px;
        }
        .campaign-benefit-value {
          font-size: clamp(22px, 5vw, 30px);
          font-weight: 700;
        }
        .campaign-example {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-bottom: 16px;
        }
        .campaign-example-item {
          background: rgba(232, 168, 48, 0.15);
          border: 1px solid rgba(232, 168, 48, 0.3);
          border-radius: 10px;
          padding: 12px 8px;
          text-align: center;
        }
        .campaign-example-label {
          display: block;
          font-size: 10px;
          opacity: 0.8;
          margin-bottom: 4px;
        }
        .campaign-example-value {
          display: block;
          font-size: 20px;
          font-weight: 700;
          color: var(--accent);
        }
        .campaign-note {
          font-size: 11px;
          opacity: 0.7;
          margin-bottom: 20px;
          line-height: 1.6;
        }
        .campaign-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, var(--accent), #d4922a);
          color: #1a1a1a;
          padding: 16px 32px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s;
          box-shadow: 0 4px 20px rgba(232, 168, 48, 0.4);
        }
        .campaign-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(232, 168, 48, 0.5);
        }
        .campaign-btn-arrow {
          font-size: 20px;
          transition: transform 0.3s;
        }
        .campaign-btn:hover .campaign-btn-arrow {
          transform: translateX(4px);
        }

        /* Easy Start */
        .easy-start {
          background: linear-gradient(180deg, var(--bg) 0%, var(--bg-alt) 100%);
          padding: 64px 20px;
          text-align: center;
          overflow: hidden;
        }
        .easy-start-inner {
          max-width: 700px;
          margin: 0 auto;
        }
        .easy-start-badge {
          display: inline-block;
          background: var(--primary);
          color: var(--white);
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 16px;
          letter-spacing: 0.1em;
        }
        .easy-start-title {
          font-size: clamp(20px, 5vw, 30px);
          font-weight: 700;
          line-height: 1.5;
          margin-bottom: 32px;
        }
        .easy-start-em {
          color: var(--primary);
          background: linear-gradient(transparent 70%, rgba(26, 107, 82, 0.15) 70%);
        }
        .easy-start-points {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }
        .easy-start-point {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 14px;
          text-align: left;
          overflow: hidden;
        }
        .easy-start-point:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
        .easy-start-icon {
          font-size: 24px;
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #e6f2ee, #d4ebe3);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .easy-start-point-content {
          flex: 1;
          min-width: 0;
          overflow: hidden;
        }
        .easy-start-point-title {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 2px;
          color: var(--text);
        }
        .easy-start-point-text {
          font-size: 12px;
          color: var(--text-sub);
          line-height: 1.5;
          word-break: break-word;
        }
        .easy-start-note {
          font-size: 12px;
          color: var(--primary);
          font-weight: 600;
          background: linear-gradient(135deg, #e6f2ee, #d4ebe3);
          display: inline-block;
          padding: 10px 20px;
          border-radius: 100px;
        }

        /* Section */
        .section {
          padding: 64px 20px;
          overflow: hidden;
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
          gap: 12px;
          max-width: 600px;
          margin: 0 auto;
        }
        .flow-item {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 20px 16px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          transition: all 0.3s;
          overflow: hidden;
        }
        .flow-item:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
          transform: translateY(-2px);
        }
        .flow-num {
          width: 36px;
          height: 36px;
          min-width: 36px;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          border-radius: 10px;
          color: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          font-weight: 700;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(26, 107, 82, 0.25);
        }
        .flow-content {
          flex: 1;
          min-width: 0;
          overflow: hidden;
        }
        .flow-title {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 4px;
          word-break: break-word;
        }
        .flow-text {
          font-size: 13px;
          color: var(--text-sub);
          line-height: 1.6;
          word-break: break-word;
          overflow-wrap: break-word;
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
          gap: 16px;
          max-width: 900px;
          margin: 0 auto;
        }
        .feature {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
          text-align: center;
          overflow: hidden;
        }
        .feature:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          transform: translateY(-4px);
        }
        .feature-head {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .feature-num {
          font-size: 11px;
          font-weight: 700;
          color: var(--white);
          background: var(--primary);
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .feature-title {
          font-size: 17px;
          font-weight: 700;
        }
        .feature-text {
          font-size: 13px;
          color: var(--text-sub);
          line-height: 1.7;
          margin-bottom: 16px;
          word-break: break-word;
        }
        .feature-list {
          margin-top: auto;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .feature-list li {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 13px;
          color: var(--text);
        }
        .feature-list li::before {
          content: '✓';
          color: var(--primary);
          font-weight: 700;
          font-size: 14px;
        }

        /* Pricing */
        .pricing-cards {
          display: grid;
          grid-template-columns: 1fr;
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
          display: flex;
          flex-direction: column;
          justify-content: center;
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
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 90px;
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
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 100px;
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
          padding: 20px 16px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .fee-breakdown-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          font-size: 11px;
        }
        .fee-breakdown-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 6px 10px;
          background: var(--bg-alt);
          border-radius: 6px;
          white-space: nowrap;
        }
        .fee-dot {
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
        }
        .fee-breakdown-text {
          margin-top: 12px;
          font-size: 11px;
          color: var(--text-sub);
          line-height: 1.6;
        }

        /* Compare */
        .compare {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 28px 20px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          max-width: 320px;
          margin: 0 auto;
        }
        .compare-label {
          font-size: 13px;
          color: var(--text-sub);
          margin-bottom: 20px;
        }
        .compare-items {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }
        .compare-item {
          text-align: center;
          padding: 16px;
          border-radius: 12px;
          background: var(--bg-alt);
        }
        .compare-item-highlight {
          background: linear-gradient(135deg, #e6f5f0, #d4ede5);
          border: 2px solid var(--primary);
        }
        .compare-item-label {
          font-size: 12px;
          color: var(--text-sub);
          margin-bottom: 6px;
        }
        .compare-item-value {
          font-size: 32px;
          font-weight: 700;
          line-height: 1.2;
        }
        .compare-arrow {
          font-size: 20px;
          color: var(--primary);
          font-weight: 700;
        }
        .compare-red { 
          color: #dc3545; 
        }
        .compare-green { 
          color: var(--primary); 
        }
        .compare-msg {
          font-size: 13px;
          line-height: 1.6;
          color: var(--text-sub);
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
          background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          color: var(--white);
          font-size: 14px;
          margin-bottom: 32px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-campaign-badge {
          display: inline-block;
          background: linear-gradient(135deg, rgba(220, 53, 69, 0.9), rgba(180, 40, 50, 0.9));
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          animation: pulse 2s ease-in-out infinite;
        }
        .form-campaign-text {
          font-size: 14px;
          line-height: 1.6;
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
          padding: 40px 20px 80px;
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

        /* Fixed Navigation */
        .fixed-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 99;
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(0,0,0,0.08);
          padding: 6px 12px;
          padding-bottom: calc(6px + env(safe-area-inset-bottom));
          box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
        }
        .fixed-nav-inner {
          max-width: 360px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 2px;
        }
        .fixed-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 6px 2px;
          border-radius: 8px;
          font-size: 9px;
          font-weight: 600;
          color: var(--text-sub);
          text-decoration: none;
          transition: all 0.2s;
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: inherit;
          text-align: center;
        }
        .fixed-nav-item:hover,
        .fixed-nav-item:active {
          background: var(--bg-alt);
          color: var(--primary);
        }
        .fixed-nav-icon {
          font-size: 16px;
          margin-bottom: 2px;
        }
        .fixed-nav-item-cta {
          background: var(--primary);
          color: var(--white);
        }
        .fixed-nav-item-cta:hover,
        .fixed-nav-item-cta:active {
          background: var(--primary-dark);
          color: var(--white);
        }

        /* Desktop */
        @media (min-width: 768px) {
          .hero {
            padding: 100px 20px 60px;
          }
          .hero-title-number {
            font-size: 140px;
          }
          .hero-stats {
            max-width: 420px;
            padding: 20px 24px;
          }
          .sp-only {
            display: none;
          }
          .easy-start-points {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }
          .easy-start-point {
            flex-direction: column;
            text-align: center;
            padding: 28px 16px;
          }
          .easy-start-icon {
            width: 56px;
            height: 56px;
            font-size: 24px;
            margin-bottom: 8px;
          }
          .section {
            padding: 96px 20px;
          }
          .features {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }
          .feature {
            min-height: 280px;
          }
          .pricing-cards {
            grid-template-columns: repeat(2, 1fr);
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
      <header className="header" id="top">
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
        <div className="hero-bg">
          <div className="hero-bg-circle hero-bg-circle-1" />
          <div className="hero-bg-circle hero-bg-circle-2" />
          <div className="hero-bg-circle hero-bg-circle-3" />
        </div>
        <div className="hero-inner">
          <div className="hero-main">
            <p className="hero-top-label">SMART KENPAI</p>
            <h2 className="hero-top-catch">見積競争に勝ち抜くための新提案</h2>
            <div className="hero-divider" />
            <p className="hero-catch">他社の見積もりに勝つ、新しい武器</p>
            <h1 className="hero-title">
              <span className="hero-title-line">遠方の献杯を集めて</span>
              <span className="hero-title-big">
                <span className="hero-title-em">実質</span>
                <span className="hero-title-number">10</span>
                <span className="hero-title-em">万円引き</span>
              </span>
              <span className="hero-title-line">という提案ができる</span>
            </h1>
            <p className="hero-desc">
              参列できない方から献杯（支援金）を集め、<br className="sp-only" />
              葬儀費用の負担を軽減するシステム
            </p>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">約9割</span>
              <span className="hero-stat-label">ご遺族に届く</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">0円</span>
              <span className="hero-stat-label">月額費用</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">3分</span>
              <span className="hero-stat-label">で作成完了</span>
            </div>
          </div>

          <div className="hero-cta">
            <a href="#contact" className="hero-cta-main">
              <span>無料で資料請求</span>
              <span className="hero-cta-arrow">→</span>
            </a>
            <p className="hero-cta-note">🔥 先着10社限定：手数料8%を半年間還元</p>
          </div>

          <div className="hero-scroll">
            <span>詳しく見る</span>
            <span className="hero-scroll-icon">↓</span>
          </div>
        </div>
      </section>

      {/* Campaign */}
      <section className="campaign">
        <div className="campaign-inner">
          <div className="campaign-badge-wrap">
            <span className="campaign-badge">🎁 期間限定キャンペーン</span>
            <span className="campaign-badge-sub">残り枠わずか</span>
          </div>
          <h2 className="campaign-title">
            <span className="campaign-title-small">今だけ</span>
            <span className="campaign-title-big">先着<span className="campaign-highlight">10</span>社限定</span>
          </h2>
          <div className="campaign-benefit">
            <p className="campaign-benefit-label">手数料8%が</p>
            <p className="campaign-benefit-value">半年間<span className="campaign-highlight">貴社の収益</span>に</p>
          </div>
          <div className="campaign-example">
            <div className="campaign-example-item">
              <span className="campaign-example-label">献杯10万円の場合</span>
              <span className="campaign-example-value">+8,000円</span>
            </div>
            <div className="campaign-example-item">
              <span className="campaign-example-label">献杯50万円の場合</span>
              <span className="campaign-example-value">+40,000円</span>
            </div>
          </div>
          <p className="campaign-note">※通常は弊社へのシステム利用料となる8%が、<br className="sp-only" />キャンペーン期間中は全額貴社の収益になります</p>
          <a href="#contact" className="campaign-btn">
            <span>今すぐ枠を確保する</span>
            <span className="campaign-btn-arrow">→</span>
          </a>
        </div>
      </section>

      {/* Easy Start */}
      <section className="easy-start">
        <div className="easy-start-inner">
          <div className="easy-start-badge">かんたん導入</div>
          <h2 className="easy-start-title">
            専用リンクをお送りするだけ<br />
            <span className="easy-start-em">最短即日</span>で導入完了
          </h2>
          <div className="easy-start-points">
            <div className="easy-start-point">
              <div className="easy-start-icon">📱</div>
              <div className="easy-start-point-content">
                <p className="easy-start-point-title">スマホだけでOK</p>
                <p className="easy-start-point-text">PC不要。スマホで全て完結</p>
              </div>
            </div>
            <div className="easy-start-point">
              <div className="easy-start-icon">👥</div>
              <div className="easy-start-point-content">
                <p className="easy-start-point-title">従業員様も利用可能</p>
                <p className="easy-start-point-text">各スタッフのスマホに導入OK</p>
              </div>
            </div>
            <div className="easy-start-point">
              <div className="easy-start-icon">🔗</div>
              <div className="easy-start-point-content">
                <p className="easy-start-point-title">リンク1つで開始</p>
                <p className="easy-start-point-text">弊社から専用リンクをお送りするだけ</p>
              </div>
            </div>
          </div>
          <p className="easy-start-note">✓ インストール不要 ✓ 初期設定不要 ✓ 研修不要</p>
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
                <p className="flow-text">故人名・写真・メッセージを入力。<span className="flow-em">約3分</span>で完了</p>
              </div>
            </div>
            <div className="flow-item">
              <div className="flow-num">2</div>
              <div className="flow-content">
                <p className="flow-title">リンクを遺族にお伝え</p>
                <p className="flow-text">URLをお渡し。QRコードも自動生成</p>
              </div>
            </div>
            <div className="flow-item">
              <div className="flow-num">3</div>
              <div className="flow-content">
                <p className="flow-title">遺族がLINEで共有</p>
                <p className="flow-text">親族・知人に送信。<span className="flow-em">葬儀社様の作業完了</span></p>
              </div>
            </div>
            <div className="flow-item">
              <div className="flow-num">4</div>
              <div className="flow-content">
                <p className="flow-title">遠方の方がスマホで送金</p>
                <p className="flow-text">参列できない方がスマホから献杯を送ります</p>
              </div>
            </div>
            <div className="flow-item flow-highlight">
              <div className="flow-num">5</div>
              <div className="flow-content">
                <p className="flow-title">葬儀費用に充当</p>
                <p className="flow-text"><span className="flow-em">集まった献杯は葬儀費用に充当可能</span></p>
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
              <p className="feature-text">映像配信や複雑な操作は不要。リンクを1つお伝えするだけ</p>
              <ul className="feature-list">
                <li>アプリ不要</li>
                <li>スタッフ研修不要</li>
                <li>当日のオペ変更なし</li>
              </ul>
            </div>
            <div className="feature">
              <div className="feature-head">
                <span className="feature-num">02</span>
                <h3 className="feature-title">物ではなくお金</h3>
              </div>
              <p className="feature-text">返礼品を送る物販型と違い、集まったお金を葬儀費用に充当</p>
              <ul className="feature-list">
                <li>返礼品の手配不要</li>
                <li>在庫リスクなし</li>
                <li>遺族の負担を軽減</li>
              </ul>
            </div>
            <div className="feature">
              <div className="feature-head">
                <span className="feature-num">03</span>
                <h3 className="feature-title">安心の直接入金</h3>
              </div>
              <p className="feature-text">弊社はお金を預かりません。貴社の口座に直接入金</p>
              <ul className="feature-list">
                <li>倒産リスクなし</li>
                <li>入金遅延の心配なし</li>
                <li>法的にも安心</li>
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
              ※Stripeは世界最大級の決済基盤。セキュリティも安心
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
              遠方の方がお気持ちを届ける手段がなければ、0円のままです
            </p>
          </div>
          <div className="compare">
            <p className="compare-label">10万円の献杯があった場合</p>
            <div className="compare-items">
              <div className="compare-item">
                <p className="compare-item-label">Reiなし</p>
                <p className="compare-item-value compare-red">0円</p>
              </div>
              <div className="compare-arrow">↓</div>
              <div className="compare-item compare-item-highlight">
                <p className="compare-item-label">Reiあり</p>
                <p className="compare-item-value compare-green">88,400円</p>
              </div>
            </div>
            <p className="compare-msg">
              どちらがご遺族のためになりますか？
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
              <span className="form-campaign-badge">🔥 残り枠わずか</span>
              <span className="form-campaign-text">先着<span className="form-campaign-em">10社限定</span>で手数料8%を<span className="form-campaign-em">半年間還元</span></span>
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

      {/* Fixed Navigation */}
      <nav className="fixed-nav">
        <div className="fixed-nav-inner">
          <button className="fixed-nav-item" onClick={() => scrollTo('flow')}>
            <span className="fixed-nav-icon">📋</span>
            <span>使い方</span>
          </button>
          <button className="fixed-nav-item" onClick={() => scrollTo('features')}>
            <span className="fixed-nav-icon">✨</span>
            <span>特徴</span>
          </button>
          <button className="fixed-nav-item" onClick={() => scrollTo('pricing')}>
            <span className="fixed-nav-icon">💰</span>
            <span>料金</span>
          </button>
          <button className="fixed-nav-item" onClick={() => scrollTo('fee')}>
            <span className="fixed-nav-icon">📊</span>
            <span>手数料</span>
          </button>
          <button className="fixed-nav-item fixed-nav-item-cta" onClick={() => scrollTo('contact')}>
            <span className="fixed-nav-icon">✉️</span>
            <span>問合せ</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
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

  return (
    <div className="lp-page">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');
      `}</style>
      
      <style jsx>{`
        .lp-page {
          --color-primary: #1a5f4a;
          --color-primary-light: #2d8a6e;
          --color-primary-dark: #0f3d2f;
          --color-accent: #c4a052;
          --color-accent-light: #d4b86a;
          --color-bg: #fafaf8;
          --color-bg-warm: #f5f3ef;
          --color-text: #2d3436;
          --color-text-light: #636e72;
          --color-white: #ffffff;
          --color-border: #e8e6e1;
          
          --font-display: 'Noto Serif JP', serif;
          --font-body: 'Outfit', sans-serif;
          
          --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
          --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
          
          min-height: 100vh;
          background: var(--color-bg);
          color: var(--color-text);
          font-family: var(--font-body);
          font-weight: 400;
          line-height: 1.7;
          overflow-x: hidden;
        }

        /* ========== Header ========== */
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 0 clamp(20px, 5vw, 60px);
          transition: all 0.5s var(--ease-out-expo);
        }
        .header.scrolled {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          box-shadow: 0 1px 0 var(--color-border);
        }
        .header-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: padding 0.5s var(--ease-out-expo);
        }
        .header.scrolled .header-inner {
          padding: 14px 0;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
        }
        .logo-mark {
          width: 44px;
          height: 44px;
          background: linear-gradient(145deg, var(--color-primary), var(--color-primary-dark));
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 600;
          color: var(--color-white);
          box-shadow: 0 4px 20px rgba(26, 95, 74, 0.25);
        }
        .logo-text {
          font-family: var(--font-display);
          font-size: 26px;
          font-weight: 600;
          color: var(--color-text);
          letter-spacing: 0.02em;
        }
        .header-cta {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--color-primary);
          color: var(--color-white);
          padding: 14px 28px;
          border-radius: 100px;
          font-weight: 500;
          font-size: 14px;
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: all 0.4s var(--ease-out-expo);
          box-shadow: 0 4px 20px rgba(26, 95, 74, 0.2);
        }
        .header-cta:hover {
          background: var(--color-primary-light);
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(26, 95, 74, 0.3);
        }
        .header-cta svg {
          width: 16px;
          height: 16px;
          transition: transform 0.3s var(--ease-out-expo);
        }
        .header-cta:hover svg {
          transform: translateX(3px);
        }

        /* ========== Campaign Banner ========== */
        .campaign-banner {
          position: fixed;
          top: 84px;
          left: 0;
          right: 0;
          z-index: 999;
          background: linear-gradient(135deg, var(--color-accent), #b8944a);
          color: var(--color-white);
          text-align: center;
          padding: 12px 24px;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.03em;
          transition: top 0.5s var(--ease-out-expo);
        }
        .header.scrolled ~ .campaign-banner {
          top: 68px;
        }
        .campaign-banner-highlight {
          font-weight: 700;
        }

        /* ========== Hero Section ========== */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          padding: 180px clamp(20px, 5vw, 60px) 100px;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background: 
            linear-gradient(180deg, rgba(250, 250, 248, 0) 0%, var(--color-bg) 100%),
            radial-gradient(ellipse 80% 50% at 70% 20%, rgba(26, 95, 74, 0.06) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 30% 80%, rgba(196, 160, 82, 0.04) 0%, transparent 70%);
        }
        .hero-pattern {
          position: absolute;
          top: 0;
          right: 0;
          width: 50%;
          height: 100%;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30L30 0z' fill='%231a5f4a' fill-opacity='1'/%3E%3C/svg%3E");
          background-size: 60px 60px;
        }
        .hero-content {
          position: relative;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }
        .hero-inner {
          max-width: 800px;
          text-align: left;
        }
        .hero-campaign-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, var(--color-accent), #b8944a);
          color: var(--color-white);
          padding: 10px 22px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          margin-bottom: 32px;
          animation: fadeInUp 0.8s var(--ease-out-expo) both;
          box-shadow: 0 4px 20px rgba(196, 160, 82, 0.3);
        }
        .hero-label {
          display: inline-block;
          font-size: 13px;
          font-weight: 500;
          color: var(--color-primary);
          letter-spacing: 0.15em;
          margin-bottom: 24px;
          padding: 8px 0;
          border-bottom: 1px solid var(--color-primary);
          animation: fadeInUp 0.8s var(--ease-out-expo) 0.1s both;
        }
        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(36px, 6vw, 64px);
          font-weight: 700;
          line-height: 1.25;
          color: var(--color-text);
          margin-bottom: 28px;
          animation: fadeInUp 0.8s var(--ease-out-expo) 0.2s both;
        }
        .hero-title-accent {
          color: var(--color-primary);
          position: relative;
        }
        .hero-title-accent::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 4px;
          width: 100%;
          height: 8px;
          background: rgba(26, 95, 74, 0.15);
          z-index: -1;
        }
        .hero-description {
          font-size: clamp(16px, 2vw, 19px);
          color: var(--color-text-light);
          line-height: 1.9;
          margin-bottom: 48px;
          max-width: 600px;
          animation: fadeInUp 0.8s var(--ease-out-expo) 0.3s both;
        }
        .hero-cta-group {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          animation: fadeInUp 0.8s var(--ease-out-expo) 0.4s both;
        }
        .hero-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--color-primary);
          color: var(--color-white);
          padding: 18px 36px;
          border-radius: 100px;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: all 0.4s var(--ease-out-expo);
          box-shadow: 0 4px 25px rgba(26, 95, 74, 0.25);
        }
        .hero-cta-primary:hover {
          background: var(--color-primary-light);
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(26, 95, 74, 0.35);
        }
        .hero-cta-primary svg {
          width: 18px;
          height: 18px;
          transition: transform 0.3s var(--ease-out-expo);
        }
        .hero-cta-primary:hover svg {
          transform: translateX(4px);
        }
        .hero-cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          color: var(--color-text);
          padding: 18px 36px;
          border-radius: 100px;
          font-weight: 500;
          font-size: 15px;
          text-decoration: none;
          letter-spacing: 0.02em;
          border: 1px solid var(--color-border);
          transition: all 0.4s var(--ease-out-expo);
        }
        .hero-cta-secondary:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ========== Section Base ========== */
        .section {
          padding: clamp(80px, 12vw, 140px) clamp(20px, 5vw, 60px);
          position: relative;
        }
        .section-inner {
          max-width: 1200px;
          margin: 0 auto;
        }
        .section-header {
          text-align: center;
          margin-bottom: clamp(48px, 8vw, 80px);
        }
        .section-label {
          display: inline-block;
          font-size: 12px;
          font-weight: 600;
          color: var(--color-primary);
          letter-spacing: 0.2em;
          margin-bottom: 20px;
          text-transform: uppercase;
        }
        .section-title {
          font-family: var(--font-display);
          font-size: clamp(26px, 3.5vw, 38px);
          font-weight: 700;
          color: var(--color-text);
          line-height: 1.5;
          margin-bottom: 20px;
        }
        .section-subtitle {
          font-size: clamp(15px, 1.8vw, 17px);
          color: var(--color-text-light);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.8;
        }

        /* ========== Campaign Section ========== */
        .campaign-section {
          background: linear-gradient(160deg, var(--color-primary-dark), var(--color-primary));
          color: var(--color-white);
          position: relative;
          overflow: hidden;
        }
        .campaign-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='1' fill='%23ffffff' fill-opacity='0.1'/%3E%3C/svg%3E");
          background-size: 30px 30px;
        }
        .campaign-section .section-inner {
          position: relative;
        }
        .campaign-section .section-label {
          color: var(--color-accent-light);
        }
        .campaign-section .section-title {
          color: var(--color-white);
          line-height: 1.6;
        }
        .campaign-highlight {
          color: var(--color-accent-light);
        }
        .campaign-section .section-subtitle {
          color: rgba(255, 255, 255, 0.85);
        }
        .campaign-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 24px;
          padding: clamp(32px, 5vw, 48px);
          max-width: 800px;
          margin: 0 auto 40px;
          text-align: left;
        }
        .campaign-card-title {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 600;
          color: var(--color-accent-light);
          margin-bottom: 16px;
        }
        .campaign-card-text {
          font-size: 16px;
          line-height: 1.9;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 32px;
        }
        .campaign-metrics {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        @media (max-width: 500px) {
          .campaign-metrics {
            grid-template-columns: 1fr;
          }
        }
        .campaign-metric {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 28px 24px;
          text-align: center;
        }
        .campaign-metric-label {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 8px;
        }
        .campaign-metric-value {
          font-family: var(--font-display);
          font-size: 32px;
          font-weight: 700;
          color: var(--color-accent-light);
        }
        .campaign-metric-note {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 4px;
        }
        .campaign-note {
          text-align: center;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 40px;
        }
        .campaign-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--color-white);
          color: var(--color-primary);
          padding: 18px 40px;
          border-radius: 100px;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: all 0.4s var(--ease-out-expo);
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
        }
        .campaign-cta:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
        }

        /* ========== Problem Section ========== */
        .problem-section {
          background: var(--color-bg-warm);
        }
        .problem-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 900px) {
          .problem-grid {
            grid-template-columns: 1fr;
          }
        }
        .problem-card {
          background: var(--color-white);
          border-radius: 20px;
          padding: clamp(32px, 4vw, 44px);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.04);
          border: 1px solid var(--color-border);
          transition: all 0.5s var(--ease-out-expo);
          text-align: left;
        }
        .problem-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
        }
        .problem-card-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, rgba(26, 95, 74, 0.1), rgba(26, 95, 74, 0.05));
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          margin-bottom: 24px;
        }
        .problem-card-title {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 600;
          color: var(--color-text);
          margin-bottom: 14px;
        }
        .problem-card-text {
          font-size: 15px;
          color: var(--color-text-light);
          line-height: 1.8;
        }

        /* ========== Solution Section ========== */
        .solution-intro {
          background: linear-gradient(135deg, rgba(26, 95, 74, 0.06), rgba(196, 160, 82, 0.04));
          border: 1px solid rgba(26, 95, 74, 0.1);
          border-radius: 24px;
          padding: clamp(40px, 6vw, 64px);
          text-align: center;
          margin-bottom: clamp(48px, 8vw, 72px);
        }
        .solution-intro-title {
          font-family: var(--font-display);
          font-size: clamp(20px, 2.5vw, 26px);
          font-weight: 600;
          color: var(--color-text);
          margin-bottom: 16px;
          line-height: 1.5;
        }
        .solution-intro-text {
          font-size: clamp(16px, 2vw, 19px);
          color: var(--color-text-light);
        }
        .solution-intro-text strong {
          color: var(--color-primary);
          font-weight: 600;
        }
        .flow-container {
          max-width: 720px;
          margin: 0 auto;
        }
        .flow-step {
          display: flex;
          align-items: flex-start;
          gap: 24px;
          padding: 28px 0;
          border-bottom: 1px solid var(--color-border);
          transition: all 0.4s var(--ease-out-expo);
        }
        .flow-step:last-child {
          border-bottom: none;
        }
        .flow-step:hover {
          transform: translateX(8px);
        }
        .flow-step-num {
          width: 48px;
          height: 48px;
          background: var(--color-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 700;
          color: var(--color-white);
          flex-shrink: 0;
        }
        .flow-step-content {
          flex: 1;
          padding-top: 6px;
        }
        .flow-step-text {
          font-size: 16px;
          color: var(--color-text);
          line-height: 1.7;
          text-align: left;
        }
        .flow-step-text strong {
          color: var(--color-primary);
          font-weight: 600;
        }
        .flow-step-highlight {
          background: linear-gradient(135deg, rgba(26, 95, 74, 0.08), rgba(26, 95, 74, 0.03));
          border-radius: 16px;
          padding: 20px 24px;
          border-bottom: none;
          margin-top: 8px;
        }
        .flow-step-highlight .flow-step-num {
          background: linear-gradient(135deg, var(--color-accent), #b8944a);
        }

        /* ========== Features Section ========== */
        .features-section {
          background: var(--color-bg-warm);
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        @media (max-width: 900px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
        .feature-card {
          background: var(--color-white);
          border-radius: 24px;
          padding: clamp(36px, 5vw, 48px) clamp(28px, 4vw, 36px);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.04);
          border: 1px solid var(--color-border);
          position: relative;
          overflow: hidden;
          transition: all 0.5s var(--ease-out-expo);
          text-align: left;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
        }
        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.1);
        }
        .feature-num {
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 600;
          color: var(--color-primary);
          letter-spacing: 0.1em;
          margin-bottom: 20px;
        }
        .feature-title {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: 16px;
          line-height: 1.4;
        }
        .feature-text {
          font-size: 15px;
          color: var(--color-text-light);
          line-height: 1.85;
        }

        /* ========== Pricing Section ========== */
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 28px;
          margin-bottom: 48px;
        }
        @media (max-width: 700px) {
          .pricing-grid {
            grid-template-columns: 1fr;
          }
        }
        .pricing-card {
          background: var(--color-white);
          border-radius: 24px;
          padding: clamp(36px, 5vw, 52px);
          text-align: center;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.04);
          border: 1px solid var(--color-border);
          transition: all 0.5s var(--ease-out-expo);
        }
        .pricing-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
        }
        .pricing-card-highlight {
          background: linear-gradient(160deg, var(--color-primary-dark), var(--color-primary));
          border: none;
          color: var(--color-white);
        }
        .pricing-label {
          font-size: 14px;
          color: var(--color-text-light);
          margin-bottom: 16px;
          letter-spacing: 0.05em;
        }
        .pricing-card-highlight .pricing-label {
          color: rgba(255, 255, 255, 0.8);
        }
        .pricing-value {
          font-family: var(--font-display);
          font-size: clamp(40px, 5.5vw, 52px);
          font-weight: 700;
          color: var(--color-text);
          line-height: 1;
          margin-bottom: 12px;
        }
        .pricing-card-highlight .pricing-value {
          color: var(--color-white);
        }
        .pricing-unit {
          font-size: 24px;
        }
        .pricing-note {
          font-size: 13px;
          color: var(--color-text-light);
        }
        .pricing-card-highlight .pricing-note {
          color: rgba(255, 255, 255, 0.65);
        }
        .subsidy-card {
          background: var(--color-white);
          border-radius: 24px;
          padding: clamp(36px, 5vw, 48px);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.04);
          border: 1px solid var(--color-border);
        }
        .subsidy-title {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 600;
          color: var(--color-text);
          margin-bottom: 28px;
          text-align: center;
        }
        .subsidy-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }
        @media (max-width: 500px) {
          .subsidy-grid {
            grid-template-columns: 1fr;
          }
        }
        .subsidy-item {
          background: linear-gradient(135deg, rgba(26, 95, 74, 0.06), rgba(26, 95, 74, 0.02));
          border-radius: 16px;
          padding: 28px 24px;
          text-align: center;
        }
        .subsidy-item-label {
          font-size: 13px;
          color: var(--color-text-light);
          margin-bottom: 12px;
          letter-spacing: 0.02em;
        }
        .subsidy-item-value {
          font-family: var(--font-display);
          font-size: 30px;
          font-weight: 700;
          color: var(--color-primary);
        }
        .subsidy-note {
          text-align: center;
          font-size: 13px;
          color: var(--color-text-light);
        }

        /* ========== Fee Section ========== */
        .fee-section {
          background: var(--color-bg-warm);
        }
        .fee-highlight-box {
          background: linear-gradient(160deg, var(--color-primary-dark), var(--color-primary));
          border-radius: 24px;
          padding: clamp(36px, 5vw, 52px);
          text-align: center;
          color: var(--color-white);
          margin-bottom: 40px;
        }
        .fee-highlight-title {
          font-family: var(--font-display);
          font-size: clamp(24px, 3.5vw, 32px);
          font-weight: 700;
          margin-bottom: 8px;
        }
        .fee-highlight-subtitle {
          font-size: 16px;
          opacity: 0.85;
        }
        .fee-examples {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }
        @media (max-width: 900px) {
          .fee-examples {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 500px) {
          .fee-examples {
            grid-template-columns: 1fr;
          }
        }
        .fee-example {
          background: var(--color-white);
          border-radius: 16px;
          padding: 28px 20px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          border: 1px solid var(--color-border);
        }
        .fee-example-label {
          font-size: 13px;
          color: var(--color-text-light);
          margin-bottom: 8px;
        }
        .fee-example-value {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 700;
          color: var(--color-primary);
        }
        .fee-breakdown {
          background: var(--color-white);
          border-radius: 16px;
          padding: 28px 32px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 32px;
          flex-wrap: wrap;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          border: 1px solid var(--color-border);
        }
        .fee-breakdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: var(--color-text);
          white-space: nowrap;
        }
        .fee-breakdown-dot {
          width: 10px;
          height: 10px;
          background: var(--color-primary);
          border-radius: 50%;
        }
        .fee-breakdown-highlight {
          color: var(--color-primary);
          font-weight: 600;
        }

        /* ========== Comparison Section ========== */
        .comparison-card {
          background: var(--color-white);
          border-radius: 24px;
          padding: clamp(40px, 6vw, 64px);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.04);
          border: 1px solid var(--color-border);
          text-align: center;
        }
        .comparison-title {
          font-size: 17px;
          color: var(--color-text-light);
          margin-bottom: 32px;
        }
        .comparison-row {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: clamp(24px, 5vw, 56px);
          flex-wrap: wrap;
          margin-bottom: 32px;
        }
        .comparison-item {
          text-align: center;
        }
        .comparison-item-label {
          font-size: 14px;
          color: var(--color-text-light);
          margin-bottom: 12px;
        }
        .comparison-item-value {
          font-family: var(--font-display);
          font-size: clamp(36px, 5vw, 48px);
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .comparison-item-value-red {
          color: #dc3545;
        }
        .comparison-item-value-green {
          color: var(--color-primary);
        }
        .comparison-vs {
          font-size: 24px;
          color: var(--color-border);
          font-weight: 300;
        }
        .comparison-message {
          font-size: 17px;
          color: var(--color-text);
          line-height: 1.6;
        }
        .comparison-message strong {
          color: var(--color-primary);
          font-weight: 600;
        }

        /* ========== CTA Section ========== */
        .cta-section {
          background: linear-gradient(180deg, var(--color-bg-warm), var(--color-bg));
          border-top: 1px solid var(--color-border);
        }
        .cta-content {
          text-align: center;
          max-width: 700px;
          margin: 0 auto;
        }
        .cta-title {
          font-family: var(--font-display);
          font-size: clamp(24px, 3.5vw, 34px);
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: 20px;
          line-height: 1.6;
        }
        .cta-title-highlight {
          color: var(--color-primary);
        }
        .cta-text {
          font-size: 17px;
          color: var(--color-text-light);
          margin-bottom: 40px;
        }

        /* ========== Form Section ========== */
        .form-section {
          background: var(--color-bg-warm);
        }
        .form-container {
          max-width: 600px;
          margin: 0 auto;
          background: var(--color-white);
          border-radius: 28px;
          padding: clamp(36px, 6vw, 56px);
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.06);
          border: 1px solid var(--color-border);
        }
        .form-campaign-note {
          background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
          border-radius: 14px;
          padding: 16px 20px;
          margin-bottom: 32px;
          text-align: center;
          font-size: 14px;
          color: var(--color-white);
        }
        .form-campaign-highlight {
          color: var(--color-accent-light);
          font-weight: 600;
        }
        .form-group {
          margin-bottom: 24px;
        }
        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text);
          margin-bottom: 10px;
        }
        .form-required {
          color: #dc3545;
          margin-left: 4px;
        }
        .form-input {
          width: 100%;
          padding: 16px 18px;
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          color: var(--color-text);
          font-family: var(--font-body);
          font-size: 16px;
          transition: all 0.3s var(--ease-out-expo);
        }
        .form-input:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 4px rgba(26, 95, 74, 0.08);
          background: var(--color-white);
        }
        .form-input::placeholder {
          color: #a0a0a0;
        }
        .form-textarea {
          min-height: 130px;
          resize: vertical;
        }
        .form-submit {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
          color: var(--color-white);
          border: none;
          border-radius: 14px;
          font-family: var(--font-body);
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.4s var(--ease-out-expo);
          box-shadow: 0 4px 20px rgba(26, 95, 74, 0.25);
        }
        .form-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(26, 95, 74, 0.35);
        }
        .form-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .form-success {
          text-align: center;
          padding: 48px 20px;
        }
        .form-success-icon {
          width: 72px;
          height: 72px;
          background: rgba(26, 95, 74, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          font-size: 32px;
          color: var(--color-primary);
        }
        .form-success-title {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: 16px;
        }
        .form-success-text {
          color: var(--color-text-light);
          line-height: 1.9;
          font-size: 15px;
        }

        /* ========== Footer ========== */
        .footer {
          background: var(--color-white);
          padding: 60px clamp(20px, 5vw, 60px) 40px;
          border-top: 1px solid var(--color-border);
        }
        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
        }
        .footer-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 40px;
          margin-bottom: 40px;
          padding-bottom: 40px;
          border-bottom: 1px solid var(--color-border);
        }
        .footer-company {
          text-align: right;
        }
        .footer-company-name {
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 600;
          color: var(--color-text);
          margin-bottom: 6px;
        }
        .footer-company-rep {
          font-size: 13px;
          color: var(--color-text-light);
        }
        .footer-bottom {
          text-align: center;
          font-size: 12px;
          color: var(--color-text-light);
          letter-spacing: 0.02em;
        }

        /* ========== Responsive ========== */
        @media (max-width: 768px) {
          .header-cta {
            display: none;
          }
          .campaign-banner {
            font-size: 11px;
            padding: 10px 16px;
          }
          .hero {
            padding-top: 160px;
          }
        }
      `}</style>

      {/* Header */}
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-inner">
          <div className="logo">
            <div className="logo-mark">礼</div>
            <span className="logo-text">Rei</span>
          </div>
          <a href="#contact" className="header-cta">
            お問い合わせ
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </header>

      {/* Campaign Banner */}
      <div className="campaign-banner">
        🎉 <span className="campaign-banner-highlight">先着10社限定</span>：システム利用料8%を<span className="campaign-banner-highlight">半年間 貴社に還元</span>キャンペーン実施中
      </div>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-pattern" />
        <div className="hero-content">
          <div className="hero-inner">
            <div className="hero-campaign-badge">
              🎁 先着10社限定：半年間 手数料8%が貴社の収益に
            </div>
            <p className="hero-label">葬儀社様向け 遠隔献杯システム</p>
            <h1 className="hero-title">
              競合他社の相見積もりに<br />
              <span className="hero-title-accent">負けない</span>ための新提案
            </h1>
            <p className="hero-description">
              遠方の方から献杯（支援金）を集め、ご遺族の負担を軽減。<br />
              見積もりの印象を変え、成約率を高める仕組みです。
            </p>
            <div className="hero-cta-group">
              <a href="#contact" className="hero-cta-primary">
                資料請求・お問い合わせ
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <a href="#pricing" className="hero-cta-secondary">
                料金を見る
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Campaign Section */}
      <section className="section campaign-section">
        <div className="section-inner">
          <div className="section-header">
            <p className="section-label">CAMPAIGN</p>
            <h2 className="section-title">
              先着<span className="campaign-highlight">10社</span>限定<br />
              システム利用料8%を<span className="campaign-highlight">半年間 貴社に還元</span>
            </h2>
            <p className="section-subtitle">
              献杯が集まるほど、葬儀社様の収益もアップします
            </p>
          </div>
          <div className="campaign-card">
            <p className="campaign-card-title">キャンペーン内容</p>
            <p className="campaign-card-text">
              導入から<strong>6ヶ月間</strong>、システム利用料<strong>8%を貴社に還元</strong>いたします。<br />
              献杯金額の8%が葬儀社様の収益になります。
            </p>
            <div className="campaign-metrics">
              <div className="campaign-metric">
                <p className="campaign-metric-label">10万円の献杯で</p>
                <p className="campaign-metric-value">8,000円</p>
                <p className="campaign-metric-note">貴社の収益に</p>
              </div>
              <div className="campaign-metric">
                <p className="campaign-metric-label">50万円の献杯で</p>
                <p className="campaign-metric-value">40,000円</p>
                <p className="campaign-metric-note">貴社の収益に</p>
              </div>
            </div>
          </div>
          <p className="campaign-note">※先着10社に達し次第、キャンペーンは終了となります</p>
          <div style={{ textAlign: 'center' }}>
            <a href="#contact" className="campaign-cta">
              今すぐキャンペーンに申し込む
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="section problem-section">
        <div className="section-inner">
          <div className="section-header">
            <p className="section-label">PROBLEM</p>
            <h2 className="section-title">葬儀業界の課題</h2>
            <p className="section-subtitle">
              値上げが難しい業界で、どう差別化するか
            </p>
          </div>
          <div className="problem-grid">
            <div className="problem-card">
              <div className="problem-card-icon">📊</div>
              <h3 className="problem-card-title">価格競争の激化</h3>
              <p className="problem-card-text">
                他社より高く見えたら選ばれない。内容ではなく金額の見え方で決まる時代。
              </p>
            </div>
            <div className="problem-card">
              <div className="problem-card-icon">💰</div>
              <h3 className="problem-card-title">遺族の経済的負担</h3>
              <p className="problem-card-text">
                葬儀費用の全国平均は約150万円。「もっと安くできませんか」という相談が増加。
              </p>
            </div>
            <div className="problem-card">
              <div className="problem-card-icon">🌏</div>
              <h3 className="problem-card-title">参列できない方の増加</h3>
              <p className="problem-card-text">
                遠方・高齢・仕事の都合で参列できない方が、お気持ちを届ける手段がない。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <p className="section-label">SOLUTION</p>
            <h2 className="section-title">Reiとは</h2>
          </div>
          <div className="solution-intro">
            <h3 className="solution-intro-title">
              香典をデジタル化するシステムではありません
            </h3>
            <p className="solution-intro-text">
              <strong>成約率</strong>と<strong>見積の印象</strong>を変える仕組みです
            </p>
          </div>
          <div className="flow-container">
            <div className="flow-step">
              <div className="flow-step-num">1</div>
              <div className="flow-step-content">
                <p className="flow-step-text">葬儀社様が献杯ページを作成<strong>（3分で完了）</strong></p>
              </div>
            </div>
            <div className="flow-step">
              <div className="flow-step-num">2</div>
              <div className="flow-step-content">
                <p className="flow-step-text">専用リンクを遺族にお伝え</p>
              </div>
            </div>
            <div className="flow-step">
              <div className="flow-step-num">3</div>
              <div className="flow-step-content">
                <p className="flow-step-text"><strong>遺族がリンクをLINEで共有</strong>（遠方の親族・知人へ）</p>
              </div>
            </div>
            <div className="flow-step">
              <div className="flow-step-num">4</div>
              <div className="flow-step-content">
                <p className="flow-step-text">遠方の方がスマホから献杯（支援金）を送金</p>
              </div>
            </div>
            <div className="flow-step flow-step-highlight">
              <div className="flow-step-num">5</div>
              <div className="flow-step-content">
                <p className="flow-step-text"><strong>集まったお金は葬儀費用に充当可能</strong></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section features-section">
        <div className="section-inner">
          <div className="section-header">
            <p className="section-label">FEATURES</p>
            <h2 className="section-title">Reiが選ばれる理由</h2>
          </div>
          <div className="features-grid">
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

      {/* Pricing Section */}
      <section className="section" id="pricing">
        <div className="section-inner">
          <div className="section-header">
            <p className="section-label">PRICING</p>
            <h2 className="section-title">料金体系</h2>
          </div>
          <div className="pricing-grid">
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
          <div className="subsidy-card">
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
            <p className="subsidy-note">※採択率 約70〜80%　※申請サポートも弊社で対応可能</p>
          </div>
        </div>
      </section>

      {/* Fee Section */}
      <section className="section fee-section">
        <div className="section-inner">
          <div className="section-header">
            <p className="section-label">FEE</p>
            <h2 className="section-title">献杯手数料</h2>
          </div>
          <div className="fee-highlight-box">
            <p className="fee-highlight-title">献杯金額の約9割がご遺族に届きます</p>
            <p className="fee-highlight-subtitle">月額0円の成果報酬型</p>
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
              <span>決済手数料（Stripe）：<span className="fee-breakdown-highlight">3.6%</span></span>
            </div>
            <div className="fee-breakdown-item">
              <div className="fee-breakdown-dot" />
              <span>システム利用料：<span className="fee-breakdown-highlight">8%</span></span>
            </div>
            <div className="fee-breakdown-item">
              <span style={{ color: '#888' }}>合計：<strong style={{ color: '#333' }}>11.6%</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <p className="section-label">COMPARISON</p>
            <h2 className="section-title">Reiを使わなければ、<br />遠方からの献杯は0円です</h2>
          </div>
          <div className="comparison-card">
            <p className="comparison-title">10万円の献杯があった場合</p>
            <div className="comparison-row">
              <div className="comparison-item">
                <p className="comparison-item-label">Reiなし</p>
                <p className="comparison-item-value comparison-item-value-red">0円</p>
              </div>
              <span className="comparison-vs">vs</span>
              <div className="comparison-item">
                <p className="comparison-item-label">Reiあり</p>
                <p className="comparison-item-value comparison-item-value-green">88,400円</p>
              </div>
            </div>
            <p className="comparison-message">
              <strong>0円</strong>と<strong>88,400円</strong>。どちらがご遺族のためになりますか？
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="section-inner">
          <div className="cta-content">
            <h2 className="cta-title">
              「他社より安くできます」ではなく、<br />
              <span className="cta-title-highlight">「お客様の負担を減らせます」</span>という提案を
            </h2>
            <p className="cta-text">Reiで、価格競争から価値競争へ</p>
            <a href="#contact" className="hero-cta-primary">
              資料請求・お問い合わせ
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="section form-section" id="contact">
        <div className="section-inner">
          <div className="section-header">
            <p className="section-label">CONTACT</p>
            <h2 className="section-title">お問い合わせ</h2>
            <p className="section-subtitle">
              資料請求、デモのご依頼、ご質問など、お気軽にお問い合わせください
            </p>
          </div>
          <div className="form-container">
            <div className="form-campaign-note">
              🎁 今なら<span className="form-campaign-highlight">先着10社限定</span>で、システム利用料8%が<span className="form-campaign-highlight">半年間 貴社の収益に</span>
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
          <div className="footer-top">
            <div className="logo">
              <div className="logo-mark">礼</div>
              <span className="logo-text">Rei</span>
            </div>
            <div className="footer-company">
              <p className="footer-company-name">株式会社SHIKAKERU</p>
              <p className="footer-company-rep">代表取締役 中川 航輝</p>
            </div>
          </div>
          <p className="footer-bottom">© 2025 SHIKAKERU Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
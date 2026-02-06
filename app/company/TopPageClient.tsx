"use client";

// This component handles top-page-specific styles that use pseudo-elements and keyframes.
// RevealObserver (in layout) handles the scroll-reveal animations.

export default function TopPageClient() {
  return (
    <style jsx global>{`
      /* ── Hero ── */
      .co-hero {
        min-height: 100vh; display: flex; align-items: center;
        position: relative; overflow: hidden; background: var(--color-bg);
      }
      .co-hero::before {
        content: ''; position: absolute; top: -30%; right: -20%;
        width: 800px; height: 800px;
        background: radial-gradient(circle, rgba(44,74,62,0.04) 0%, transparent 70%);
        border-radius: 50%; pointer-events: none;
      }
      .co-hero::after {
        content: ''; position: absolute; bottom: -10%; left: -10%;
        width: 600px; height: 600px;
        background: radial-gradient(circle, rgba(184,149,106,0.05) 0%, transparent 70%);
        border-radius: 50%; pointer-events: none;
      }
      .co-hero-inner {
        position: relative; z-index: 1; width: 100%; max-width: 1120px;
        margin: 0 auto; padding: 140px 24px 100px;
      }
      .co-hero-badge {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 6px 16px; background: var(--color-accent-soft);
        border: 1px solid rgba(44,74,62,0.1); border-radius: 100px;
        font-size: 12px; font-weight: 500; color: var(--color-accent);
        letter-spacing: 0.04em; margin-bottom: 32px;
        opacity: 0; animation: coFadeUp 0.8s var(--ease-out) 0.2s forwards;
      }
      .co-hero-badge::before {
        content: ''; width: 6px; height: 6px;
        background: var(--color-accent); border-radius: 50%;
      }
      .co-hero-title {
        font-family: var(--font-serif);
        font-size: clamp(32px, 5.5vw, 56px); font-weight: 400;
        line-height: 1.5; letter-spacing: 0.02em; margin-bottom: 28px;
        opacity: 0; animation: coFadeUp 0.8s var(--ease-out) 0.35s forwards;
      }
      .co-hero-title em {
        font-style: normal; color: var(--color-accent); font-weight: 600;
      }
      .co-hero-subtitle {
        font-size: 16px; line-height: 2; color: var(--color-text-secondary);
        max-width: 580px; margin-bottom: 48px;
        opacity: 0; animation: coFadeUp 0.8s var(--ease-out) 0.5s forwards;
      }
      .co-hero-actions {
        display: flex; gap: 16px; flex-wrap: wrap;
        opacity: 0; animation: coFadeUp 0.8s var(--ease-out) 0.65s forwards;
      }
      .co-hero-scroll {
        position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
        display: flex; flex-direction: column; align-items: center; gap: 8px;
        font-size: 10px; letter-spacing: 0.15em; color: var(--color-text-light);
        opacity: 0; animation: coFadeIn 1s var(--ease-out) 1.2s forwards;
      }
      .co-hero-scroll-line {
        width: 1px; height: 40px;
        background: linear-gradient(to bottom, var(--color-text-light), transparent);
        animation: coScrollLine 2s ease-in-out infinite;
      }
      @keyframes coFadeUp {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes coFadeIn {
        from { opacity: 0; } to { opacity: 1; }
      }
      @keyframes coScrollLine {
        0%, 100% { opacity: 0.3; transform: scaleY(0.6); transform-origin: top; }
        50% { opacity: 1; transform: scaleY(1); }
      }

      /* ── Problem ── */
      .co-problem {
        background: var(--color-bg-warm); position: relative;
      }
      .co-problem::before {
        content: ''; position: absolute; top: 0; left: 0; right: 0;
        height: 1px; background: var(--color-border);
      }
      .co-problem-inner { text-align: center; max-width: 720px; margin: 0 auto; }
      .co-problem h2 {
        font-family: var(--font-serif); font-size: clamp(24px, 3.5vw, 34px);
        font-weight: 400; line-height: 1.7; margin-bottom: 40px; letter-spacing: 0.02em;
      }
      .co-problem-text {
        font-size: 14px; color: var(--color-text-secondary);
        line-height: 2; max-width: 560px; margin: 0 auto;
      }
      .co-problem-stats {
        display: grid; grid-template-columns: repeat(3, 1fr);
        gap: 32px; margin-top: 56px;
      }
      .co-stat-card {
        padding: 32px 20px; background: var(--color-surface);
        border-radius: 12px; border: 1px solid var(--color-border-light);
        transition: transform 0.4s var(--ease-out), box-shadow 0.4s;
      }
      .co-stat-card:hover {
        transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.06);
      }
      .co-stat-number {
        font-family: var(--font-display); font-size: 42px; font-weight: 500;
        color: var(--color-accent); line-height: 1; margin-bottom: 8px;
      }
      .co-stat-unit { font-size: 16px; font-weight: 400; }
      .co-stat-label { font-size: 13px; color: var(--color-text-secondary); line-height: 1.6; }

      /* ── Services ── */
      .co-services { background: var(--color-bg); }
      .co-services-header {
        text-align: center; max-width: 600px; margin: 0 auto 64px;
      }
      .co-services-header h2 {
        font-family: var(--font-serif); font-size: clamp(24px, 3.5vw, 34px);
        font-weight: 400; line-height: 1.7; margin-bottom: 16px;
      }
      .co-services-header p {
        font-size: 15px; color: var(--color-text-secondary); line-height: 1.9;
      }
      .co-services-grid {
        display: grid; grid-template-columns: repeat(2, 1fr); gap: 28px;
      }
      .co-service-card {
        background: var(--color-surface); border: 1px solid var(--color-border-light);
        border-radius: 16px; padding: 48px 40px;
        transition: transform 0.5s var(--ease-out), box-shadow 0.5s, border-color 0.4s;
        position: relative; overflow: hidden;
      }
      .co-service-card::before {
        content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
        background: linear-gradient(90deg, var(--color-accent), var(--color-gold));
        opacity: 0; transition: opacity 0.4s;
      }
      .co-service-card:hover {
        transform: translateY(-6px); box-shadow: 0 20px 60px rgba(0,0,0,0.07);
        border-color: var(--color-border);
      }
      .co-service-card:hover::before { opacity: 1; }
      .co-service-icon {
        width: 52px; height: 52px; background: var(--color-accent-soft);
        border-radius: 12px; display: flex; align-items: center;
        justify-content: center; font-size: 24px; margin-bottom: 28px;
      }
      .co-icon-gold { background: rgba(184,149,106,0.1); }
      .co-service-tag {
        display: inline-block; font-size: 11px; font-weight: 600;
        letter-spacing: 0.08em; padding: 4px 12px; border-radius: 4px; margin-bottom: 16px;
      }
      .co-service-tag-green { color: var(--color-accent); background: var(--color-accent-soft); }
      .co-service-tag-gold { color: var(--color-gold); background: rgba(184,149,106,0.1); }
      .co-service-card h3 {
        font-family: var(--font-serif); font-size: 24px; font-weight: 500;
        margin-bottom: 16px; letter-spacing: 0.01em;
      }
      .co-service-card p {
        font-size: 14px; color: var(--color-text-secondary); line-height: 2; margin-bottom: 28px;
      }
      .co-service-features { list-style: none; margin-bottom: 32px; padding: 0; }
      .co-service-features li {
        font-size: 13px; color: var(--color-text-secondary); padding: 8px 0;
        border-bottom: 1px solid var(--color-border-light);
        display: flex; align-items: center; gap: 10px;
      }
      .co-service-features li:last-child { border-bottom: none; }
      .co-feature-check {
        width: 18px; height: 18px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 10px; flex-shrink: 0;
      }
      .co-check-green { background: var(--color-accent-soft); color: var(--color-accent); }
      .co-check-gold { background: rgba(184,149,106,0.1); color: var(--color-gold); }
      .co-service-link {
        display: inline-flex; align-items: center; gap: 8px;
        font-size: 14px; font-weight: 500; transition: gap 0.3s var(--ease-out);
        text-decoration: none;
      }
      .co-link-green { color: var(--color-accent); }
      .co-link-gold { color: var(--color-gold); }
      .co-service-link:hover { gap: 12px; }

      /* ── Numbers ── */
      .co-numbers {
        background: var(--color-accent); color: white;
        position: relative; overflow: hidden;
      }
      .co-numbers::before {
        content: ''; position: absolute; top: -50%; right: -20%;
        width: 600px; height: 600px;
        background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%);
        border-radius: 50%;
      }
      .co-numbers-inner { position: relative; z-index: 1; text-align: center; }
      .co-numbers h2 {
        font-family: var(--font-serif); font-size: clamp(22px, 3vw, 30px);
        font-weight: 400; margin-bottom: 56px; opacity: 0.95;
      }
      .co-numbers-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
      .co-number-item {
        padding: 36px 16px; border-radius: 12px;
        background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
        transition: background 0.3s;
      }
      .co-number-item:hover { background: rgba(255,255,255,0.08); }
      .co-number-value {
        font-family: var(--font-display); font-size: 48px; font-weight: 500;
        line-height: 1; margin-bottom: 8px; color: var(--color-gold-light);
      }
      .co-number-suffix { font-size: 18px; opacity: 0.8; }
      .co-number-desc { font-size: 13px; opacity: 0.7; line-height: 1.6; }

      /* ── Company ── */
      .co-company { background: var(--color-bg-warm); }
      .co-company-grid {
        display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start;
      }
      .co-company-message h2 {
        font-family: var(--font-serif); font-size: clamp(24px, 3.5vw, 34px);
        font-weight: 400; line-height: 1.7; margin-bottom: 32px;
      }
      .co-blockquote {
        font-family: var(--font-serif); font-size: 18px; font-weight: 400;
        line-height: 2; color: var(--color-accent);
        padding-left: 20px; border-left: 2px solid var(--color-gold);
        margin-bottom: 28px; font-style: italic;
      }
      .co-message-body {
        font-size: 14px; color: var(--color-text-secondary); line-height: 2.1; margin-bottom: 24px;
      }
      .co-message-sign {
        font-family: var(--font-serif); font-size: 15px; color: var(--color-text); margin-top: 32px;
      }
      .co-message-sign span {
        display: block; font-size: 12px; color: var(--color-text-light);
        margin-bottom: 4px; font-family: var(--font-sans);
      }
      .co-info-card {
        background: var(--color-surface); border: 1px solid var(--color-border-light);
        border-radius: 16px; padding: 40px;
      }
      .co-info-card h3 {
        font-family: var(--font-serif); font-size: 18px; font-weight: 500;
        margin-bottom: 28px; letter-spacing: 0.02em;
      }
      .co-info-table { width: 100%; border-collapse: collapse; }
      .co-info-table tr { border-bottom: 1px solid var(--color-border-light); }
      .co-info-table tr:last-child { border-bottom: none; }
      .co-info-table th {
        font-size: 12px; font-weight: 500; color: var(--color-text-light);
        text-align: left; padding: 14px 16px 14px 0; vertical-align: top;
        white-space: nowrap; width: 100px; letter-spacing: 0.04em;
      }
      .co-info-table td {
        font-size: 14px; color: var(--color-text); padding: 14px 0; line-height: 1.7;
      }
      .co-timeline {
        margin-top: 36px; padding-top: 28px; border-top: 1px solid var(--color-border-light);
      }
      .co-timeline h4 {
        font-size: 13px; font-weight: 600; color: var(--color-text-light);
        letter-spacing: 0.08em; margin-bottom: 20px;
      }
      .co-timeline-items { position: relative; padding-left: 20px; }
      .co-timeline-items::before {
        content: ''; position: absolute; left: 4px; top: 6px; bottom: 6px;
        width: 1px; background: var(--color-border);
      }
      .co-timeline-item {
        position: relative; padding-left: 20px; padding-bottom: 18px; font-size: 13px;
      }
      .co-timeline-item:last-child { padding-bottom: 0; }
      .co-timeline-item::before {
        content: ''; position: absolute; left: -20px; top: 7px;
        width: 9px; height: 9px; background: var(--color-bg-warm);
        border: 2px solid var(--color-accent); border-radius: 50%;
      }
      .co-timeline-item-last::before {
        border-color: var(--color-gold); background: var(--color-gold);
      }
      .co-timeline-year { font-weight: 600; color: var(--color-accent); margin-right: 8px; }
      .co-timeline-text { color: var(--color-text-secondary); }

      /* ── Responsive ── */
      @media (max-width: 1024px) {
        .co-services-grid { gap: 20px; }
        .co-service-card { padding: 36px 28px; }
        .co-numbers-grid { grid-template-columns: repeat(2, 1fr); }
        .co-company-grid { gap: 40px; }
      }
      @media (max-width: 768px) {
        .co-hero-inner { padding: 120px 24px 80px; }
        .co-problem-stats { grid-template-columns: 1fr; gap: 16px; }
        .co-services-grid { grid-template-columns: 1fr; }
        .co-numbers-grid { grid-template-columns: 1fr 1fr; }
        .co-company-grid { grid-template-columns: 1fr; }
      }
      @media (max-width: 480px) {
        .co-hero-actions { flex-direction: column; }
        .co-hero-actions .co-btn { width: 100%; justify-content: center; }
        .co-numbers-grid { grid-template-columns: 1fr; }
      }
    `}</style>
  );
}
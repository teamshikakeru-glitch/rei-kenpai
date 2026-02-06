"use client";

import { useState, useEffect } from "react";

export default function ServiceReiClient() {
  const [activeTab, setActiveTab] = useState("attendee");

  // FAQ accordion
  useEffect(() => {
    const handleFaqClick = (e: Event) => {
      const btn = (e.target as HTMLElement).closest(".rei-faq-question");
      if (!btn) return;
      const item = btn.parentElement;
      if (!item) return;
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".rei-faq-item").forEach((i) => i.classList.remove("open"));
      if (!wasOpen) item.classList.add("open");
    };
    document.addEventListener("click", handleFaqClick);

    // Pricing bar animation
    const pricingBar = document.getElementById("pricingBar");
    if (pricingBar) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              pricingBar.style.width = "88.4%";
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      const visual = pricingBar.closest(".rei-pricing-visual");
      if (visual) observer.observe(visual);
    }

    return () => document.removeEventListener("click", handleFaqClick);
  }, []);

  const tabs = [
    { id: "attendee", label: "参列者の方" },
    { id: "family", label: "ご遺族の方" },
    { id: "funeral", label: "葬儀社の方" },
  ];

  const benefits: Record<string, { icon: string; title: string; desc: string }[]> = {
    attendee: [
      { icon: "📱", title: "スマホで3分、簡単操作", desc: "難しい手続きは一切不要。URLを開いて、お名前と金額を入力するだけ。パソコンが苦手な方でも迷いません。" },
      { icon: "💳", title: "クレジットカード対応", desc: "Visa・Mastercard・JCB・AMEXに対応。現金を用意する手間がなく、いつでもどこからでもお気持ちを届けられます。" },
      { icon: "✉️", title: "メッセージも添えられる", desc: "金額だけでなく、故人やご遺族への想いをメッセージとして添えることができます。心のこもった弔いが実現します。" },
    ],
    family: [
      { icon: "📋", title: "献杯一覧をリアルタイム確認", desc: "誰から、いくらの献杯があったかを遺族専用ページでいつでも確認。メッセージも一つひとつ読むことができます。" },
      { icon: "🤝", title: "自動お礼メッセージ", desc: "献杯があるたびに、遺族から自動でお礼のメッセージが届きます。悲しみの中でも感謝の気持ちを伝えられます。" },
      { icon: "💰", title: "透明な受取金額", desc: "遺族への還元率は88.4%。手数料は明確に開示されているため、安心してご利用いただけます。" },
    ],
    funeral: [
      { icon: "¥", title: "導入後の費用ゼロ", desc: "初期導入費用500万円のみで、月額費用・メンテナンス費は永久無料。ランニングコストを気にせず安心してご利用いただけます。" },
      { icon: "⚡", title: "管理画面で簡単運用", desc: "献杯ページの作成から管理まで、直感的な管理画面で完結。ITに詳しくないスタッフでもすぐに操作できます。" },
      { icon: "😊", title: "遺族・参列者の満足度向上", desc: "「参列できないけれど何かしたい」という方の受け皿として、葬儀社様のサービス品質がさらに高まります。" },
    ],
  };

  return (
    <>
      <div className="rei-tab-buttons co-reveal">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`rei-tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="rei-benefit-grid">
        {benefits[activeTab].map((b, i) => (
          <div className="rei-benefit-card" key={`${activeTab}-${i}`}>
            <div className="rei-benefit-icon">{b.icon}</div>
            <h4>{b.title}</h4>
            <p>{b.desc}</p>
          </div>
        ))}
      </div>

      {/* Page-specific styles */}
      <style jsx global>{`
        /* ── Concept ── */
        .rei-concept { background: var(--color-bg-warm); position: relative; }
        .rei-concept::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0;
          height: 1px; background: var(--color-border);
        }
        .rei-concept-inner { max-width: 760px; margin: 0 auto; text-align: center; }
        .rei-concept h2 {
          font-family: var(--font-serif); font-size: clamp(22px, 3vw, 30px);
          font-weight: 400; line-height: 1.8; margin-bottom: 32px;
        }
        .rei-concept-text {
          font-size: 14px; color: var(--color-text-secondary); line-height: 2.2;
          text-align: left; max-width: 640px; margin: 0 auto;
        }
        .rei-concept-text p { margin-bottom: 20px; }
        .rei-kenpai-note {
          margin-top: 48px; padding: 32px; background: var(--color-surface);
          border: 1px solid var(--color-border-light); border-radius: 12px; text-align: left;
        }
        .rei-kenpai-note-title {
          font-family: var(--font-serif); font-size: 16px; font-weight: 500;
          margin-bottom: 12px; display: flex; align-items: center; gap: 8px;
        }
        .rei-kenpai-note p { font-size: 13px; color: var(--color-text-secondary); line-height: 2; }

        /* ── Steps ── */
        .rei-steps { background: var(--color-bg); }
        .rei-steps-header { text-align: center; max-width: 600px; margin: 0 auto 64px; }
        .rei-steps-header h2 {
          font-family: var(--font-serif); font-size: clamp(22px, 3vw, 30px);
          font-weight: 400; margin-bottom: 12px;
        }
        .rei-steps-header p { font-size: 14px; color: var(--color-text-secondary); }
        .rei-steps-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; position: relative;
        }
        .rei-steps-grid::before {
          content: ''; position: absolute; top: 48px;
          left: calc(16.67% + 12px); right: calc(16.67% + 12px);
          height: 1px; background: var(--color-border); z-index: 0;
        }
        .rei-step-card {
          background: var(--color-surface); border: 1px solid var(--color-border-light);
          border-radius: 16px; padding: 36px 28px; text-align: center;
          position: relative; z-index: 1;
          transition: transform 0.4s var(--ease-out), box-shadow 0.4s;
        }
        .rei-step-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.06); }
        .rei-step-num {
          width: 40px; height: 40px; border-radius: 50%;
          background: var(--color-accent); color: white;
          font-family: var(--font-display); font-size: 18px; font-weight: 500;
          display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;
        }
        .rei-step-icon { font-size: 32px; margin-bottom: 16px; }
        .rei-step-card h3 {
          font-family: var(--font-serif); font-size: 17px; font-weight: 500; margin-bottom: 12px;
        }
        .rei-step-card p { font-size: 13px; color: var(--color-text-secondary); line-height: 1.9; }

        /* ── Benefits ── */
        .rei-benefits { background: var(--color-bg-warm); }
        .rei-benefits-header { text-align: center; max-width: 600px; margin: 0 auto 48px; }
        .rei-benefits-header h2 {
          font-family: var(--font-serif); font-size: clamp(22px, 3vw, 30px);
          font-weight: 400; margin-bottom: 12px;
        }
        .rei-tab-buttons { display: flex; justify-content: center; gap: 8px; margin-bottom: 40px; flex-wrap: wrap; }
        .rei-tab-btn {
          padding: 10px 28px; font-size: 14px; font-weight: 500;
          background: var(--color-surface); color: var(--color-text-secondary);
          border: 1px solid var(--color-border-light); border-radius: 100px;
          cursor: pointer; font-family: var(--font-sans); transition: all 0.3s;
        }
        .rei-tab-btn.active { background: var(--color-accent); color: white; border-color: var(--color-accent); }
        .rei-tab-btn:hover:not(.active) { border-color: var(--color-accent); color: var(--color-accent); }
        .rei-benefit-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .rei-benefit-card {
          background: var(--color-surface); border: 1px solid var(--color-border-light);
          border-radius: 12px; padding: 32px 24px;
          transition: transform 0.4s var(--ease-out), box-shadow 0.4s;
        }
        .rei-benefit-card:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(0,0,0,0.05); }
        .rei-benefit-icon { font-size: 28px; margin-bottom: 16px; }
        .rei-benefit-card h4 { font-size: 15px; font-weight: 600; margin-bottom: 10px; }
        .rei-benefit-card p { font-size: 13px; color: var(--color-text-secondary); line-height: 1.9; }

        /* ── Pricing ── */
        .rei-pricing { background: var(--color-bg); }
        .rei-pricing-header { text-align: center; max-width: 600px; margin: 0 auto 56px; }
        .rei-pricing-header h2 {
          font-family: var(--font-serif); font-size: clamp(22px, 3vw, 30px);
          font-weight: 400; margin-bottom: 12px;
        }
        .rei-pricing-header p { font-size: 14px; color: var(--color-text-secondary); }
        .rei-pricing-card {
          max-width: 680px; margin: 0 auto; background: var(--color-surface);
          border: 1px solid var(--color-border-light); border-radius: 20px; overflow: hidden;
        }
        .rei-pricing-card-header {
          background: var(--color-accent); color: white; padding: 36px 40px; text-align: center;
        }
        .rei-pricing-card-header h3 {
          font-family: var(--font-serif); font-size: 20px; font-weight: 400; margin-bottom: 8px;
        }
        .rei-price-big { font-family: var(--font-display); font-size: 56px; font-weight: 500; line-height: 1.1; }
        .rei-price-unit { font-size: 16px; opacity: 0.8; }
        .rei-price-note { font-size: 13px; opacity: 0.7; margin-top: 8px; }
        .rei-pricing-card-body { padding: 36px 40px; }
        .rei-pricing-breakdown { width: 100%; border-collapse: collapse; }
        .rei-pricing-breakdown tr { border-bottom: 1px solid var(--color-border-light); }
        .rei-pricing-breakdown tr:last-child { border-bottom: none; }
        .rei-pricing-breakdown th {
          font-size: 13px; font-weight: 500; color: var(--color-text-secondary);
          text-align: left; padding: 14px 0; width: 200px;
        }
        .rei-pricing-breakdown td { font-size: 14px; padding: 14px 0; text-align: right; }
        .rei-highlight { color: var(--color-accent); font-weight: 600; }
        .rei-pricing-visual {
          margin-top: 28px; padding: 24px; background: var(--color-accent-soft); border-radius: 12px;
        }
        .rei-pricing-bar-label {
          display: flex; justify-content: space-between;
          font-size: 12px; color: var(--color-text-secondary); margin-bottom: 6px;
        }
        .rei-pricing-bar {
          height: 12px; border-radius: 6px; background: var(--color-border-light); overflow: hidden;
        }
        .rei-pricing-bar-fill {
          height: 100%; border-radius: 6px; width: 0%;
          background: linear-gradient(90deg, var(--color-accent), var(--color-accent-light));
          transition: width 1.5s var(--ease-out);
        }
        .rei-pricing-example {
          font-size: 12px; color: var(--color-text-light); margin-top: 8px; text-align: center;
        }

        /* ── FAQ ── */
        .rei-faq { background: var(--color-bg-warm); }
        .rei-faq-header { text-align: center; max-width: 600px; margin: 0 auto 56px; }
        .rei-faq-header h2 {
          font-family: var(--font-serif); font-size: clamp(22px, 3vw, 30px); font-weight: 400;
        }
        .rei-faq-list { max-width: 760px; margin: 0 auto; }
        .rei-faq-item {
          background: var(--color-surface); border: 1px solid var(--color-border-light);
          border-radius: 12px; margin-bottom: 12px; overflow: hidden; transition: border-color 0.3s;
        }
        .rei-faq-item:hover { border-color: var(--color-border); }
        .rei-faq-question {
          width: 100%; background: none; border: none; text-align: left; cursor: pointer;
          padding: 20px 24px; font-size: 14px; font-weight: 500; font-family: var(--font-sans);
          color: var(--color-text); display: flex; justify-content: space-between;
          align-items: center; gap: 16px; line-height: 1.7;
        }
        .rei-q-mark {
          font-family: var(--font-display); font-size: 18px; font-weight: 600;
          color: var(--color-accent); margin-right: 12px; flex-shrink: 0;
        }
        .rei-faq-toggle {
          width: 28px; height: 28px; border-radius: 50%; background: var(--color-accent-soft);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; color: var(--color-accent);
          transition: transform 0.3s, background 0.3s; flex-shrink: 0;
        }
        .rei-faq-item.open .rei-faq-toggle {
          transform: rotate(45deg); background: var(--color-accent); color: white;
        }
        .rei-faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.4s var(--ease-out); }
        .rei-faq-item.open .rei-faq-answer { max-height: 400px; }
        .rei-faq-answer-inner {
          padding: 0 24px 20px 56px;
          font-size: 13px; color: var(--color-text-secondary); line-height: 2;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .rei-steps-grid { grid-template-columns: 1fr; gap: 16px; }
          .rei-steps-grid::before { display: none; }
          .rei-benefit-grid { grid-template-columns: 1fr; }
          .rei-pricing-card-body { padding: 28px 24px; }
          .rei-pricing-breakdown th { width: auto; }
        }
        @media (max-width: 480px) {
          .rei-tab-buttons { flex-direction: column; align-items: stretch; }
          .rei-tab-btn { text-align: center; }
          .rei-price-big { font-size: 42px; }
        }
      `}</style>
    </>
  );
}
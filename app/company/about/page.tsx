import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "会社概要｜株式会社SHIKAKERU",
  description:
    "株式会社SHIKAKERUの会社概要。人生が動くきっかけを仕掛ける会社です。遠隔献杯システム「礼」の企画・開発・運営、葬儀社向け業務システムの開発を行っています。",
};

export default function AboutPage() {
  return (
    <>
      {/* ── Page Hero ── */}
      <section className="co-page-hero">
        <div className="co-container">
          <div className="co-page-hero-inner">
            <div className="co-breadcrumb">
              <Link href="/company">トップ</Link>
              <span className="sep">/</span>
              <span>会社概要</span>
            </div>
            <h1>会社概要</h1>
            <p className="co-lead">
              株式会社SHIKAKERUについてご紹介します。
            </p>
          </div>
        </div>
      </section>

      {/* ── Company Info ── */}
      <section className="co-about-section co-section">
        <div className="co-container">
          <div className="co-about-grid">
            <div className="co-about-main">
              <div className="co-label">COMPANY INFO</div>
              <h2>基本情報</h2>
              <div className="co-info-card" style={{ marginTop: "32px" }}>
                <table className="co-info-table">
                  <tbody>
                    <tr><th>会社名</th><td>株式会社SHIKAKERU</td></tr>
                    <tr><th>代表者</th><td>中川 航輝</td></tr>
                    <tr><th>所在地</th><td>〒910-0017<br />福井県福井市文京2-26-2</td></tr>
                    <tr><th>設立</th><td>2025年</td></tr>
                    <tr><th>資本金</th><td>300万円</td></tr>
                    <tr><th>事業内容</th><td>
                      遠隔献杯システム「礼」の企画・開発・運営<br />
                      葬儀社向け業務システムの開発<br />
                      イベント企画・運営・制作
                    </td></tr>
                    <tr><th>メール</th><td>team.shikakeru@gmail.com</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="co-about-side">
              <div className="co-info-card">
                <h3>沿革</h3>
                <div className="co-timeline" style={{ marginTop: "0", paddingTop: "0", borderTop: "none" }}>
                  <div className="co-timeline-items">
                    <div className="co-timeline-item">
                      <span className="co-timeline-year">2025</span>
                      <span className="co-timeline-text">株式会社SHIKAKERU 設立</span>
                    </div>
                    <div className="co-timeline-item">
                      <span className="co-timeline-year">2025</span>
                      <span className="co-timeline-text">遠隔献杯システム「礼（Rei）」リリース</span>
                    </div>
                    <div className="co-timeline-item co-timeline-item-last">
                      <span className="co-timeline-year">2026</span>
                      <span className="co-timeline-text">葬儀社向け業務システム「礼カスタム」提供開始</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="co-about-mission co-section">
        <div className="co-container">
          <div className="co-about-mission-inner">
            <div className="co-label">MISSION</div>
            <h2>人生が動くきっかけを、仕掛ける。</h2>
            <p>
              SHIKAKERUは、人・土地・組織の感情と行動が動き出す「仕掛け」を設計する会社です。<br />
              心が動いた瞬間から、人生は変わり始める。<br />
              私たちは、そんな瞬間を偶然にしないために、感情が動く構造を設計しています。
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="co-cta co-section">
        <div className="co-container">
          <div className="co-cta-card">
            <div className="co-label">CONTACT</div>
            <h2>お問い合わせ</h2>
            <p>
              サービスに関するご質問、お仕事のご相談など、<br />
              お気軽にお問い合わせください。
            </p>
            <div className="co-cta-actions">
              <Link href="/company/contact" className="co-btn co-btn-primary">
                お問い合わせフォーム<span className="co-btn-arrow">→</span>
              </Link>
              <a href="mailto:team.shikakeru@gmail.com" className="co-btn co-btn-outline">
                メールで相談する
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
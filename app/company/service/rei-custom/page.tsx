import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "礼カスタム｜葬儀社向け業務システム開発",
  description:
    "礼カスタムは、礼を導入いただいた葬儀社様だけにご提供する業務システムのオーダーメイド開発サービスです。7カテゴリ・35以上の機能から選択、500万円で最短1ヶ月納品。",
};

export default function ReiCustomPage() {
  return (
    <>
      {/* ── Page Hero ── */}
      <section className="co-page-hero">
        <div className="co-container">
          <div className="co-page-hero-inner">
            <div className="co-breadcrumb">
              <Link href="/company">トップ</Link>
              <span className="sep">/</span>
              <span>サービス紹介</span>
              <span className="sep">/</span>
              <span>礼カスタム</span>
            </div>
            <h1>
              御社だけの仕組みを、<br />
              <em>オーダーメイドで。</em>
            </h1>
            <p className="co-lead">
              「礼カスタム」は、礼を導入いただいた葬儀社様だけにご提供する、<br />
              業務システムのオーダーメイド開発サービスです。
            </p>
          </div>
        </div>
      </section>

      {/* ── Demo ── */}
      <section className="rc-demo co-section" style={{ paddingTop: "40px", paddingBottom: "40px" }}>
        <div className="co-container">
          <div style={{ 
            background: "linear-gradient(135deg, #2C4A3E 0%, #3D6B5A 100%)",
            borderRadius: "16px",
            padding: "48px 32px",
            textAlign: "center"
          }}>
            <p style={{ color: "#B8956A", fontSize: "14px", letterSpacing: "2px", marginBottom: "16px" }}>
              DEMO
            </p>
            <h2 style={{ color: "#FFFFFF", fontSize: "28px", marginBottom: "16px", fontWeight: "600" }}>
              実際の画面をご覧ください
            </h2>
            <p style={{ color: "#CCCCCC", fontSize: "15px", marginBottom: "32px", lineHeight: "1.8" }}>
              礼カスタムでどんなシステムが作れるのか、<br />
              デモ画面でご確認いただけます。
            </p>
            <a 
              href="/rei-showcase.html" 
              className="co-btn co-btn-primary"
              style={{ fontSize: "16px", padding: "16px 40px" }}
            >
              デモ画面を見る<span className="co-btn-arrow">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Concept ── */}
      <section className="rc-concept co-section">
        <div className="co-container">
          <div className="rc-concept-inner">
            <div className="co-label">CONCEPT</div>
            <h2>大手ITにはない業界理解。<br />パッケージソフトにはない柔軟性。</h2>
            <div className="rc-concept-text">
              <p>
                葬儀業界には、他の業界にはない独特の業務フローや慣習があります。
                大手ITベンダーは業界を知らず、パッケージソフトは融通が利かない——。
                そんな課題を抱える葬儀社様のために、礼カスタムは生まれました。
              </p>
              <p>
                私たちは「礼」の開発を通じて葬儀業界を深く理解しています。
                その知見を活かし、御社の業務に本当にフィットするシステムを、
                オーダーメイドでお作りします。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="rc-features co-section">
        <div className="co-container">
          <div className="rc-features-header">
            <div className="co-label">FEATURES</div>
            <h2>7カテゴリ・35以上の機能</h2>
            <p>必要な機能だけを選んで、御社専用のシステムを構築します。</p>
          </div>
          <div className="rc-features-grid">
            <div className="rc-feature-card">
              <div className="rc-feature-icon">📊</div>
              <h3>見積・売上管理</h3>
              <p>見積書作成、売上管理、請求書発行など</p>
            </div>
            <div className="rc-feature-card">
              <div className="rc-feature-icon">👥</div>
              <h3>顧客管理</h3>
              <p>顧客情報、対応履歴、家族構成の管理など</p>
            </div>
            <div className="rc-feature-card">
              <div className="rc-feature-icon">📱</div>
              <h3>現場連絡</h3>
              <p>スタッフ間連絡、シフト管理、タスク共有など</p>
            </div>
            <div className="rc-feature-card">
              <div className="rc-feature-icon">🙏</div>
              <h3>法要・アフターフォロー</h3>
              <p>法要案内、周忌管理、アフターフォロー管理など</p>
            </div>
            <div className="rc-feature-card">
              <div className="rc-feature-icon">📈</div>
              <h3>経営ダッシュボード</h3>
              <p>売上分析、KPI管理、レポート出力など</p>
            </div>
            <div className="rc-feature-card">
              <div className="rc-feature-icon">🔗</div>
              <h3>外部連携</h3>
              <p>会計ソフト連携、LINE連携、メール配信など</p>
            </div>
            <div className="rc-feature-card">
              <div className="rc-feature-icon">⚡</div>
              <h3>現場便利ツール</h3>
              <p>チェックリスト、写真管理、音声メモなど</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="rc-pricing co-section">
        <div className="co-container">
          <div className="rc-pricing-header">
            <div className="co-label">PRICING</div>
            <h2>料金体系</h2>
            <p>シンプルで分かりやすい料金設定です。</p>
          </div>
          <div className="rc-pricing-card">
            <div className="rc-pricing-card-header">
              <div className="rc-pricing-badge">礼 導入企業様限定</div>
              <h3>システム開発費用</h3>
              <div className="rc-price-big">500<span className="rc-price-unit">万円</span></div>
              <div className="rc-price-note">税別・月額メンテナンス費なし</div>
            </div>
            <div className="rc-pricing-card-body">
              <ul className="rc-pricing-includes">
                <li><span className="rc-check">✓</span>12ポイント分の機能を自由に選択</li>
                <li><span className="rc-check">✓</span>最短1ヶ月での納品</li>
                <li><span className="rc-check">✓</span>導入後の月額費用なし</li>
                <li><span className="rc-check">✓</span>操作説明・マニュアル提供</li>
                <li><span className="rc-check">✓</span>導入後3ヶ月間のサポート付き</li>
              </ul>
            </div>
          </div>
          <p className="rc-pricing-note">
            ※ 礼カスタムは「礼」を導入いただいた葬儀社様限定のサービスです。<br />
            ※ 先着10社様限定の特別価格となります。
          </p>
        </div>
      </section>

      {/* ── Flow ── */}
      <section className="rc-flow co-section">
        <div className="co-container">
          <div className="rc-flow-header">
            <div className="co-label">FLOW</div>
            <h2>導入の流れ</h2>
          </div>
          <div className="rc-flow-steps">
            <div className="rc-flow-step">
              <div className="rc-flow-num">1</div>
              <h3>ヒアリング</h3>
              <p>御社の業務課題や要望を詳しくお聞きします。</p>
            </div>
            <div className="rc-flow-step">
              <div className="rc-flow-num">2</div>
              <h3>機能選定</h3>
              <p>35以上の機能から、最適な組み合わせをご提案します。</p>
            </div>
            <div className="rc-flow-step">
              <div className="rc-flow-num">3</div>
              <h3>開発</h3>
              <p>御社専用のシステムを開発します。</p>
            </div>
            <div className="rc-flow-step">
              <div className="rc-flow-num">4</div>
              <h3>納品・運用開始</h3>
              <p>操作説明を行い、運用を開始します。</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="co-cta co-section">
        <div className="co-container">
          <div className="co-cta-card">
            <div className="co-label">CONTACT</div>
            <h2>まずはお気軽に<br />ご相談ください。</h2>
            <p>
              「どんな機能があるか詳しく知りたい」「自社に合うか相談したい」など、<br />
              どんな段階でもお気軽にお問い合わせください。
            </p>
            <div className="co-cta-actions">
              <Link href="/company/contact" className="co-btn co-btn-primary">
                お問い合わせフォーム<span className="co-btn-arrow">→</span>
              </Link>
              <a href="mailto:team.shikakeru@gmail.com" className="co-btn co-btn-outline">
                メールで相談する
              </a>
            </div>
            <p className="co-cta-note">※ 先着10社様限定のご案内です</p>
          </div>
        </div>
      </section>
    </>
  );
}
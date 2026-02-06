import type { Metadata } from "next";
import Link from "next/link";
import TopPageClient from "./TopPageClient";

export const metadata: Metadata = {
  title: "株式会社SHIKAKERU｜葬儀業界のデジタル革新パートナー",
  description:
    "株式会社SHIKAKERUは、遠隔献杯システム「礼（Rei）」を提供。導入企業様には葬儀社向け業務システム「礼カスタム」もご用意。テクノロジーで弔いの文化を守り、進化させます。",
};

export default function CompanyTopPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="co-hero">
        <div className="co-hero-inner">
          <div className="co-hero-badge">株式会社SHIKAKERU — 生きる仕掛けを</div>
          <h1 className="co-hero-title">
            想いを届ける、<br />
            <em>距離を超えて。</em>
          </h1>
          <p className="co-hero-subtitle">
            葬儀に参列できなくても、大切な人への弔いの気持ちは届けられる。<br />
            遠隔献杯システム「礼」で想いを届け、<br />
            導入企業様には業務システム「礼カスタム」もご提供しています。
          </p>
          <div className="co-hero-actions">
            <Link href="/company/service/rei" className="co-btn co-btn-primary">
              サービスを見る<span className="co-btn-arrow">→</span>
            </Link>
            <Link href="/company/contact" className="co-btn co-btn-outline">
              お問い合わせ
            </Link>
          </div>
        </div>
        <div className="co-hero-scroll">
          <span>SCROLL</span>
          <div className="co-hero-scroll-line" />
        </div>
      </section>

      {/* ── Problem ── */}
      <section className="co-problem co-section">
        <div className="co-container">
          <div className="co-problem-inner co-reveal">
            <div className="co-label">ISSUE</div>
            <h2>
              葬儀に参列できなかった経験は<br />ありませんか？
            </h2>
            <p className="co-problem-text">
              家族葬の増加、遠方に住む親族や友人——。<br />
              大切な人の最期に立ち会えず、想いを届けられなかった方が<br />
              年々増え続けています。
            </p>
          </div>
          <div className="co-problem-stats">
            <div className="co-stat-card co-reveal co-reveal-d1">
              <div className="co-stat-number">48.9<span className="co-stat-unit">%</span></div>
              <div className="co-stat-label">全葬儀に占める家族葬の割合<br />（2025年 業界調査）</div>
            </div>
            <div className="co-stat-card co-reveal co-reveal-d2">
              <div className="co-stat-number">3<span className="co-stat-unit">人に1人</span></div>
              <div className="co-stat-label">遠方を理由に参列を<br />断念した経験がある</div>
            </div>
            <div className="co-stat-card co-reveal co-reveal-d3">
              <div className="co-stat-number">72<span className="co-stat-unit">%</span></div>
              <div className="co-stat-label">「何らかの形で弔いの気持ちを<br />伝えたかった」と回答</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="co-services co-section">
        <div className="co-container">
          <div className="co-services-header co-reveal">
            <div className="co-label">SERVICES</div>
            <h2>2つの事業で、<br />葬儀業界を支える</h2>
            <p>
              弔う人の想いを届ける「礼」と、<br />
              礼を導入いただいた葬儀社様の業務を支える「礼カスタム」。
            </p>
          </div>
          <div className="co-services-grid">
            {/* Rei */}
            <div className="co-service-card co-reveal co-reveal-d1">
              <div className="co-service-icon">🙏</div>
              <div className="co-service-tag co-service-tag-green">遠隔献杯システム</div>
              <h3>礼（Rei）</h3>
              <p>
                葬儀に参列できない方が、オンラインで香典とメッセージを届けられるシステムです。
                スマートフォンから簡単に操作でき、遺族にはリアルタイムで献杯が届きます。
                導入費用は500万円。以降の月額費用は永久無料です。
              </p>
              <ul className="co-service-features">
                <li><span className="co-feature-check co-check-green">✓</span>初期導入費用500万円・以降の月額費用は永久無料</li>
                <li><span className="co-feature-check co-check-green">✓</span>遺族への自動お礼メッセージ機能</li>
                <li><span className="co-feature-check co-check-green">✓</span>クレジットカード決済（Visa / Master / JCB / AMEX）</li>
                <li><span className="co-feature-check co-check-green">✓</span>献杯ページのURL共有で簡単案内</li>
                <li><span className="co-feature-check co-check-green">✓</span>遺族受取率 88.4%の透明な料金体系</li>
              </ul>
              <Link href="/company/service/rei" className="co-service-link co-link-green">
                詳しく見る <span className="co-btn-arrow">→</span>
              </Link>
            </div>

            {/* Rei Custom */}
            <div className="co-service-card co-reveal co-reveal-d2">
              <div className="co-service-icon co-icon-gold">⚙️</div>
              <div className="co-service-tag co-service-tag-gold">礼 導入企業限定 — 先着10社</div>
              <h3>礼カスタム</h3>
              <p>
                「礼」を導入いただいた葬儀社様だけにご提供する、業務システムのオーダーメイド開発サービスです。
                見積作成、顧客管理、現場連絡、経営分析——。
                大手ITにはない業界理解と、パッケージソフトにはない柔軟性で、
                御社だけの仕組みをお作りします。先着10社様限定の特別なご案内です。
              </p>
              <ul className="co-service-features">
                <li><span className="co-feature-check co-check-gold">✓</span>礼 導入企業様限定のサービス</li>
                <li><span className="co-feature-check co-check-gold">✓</span>7カテゴリ・35以上の機能から選択</li>
                <li><span className="co-feature-check co-check-gold">✓</span>システム導入費用 500万円（税別）</li>
                <li><span className="co-feature-check co-check-gold">✓</span>他社見積もりに負けない価格競争力</li>
                <li><span className="co-feature-check co-check-gold">✓</span>最短1ヶ月の納品・月額メンテナンス費なし</li>
              </ul>
              <Link href="/company/service/rei-custom" className="co-service-link co-link-gold">
                詳しく見る <span className="co-btn-arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Numbers ── */}
      <section className="co-numbers co-section">
        <div className="co-container">
          <div className="co-numbers-inner">
            <div className="co-label co-reveal" style={{ color: "var(--color-gold-light)" }}>RESULTS</div>
            <h2 className="co-reveal">数字で見る「礼」の実績</h2>
            <div className="co-numbers-grid">
              <div className="co-number-item co-reveal co-reveal-d1">
                <div className="co-number-value">47<span className="co-number-suffix">都道府県</span></div>
                <div className="co-number-desc">サービス対応エリア</div>
              </div>
              <div className="co-number-item co-reveal co-reveal-d2">
                <div className="co-number-value">88.4<span className="co-number-suffix">%</span></div>
                <div className="co-number-desc">遺族への還元率</div>
              </div>
              <div className="co-number-item co-reveal co-reveal-d3">
                <div className="co-number-value">3<span className="co-number-suffix">分</span></div>
                <div className="co-number-desc">献杯ページの作成時間</div>
              </div>
              <div className="co-number-item co-reveal co-reveal-d4">
                <div className="co-number-value">0<span className="co-number-suffix">円</span></div>
                <div className="co-number-desc">導入後の月額・メンテナンス費</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Company ── */}
      <section className="co-company co-section">
        <div className="co-container">
          <div className="co-company-grid">
            <div className="co-company-message co-reveal">
              <div className="co-label">MESSAGE</div>
              <h2>テクノロジーで、<br />弔いの文化を守り、<br />進化させる。</h2>
              <blockquote className="co-blockquote">
                「届けられなかった想いを、もうゼロにしたい。」
              </blockquote>
              <p className="co-message-body">
                日本の葬送文化は、時代とともに姿を変えています。
                家族葬が主流になり、遠方の親族や友人が弔いの場に立ち会えないケースが急増しました。
                その一方で、「何かしたかった」「気持ちだけでも届けたかった」という声が絶えることはありません。
              </p>
              <p className="co-message-body">
                私たちSHIKAKERUは、「生きる仕掛けを」を理念に、
                テクノロジーの力で人と人との繋がりを支える事業を展開しています。
                遠隔献杯システム「礼（Rei）」は、距離や時間を超えて弔いの想いを届ける仕組みです。
                さらに「礼」を導入いただいた葬儀社様には「礼カスタム」として業務システムの開発もご提供し、
                本来の使命——ご遺族に寄り添うこと——により集中できる環境を作ります。
              </p>
              <p className="co-message-body">
                大手ITベンダーにはない業界への深い理解と、パッケージソフトにはない柔軟さ。
                その両方を兼ね備えたパートナーとして、
                葬儀業界のデジタル化を一歩ずつ、しかし着実に進めてまいります。
              </p>
              <div className="co-message-sign">
                <span>株式会社SHIKAKERU 代表取締役</span>
                中川 航輝
              </div>
            </div>
            <div className="co-info-card co-reveal co-reveal-d2">
              <h3>会社概要</h3>
              <table className="co-info-table">
                <tbody>
                  <tr><th>会社名</th><td>株式会社SHIKAKERU</td></tr>
                  <tr><th>代表者</th><td>中川 航輝</td></tr>
                  <tr><th>所在地</th><td>〒910-0017<br />福井県福井市文京2-26-2</td></tr>
                  <tr><th>設立</th><td>2024年</td></tr>
                  <tr><th>資本金</th><td>300万円</td></tr>
                  <tr><th>事業内容</th><td>遠隔献杯システム「礼」の企画・開発・運営<br />葬儀社向け業務システムの開発<br />イベント企画・運営・制作<br />農業ドキュメンタリー撮影・編集・運営<br />建築関係（施工図面作成等）</td></tr>
                </tbody>
              </table>
              <div className="co-timeline">
                <h4>沿革</h4>
                <div className="co-timeline-items">
                  <div className="co-timeline-item">
                    <span className="co-timeline-year">2024</span>
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
      </section>

      {/* ── CTA ── */}
      <section className="co-cta co-section">
        <div className="co-container">
          <div className="co-cta-card co-reveal">
            <div className="co-label">CONTACT</div>
            <h2>まずは、お気軽に<br />ご相談ください。</h2>
            <p>
              「礼」の導入相談から、葬儀社様の業務課題のヒアリングまで。<br />
              どんな些細なことでもお気軽にお問い合わせください。
            </p>
            <div className="co-cta-actions">
              <Link href="/company/contact" className="co-btn co-btn-primary">
                お問い合わせフォーム<span className="co-btn-arrow">→</span>
              </Link>
              <a href="mailto:info@shikakeru.co.jp" className="co-btn co-btn-outline">
                メールで相談する
              </a>
            </div>
            <p className="co-cta-note">※ お電話でのお問い合わせは受け付けておりません</p>
          </div>
        </div>
      </section>

      {/* Client-side interactions */}
      <TopPageClient />
    </>
  );
}
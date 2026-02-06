import type { Metadata } from "next";
import Link from "next/link";
import ServiceReiClient from "./ServiceReiClient";

export const metadata: Metadata = {
  title: "礼（Rei）— 遠隔献杯システム",
  description:
    "礼（Rei）は、葬儀に参列できない方がオンラインで香典とメッセージを届けられる遠隔献杯システムです。導入費用500万円、以降の月額費用は永久無料。遺族受取率88.4%。",
};

export default function ServiceReiPage() {
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
              <span>礼（Rei）</span>
            </div>
            <h1>
              遠くにいても、<br />
              <em>想いは届けられる。</em>
            </h1>
            <p className="co-lead">
              「礼（Rei）」は、葬儀に参列できない方がオンラインで<br />
              香典とメッセージを届けられる遠隔献杯システムです。<br />
              スマートフォンひとつで、距離を超えた弔いが可能になります。
            </p>
          </div>
        </div>
      </section>

      {/* ── Concept ── */}
      <section className="rei-concept co-section">
        <div className="co-container">
          <div className="rei-concept-inner co-reveal">
            <div className="co-label">ABOUT REI</div>
            <h2>「献杯」という日本の文化を、<br />デジタルの力で守る。</h2>
            <div className="rei-concept-text">
              <p>
                家族葬が増え、遠方の親族や友人が葬儀に参列できないケースは年々増加しています。
                「何かしたかった」「気持ちだけでも届けたかった」——そんな声に応えるために生まれたのが、
                遠隔献杯システム「礼（Rei）」です。
              </p>
              <p>
                献杯ページのURLを共有するだけで、全国どこからでもオンラインで香典を送り、
                故人へのメッセージを添えることができます。
                遺族には献杯の一覧とメッセージがリアルタイムで届き、
                自動お礼メッセージ機能により、双方向の温かいつながりが生まれます。
              </p>
            </div>
            <div className="rei-kenpai-note">
              <div className="rei-kenpai-note-title">🍶 「献杯」とは</div>
              <p>
                献杯（けんぱい）とは、故人に敬意を表し、杯を捧げる日本の弔いの作法です。
                「乾杯」が祝い事に用いられるのに対し、「献杯」は故人への敬意と追悼の意を込めて行われます。
                礼（Rei）では、この文化的な意味合いを大切にし、金銭の送金という行為を
                「故人への敬意を込めた献杯」として位置づけています。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Steps ── */}
      <section className="rei-steps co-section">
        <div className="co-container">
          <div className="rei-steps-header co-reveal">
            <div className="co-label">HOW IT WORKS</div>
            <h2>利用の流れ</h2>
            <p>3つのステップで、簡単にご利用いただけます。</p>
          </div>
          <div className="rei-steps-grid">
            <div className="rei-step-card co-reveal co-reveal-d1">
              <div className="rei-step-num">1</div>
              <div className="rei-step-icon">📋</div>
              <h3>献杯ページを作成</h3>
              <p>葬儀社様が管理画面から故人情報を入力し、献杯ページを作成します。所要時間はわずか3分です。</p>
            </div>
            <div className="rei-step-card co-reveal co-reveal-d2">
              <div className="rei-step-num">2</div>
              <div className="rei-step-icon">📱</div>
              <h3>URLをシェア</h3>
              <p>作成された献杯ページのURLを、遺族様や参列予定だった方にLINE・メール等でお知らせします。</p>
            </div>
            <div className="rei-step-card co-reveal co-reveal-d3">
              <div className="rei-step-num">3</div>
              <div className="rei-step-icon">🙏</div>
              <h3>オンラインで献杯</h3>
              <p>参列者はスマホからお名前・金額・メッセージを入力。クレジットカードで決済完了。遺族にリアルタイムで届きます。</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Benefits (Tabs — handled in client component) ── */}
      <section className="rei-benefits co-section">
        <div className="co-container">
          <div className="rei-benefits-header co-reveal">
            <div className="co-label">BENEFITS</div>
            <h2>それぞれに届く価値</h2>
          </div>
          <ServiceReiClient />
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="rei-pricing co-section">
        <div className="co-container">
          <div className="rei-pricing-header co-reveal">
            <div className="co-label">PRICING</div>
            <h2>料金体系</h2>
            <p>明朗な手数料で、安心してご利用いただけます。</p>
          </div>
          <div className="rei-pricing-card co-reveal">
            <div className="rei-pricing-card-header">
              <h3>システム導入費用</h3>
              <div className="rei-price-big">500<span className="rei-price-unit"> 万円</span></div>
              <div className="rei-price-note">以降の月額費用・メンテナンス費は永久無料</div>
            </div>
            <div className="rei-pricing-card-body">
              <table className="rei-pricing-breakdown">
                <tbody>
                  <tr><th>献杯時の手数料合計</th><td><span className="rei-highlight">11.6%</span></td></tr>
                  <tr><th>├ カード決済手数料（Stripe）</th><td>3.6%</td></tr>
                  <tr><th>└ システム利用料</th><td>8.0%</td></tr>
                  <tr><th>遺族様の受取率</th><td><span className="rei-highlight">88.4%</span></td></tr>
                </tbody>
              </table>
              <div className="rei-pricing-visual">
                <div className="rei-pricing-bar-label">
                  <span>遺族様受取 88.4%</span>
                  <span>手数料 11.6%</span>
                </div>
                <div className="rei-pricing-bar">
                  <div className="rei-pricing-bar-fill" id="pricingBar" />
                </div>
                <p className="rei-pricing-example">
                  例：10,000円の献杯 → 遺族様受取 8,840円 ／ 手数料 1,160円
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="rei-faq co-section">
        <div className="co-container">
          <div className="rei-faq-header co-reveal">
            <div className="co-label">FAQ</div>
            <h2>よくあるご質問</h2>
          </div>
          <div className="rei-faq-list">
            {faqData.map((item, i) => (
              <div className={`rei-faq-item co-reveal ${i > 0 ? `co-reveal-d${Math.min(i, 4)}` : ""}`} key={i}>
                <button className="rei-faq-question" data-faq={i}>
                  <span><span className="rei-q-mark">Q</span>{item.q}</span>
                  <span className="rei-faq-toggle">+</span>
                </button>
                <div className="rei-faq-answer">
                  <div className="rei-faq-answer-inner">{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="co-cta co-section">
        <div className="co-container">
          <div className="co-cta-card co-reveal">
            <div className="co-label">CONTACT</div>
            <h2>導入のご相談は<br />お気軽にどうぞ。</h2>
            <p>
              「まずは話を聞いてみたい」「自社の葬儀に合うか知りたい」など、<br />
              どんな段階でもお気軽にお問い合わせください。
            </p>
            <div className="co-cta-actions">
              <Link href="/company/contact" className="co-btn co-btn-primary">
                お問い合わせフォーム<span className="co-btn-arrow">→</span>
              </Link>
              <a href="mailto:info@shikakeru.co.jp" className="co-btn co-btn-outline">
                メールで相談する
              </a>
            </div>
            <p className="co-cta-note">※ 導入後の月額費用・メンテナンス費は永久無料です</p>
          </div>
        </div>
      </section>
    </>
  );
}

const faqData = [
  { q: "礼（Rei）の利用に費用はかかりますか？", a: "葬儀社様の初期導入費用は500万円（税別）です。導入後の月額費用・メンテナンス費は永久無料です。献杯（送金）時にのみ11.6%の手数料が発生します。内訳はカード決済手数料3.6%とシステム利用料8%です。遺族様には送金額の88.4%が届きます。" },
  { q: "参列者はどのように献杯しますか？", a: "葬儀社様または遺族様から共有された献杯ページのURLにアクセスし、お名前・金額・メッセージを入力するだけです。クレジットカード決済で、スマートフォンから3分程度で完了します。" },
  { q: "対応している決済方法は何ですか？", a: "Visa、Mastercard、JCB、American Expressのクレジットカードに対応しています。Stripe社の安全な決済基盤を利用しており、カード情報が礼のシステムに保存されることはありません。" },
  { q: "導入にはどのくらい時間がかかりますか？", a: "最短で当日から利用開始可能です。葬儀社様の管理画面からプロジェクト（献杯ページ）を作成するだけで、すぐに参列者へURLを共有いただけます。特別な機器やソフトウェアのインストールも不要です。" },
  { q: "遺族はどうやって献杯を確認しますか？", a: "遺族専用ページにパスワードでログインすると、献杯一覧・メッセージ・合計金額をリアルタイムで確認できます。献杯があるたびに自動でお礼メッセージも送信されます。" },
  { q: "匿名で献杯することはできますか？", a: "はい、可能です。献杯時に「匿名希望」を選択いただければ、遺族側の一覧にお名前は表示されません。" },
  { q: "セキュリティは安全ですか？", a: "決済はStripe社の国際基準（PCI DSS Level 1）に準拠した安全な環境で処理されます。クレジットカード情報は礼のサーバーを経由せず、Stripe社が直接処理するため、情報漏洩のリスクを最小限に抑えています。" },
];
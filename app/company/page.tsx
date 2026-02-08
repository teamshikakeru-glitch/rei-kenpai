import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "株式会社SHIKAKERU｜人生が動くきっかけを、仕掛ける。",
  description:
    "SHIKAKERUは、人・土地・組織の感情と行動が動き出す仕掛けを設計する会社です。心が動いた瞬間から、人生は変わり始める。",
};

export default function CompanyTopPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="co-hero">
        <div className="co-hero-inner">
          <div className="co-hero-logo">
            <Image
              src="/shikakeru-logo.jpg"
              alt="SHIKAKERU"
              width={200}
              height={130}
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <h1 className="co-hero-title">
            人生が動くきっかけを、<br />
            <em>仕掛ける。</em>
          </h1>
          <p className="co-hero-subtitle">
            心が動いた瞬間から、<br />
            人生は変わり始める。
          </p>
          <div className="co-hero-actions">
            <a href="/rei-lp.html" className="co-btn co-btn-primary co-btn-full">
              サービスを見る<span className="co-btn-arrow">→</span>
            </a>
            <Link href="/company/contact" className="co-btn co-btn-outline co-btn-full">
              お問い合わせ
            </Link>
          </div>
        </div>
        <div className="co-hero-scroll">
          <span>SCROLL</span>
          <div className="co-hero-scroll-line" />
        </div>
      </section>

      {/* ── Philosophy with Steps ── */}
      <section className="co-philosophy co-section">
        <div className="co-container">
          <div className="co-philosophy-inner co-reveal">
            <div className="co-label">PHILOSOPHY</div>
            <h2>
              心が動いた瞬間から、<br />人生は変わり始める。
            </h2>
            <div className="co-philosophy-text">
              <p>
                頭で記憶したことは、だんだん薄れていく。<br />
                でも、心で記憶したことは、一生残る。
              </p>
              <p>
                子どもの頃の運動会。家族で過ごしたクリスマス。<br />
                あの時の「感覚」は、今でも胸に残っている。
              </p>
            </div>

            {/* 3ステップ */}
            <div className="co-steps">
              <div className="co-step">
                <div className="co-step-icon">💭</div>
                <div className="co-step-title">心で感じる</div>
                <div className="co-step-desc">情報ではなく、感情が動く体験</div>
              </div>
              <div className="co-step-arrow">↓</div>
              <div className="co-step">
                <div className="co-step-icon">💡</div>
                <div className="co-step-title">きっかけが生まれる</div>
                <div className="co-step-desc">行動を変える「瞬間」</div>
              </div>
              <div className="co-step-arrow">↓</div>
              <div className="co-step">
                <div className="co-step-icon">🚀</div>
                <div className="co-step-title">人生が動き出す</div>
                <div className="co-step-desc">その後、何かが始まる</div>
              </div>
            </div>

            <p className="co-philosophy-conclusion">
              SHIKAKERUは、この「心が動く瞬間」を<br />
              偶然にしないために、<br />
              <strong>"感情が動く構造"</strong>を設計しています。
            </p>
          </div>
        </div>
      </section>

      {/* ── Numbers ── */}
      <section className="co-numbers co-section">
        <div className="co-container">
          <div className="co-reveal">
            <div className="co-label">NUMBERS</div>
            <h2>礼（Rei）の実績</h2>
          </div>
          <div className="co-numbers-grid">
            <div className="co-number-item co-reveal">
              <div className="co-number-value">88.4<span className="co-number-unit">%</span></div>
              <div className="co-number-label">遺族還元率</div>
            </div>
            <div className="co-number-item co-reveal">
              <div className="co-number-value">3<span className="co-number-unit">分</span></div>
              <div className="co-number-label">導入時間</div>
            </div>
            <div className="co-number-item co-reveal">
              <div className="co-number-value">0<span className="co-number-unit">円</span></div>
              <div className="co-number-label">月額費用</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="co-services co-section">
        <div className="co-container">
          <div className="co-services-header co-reveal">
            <div className="co-label">SERVICES</div>
            <h2>SHIKAKERUの事業</h2>
          </div>
          <div className="co-services-grid">
            {/* Rei */}
            <div className="co-service-card co-reveal">
              <div className="co-service-icon">🙏</div>
              <div className="co-service-tag co-service-tag-green">遠隔献杯システム</div>
              <h3>礼（Rei）</h3>
              <p>
                葬儀に参列できない方が、オンラインで香典とメッセージを届けられるシステム。
              </p>
              <p className="co-service-point">
                距離を超えて、想いを届ける仕掛け。
              </p>
              <a href="/rei-lp.html" className="co-btn co-btn-primary co-btn-full">
                詳しく見る<span className="co-btn-arrow">→</span>
              </a>
            </div>

            {/* Rei Custom */}
            <div className="co-service-card co-reveal">
              <div className="co-service-icon">⚙️</div>
              <div className="co-service-tag co-service-tag-gold">礼 導入企業限定</div>
              <h3>礼カスタム</h3>
              <p>
                「礼」を導入いただいた葬儀社様限定の、業務システムオーダーメイド開発。
              </p>
              <p className="co-service-point">
                御社だけの仕組みを、一緒につくる。
              </p>
              <Link href="/company/service/rei-custom" className="co-btn co-btn-outline co-btn-full">
                詳しく見る<span className="co-btn-arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust ── */}
      <section className="co-trust co-section">
        <div className="co-container">
          <div className="co-reveal">
            <div className="co-label">TRUST</div>
            <h2>信頼</h2>
          </div>
          <div className="co-trust-item co-reveal">
            <div className="co-trust-label">取引銀行</div>
            <div className="co-trust-value">福井銀行</div>
          </div>
        </div>
      </section>

      {/* ── Company Info ── */}
      <section className="co-company co-section">
        <div className="co-container">
          <div className="co-reveal">
            <div className="co-label">COMPANY</div>
            <h2>会社概要</h2>
          </div>
          <div className="co-company-list co-reveal">
            <div className="co-company-row">
              <div className="co-company-th">会社名</div>
              <div className="co-company-td">株式会社SHIKAKERU</div>
            </div>
            <div className="co-company-row">
              <div className="co-company-th">代表者</div>
              <div className="co-company-td">中川 航輝</div>
            </div>
            <div className="co-company-row">
              <div className="co-company-th">所在地</div>
              <div className="co-company-td">〒910-0017<br />福井県福井市文京2-26-2</div>
            </div>
            <div className="co-company-row">
              <div className="co-company-th">設立</div>
              <div className="co-company-td">2025年</div>
            </div>
            <div className="co-company-row">
              <div className="co-company-th">資本金</div>
              <div className="co-company-td">300万円</div>
            </div>
            <div className="co-company-row">
              <div className="co-company-th">取引銀行</div>
              <div className="co-company-td">福井銀行</div>
            </div>
            <div className="co-company-row">
              <div className="co-company-th">事業内容</div>
              <div className="co-company-td">
                遠隔献杯システム「礼」の企画・開発・運営<br />
                葬儀社向け業務システムの開発
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
            <h2>お問い合わせ</h2>
            <p>
              サービスに関するご質問、<br />
              お仕事のご相談など、<br />
              お気軽にお問い合わせください。
            </p>
            <div className="co-cta-actions">
              <Link href="/company/contact" className="co-btn co-btn-primary co-btn-full">
                お問い合わせフォーム<span className="co-btn-arrow">→</span>
              </Link>
              <a href="mailto:team.shikakeru@gmail.com" className="co-btn co-btn-outline co-btn-full">
                メールで相談する
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
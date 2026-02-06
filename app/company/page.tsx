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
        <div className="co-hero-inner" style={{ textAlign: "center", maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ marginBottom: "32px" }}>
            <Image
              src="/shikakeru-logo.jpg"
              alt="SHIKAKERU"
              width={280}
              height={180}
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <h1 className="co-hero-title" style={{ marginBottom: "24px" }}>
            人生が動くきっかけを、<br />
            <em>仕掛ける。</em>
          </h1>
          <p className="co-hero-subtitle" style={{ maxWidth: "700px", margin: "0 auto 48px" }}>
            SHIKAKERUは、<br />
            人・土地・組織の感情と行動が動き出す<br />
            "仕掛け"を設計する会社です。
          </p>
          <div className="co-hero-actions" style={{ justifyContent: "center" }}>
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

      {/* ── Philosophy 1: 思想ゾーン ── */}
      <section className="co-philosophy co-section">
        <div className="co-container">
          <div className="co-philosophy-inner co-reveal">
            <div className="co-label">PHILOSOPHY</div>
            <h2>
              心が動いた瞬間から、<br />人生は変わり始める。
            </h2>
            <div className="co-philosophy-text">
              <p>
                人は、情報を得た時よりも、心が動いた時に行動を変えます。
              </p>
              <p>
                あの日の出来事。あの場所の空気。あの人との出会い。<br />
                人生に残っている記憶は、いつも「感情が動いた瞬間」です。
              </p>
              <p>
                SHIKAKERUは、そんな瞬間を偶然にしないために、<br />
                <strong>"感情が動く構造"</strong>を設計しています。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Philosophy 2: 定義 ── */}
      <section className="co-definition co-section">
        <div className="co-container">
          <div className="co-definition-inner co-reveal">
            <div className="co-label">WHAT WE DO</div>
            <h2>仕掛けの会社です。</h2>
            <div className="co-definition-text">
              <p>
                SHIKAKERUは、人・土地・組織が持つ物語や想いを起点に、<br />
                行動が生まれる「仕掛け」を設計します。
              </p>
              <p>
                その仕掛けは、イベントという形をとることもあれば、<br />
                プロジェクトや体験、仕組みやストーリーになることもあります。
              </p>
              <p>
                私たちが大切にしているのは、「当日盛り上がったか」ではなく、<br />
                <strong>「その後、何かが始まったかどうか」</strong>です。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Philosophy 3: 働く場所 ── */}
      <section className="co-workplace co-section">
        <div className="co-container">
          <div className="co-workplace-inner co-reveal">
            <div className="co-label">CULTURE</div>
            <h2>
              挑戦は、与えられるものじゃない。<br />自分で踏み出すものだ。
            </h2>
            <div className="co-workplace-text">
              <p>
                SHIKAKERUは、完成された人材を集める会社ではありません。<br />
                未完成な若者が、自分で考え、挑戦できる「場」をつくる会社です。
              </p>
              <p>
                指示を待つより、まず動いてみる。<br />
                正解を探すより、自分なりの答えをつくる。
              </p>
              <p>
                ここで働くことは、仕事をこなすことではなく、<br />
                <strong>自分の可能性を試すこと。</strong>
              </p>
              <p>
                SHIKAKERUで働く時間そのものが、<br />
                人生を前に進める経験になることを、私たちは本気で目指しています。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Last Message ── */}
      <section className="co-lastmsg co-section">
        <div className="co-container">
          <div className="co-lastmsg-inner co-reveal">
            <h2>仕掛け人は、私たちだけじゃない。</h2>
            <p>
              この場所に関わった瞬間から、<br />
              あなたも、物語の当事者になる。
            </p>
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
            <div className="co-service-card co-reveal co-reveal-d1">
              <div className="co-service-icon">🙏</div>
              <div className="co-service-tag co-service-tag-green">遠隔献杯システム</div>
              <h3>礼（Rei）</h3>
              <p>
                葬儀に参列できない方が、オンラインで香典とメッセージを届けられるシステムです。
                距離を超えて、想いを届ける仕掛け。
              </p>
              <Link href="/company/service/rei" className="co-service-link co-link-green">
                詳しく見る <span className="co-btn-arrow">→</span>
              </Link>
            </div>

            {/* Rei Custom */}
            <div className="co-service-card co-reveal co-reveal-d2">
              <div className="co-service-icon co-icon-gold">⚙️</div>
              <div className="co-service-tag co-service-tag-gold">礼 導入企業限定</div>
              <h3>礼カスタム</h3>
              <p>
                「礼」を導入いただいた葬儀社様だけにご提供する、業務システムのオーダーメイド開発サービスです。
              </p>
              <Link href="/company/service/rei-custom" className="co-service-link co-link-gold">
                詳しく見る <span className="co-btn-arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Company Info ── */}
      <section className="co-company co-section">
        <div className="co-container">
          <div className="co-company-grid">
            <div className="co-company-message co-reveal">
              <div className="co-label">COMPANY</div>
              <h2>会社概要</h2>
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
                  </tbody>
                </table>
              </div>
            </div>
            <div className="co-reveal co-reveal-d2">
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

      {/* ── CTA ── */}
      <section className="co-cta co-section">
        <div className="co-container">
          <div className="co-cta-card co-reveal">
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
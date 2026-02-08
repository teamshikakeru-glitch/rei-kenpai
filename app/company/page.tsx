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
            SHIKAKERUは、<br />
            人・土地・組織の感情と行動が動き出す<br />
            "仕掛け"を設計する会社です。
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

      {/* ── Philosophy 1: 心が動いた瞬間から ── */}
      <section className="co-philosophy co-section">
        <div className="co-container">
          <div className="co-philosophy-inner co-reveal">
            <div className="co-label">PHILOSOPHY</div>
            <h2>
              心が動いた瞬間から、<br />人生は変わり始める。
            </h2>
            <div className="co-philosophy-text">
              <p>
                人は、正しい情報を知ったから動くのではありません。<br />
                心が揺れた時に、はじめて行動を変えます。
              </p>
              <p>
                あの日の出来事。あの場所の空気。あの人との出会い。<br />
                人生に残っている記憶は、いつも「感情が動いた瞬間」です。
              </p>
              <p>
                SHIKAKERUは、そんな瞬間を偶然に任せず、<br />
                <strong>感情が動き、次の行動が生まれる構造</strong>を設計しています。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Philosophy 2: 仕掛けをつくる会社 ── */}
      <section className="co-definition co-section">
        <div className="co-container">
          <div className="co-definition-inner co-reveal">
            <div className="co-label">WHAT WE DO</div>
            <h2>仕掛けをつくる会社です。</h2>
            <div className="co-definition-text">
              <p>
                SHIKAKERUは、人や土地、組織が持つ想いや物語を起点に、<br />
                行動が生まれる"仕掛け"を形にします。
              </p>
              <p>
                その仕掛けは、体験として現れることもあれば、<br />
                プロジェクトや仕組み、物語や「場」として立ち上がることもあります。
              </p>
              <p>
                私たちが大切にしているのは、その瞬間の盛り上がりではありません。<br />
                <strong>「その後、何かが始まったかどうか」</strong><br />
                そこに、すべての価値があると考えています。
              </p>
            </div>
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

      {/* ── Philosophy 3: 挑戦できる場 ── */}
      <section className="co-workplace co-section">
        <div className="co-container">
          <div className="co-workplace-inner co-reveal">
            <div className="co-label">CULTURE</div>
            <h2>
              挑戦できる「場」を、<br />仕事にする。
            </h2>
            <div className="co-workplace-text">
              <p>
                SHIKAKERUは、完成された人材を集める会社ではありません。
              </p>
              <p>
                未完成な若者が、自分で考え、自分で動き、<br />
                主体的に挑戦できる"場"をつくる会社です。
              </p>
              <p>
                指示を待つより、まず動く。<br />
                正解を探すより、自分なりの答えをつくる。
              </p>
              <p>
                ここで働くことは、仕事をこなすことではなく、<br />
                <strong>自分の可能性を試すこと。</strong>
              </p>
              <p>
                SHIKAKERUで過ごす時間そのものが、<br />
                人生を前に進める経験になることを、<br />
                私たちは本気で目指しています。
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
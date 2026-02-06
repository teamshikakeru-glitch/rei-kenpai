import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "株式会社SHIKAKERUへのお問い合わせ。礼（Rei）の導入相談、礼カスタムのご相談、その他のお問い合わせはこちらから。",
};

export default function ContactPage() {
  return (
    <>
      {/* ── Page Hero ── */}
      <section className="co-page-hero" style={{ paddingBottom: "80px" }}>
        <div className="co-container">
          <div className="co-page-hero-inner">
            <div className="co-breadcrumb">
              <Link href="/company">トップ</Link>
              <span className="sep">/</span>
              <span>お問い合わせ</span>
            </div>
            <h1>お問い合わせ</h1>
            <p className="co-lead">
              サービスに関するご質問、導入のご相談など、<br />
              どんな些細なことでもお気軽にお問い合わせください。
            </p>
          </div>
        </div>
      </section>

      {/* ── Contact Form ── */}
      <section className="ct-section">
        <div className="co-container">
          <div className="ct-grid">
            <ContactForm />

            {/* Sidebar */}
            <div className="ct-sidebar">
              <div className="ct-sidebar-card co-reveal co-reveal-d1">
                <h3>お問い合わせ先</h3>
                <div className="ct-method">
                  <div className="ct-method-label">メール</div>
                  <div className="ct-method-value">
                    <a href="mailto:info@shikakeru.co.jp">info@shikakeru.co.jp</a>
                  </div>
                </div>
                <div className="ct-method">
                  <div className="ct-method-label">所在地</div>
                  <div className="ct-method-value">
                    〒910-0017<br />福井県福井市文京2-26-2
                  </div>
                </div>
                <div className="ct-method">
                  <div className="ct-method-label">営業時間</div>
                  <div className="ct-method-value">平日 9:00 〜 18:00</div>
                </div>
              </div>
              <div className="ct-sidebar-note co-reveal co-reveal-d2">
                <p>
                  <strong>💡 ご回答について</strong><br />
                  お問い合わせいただいた内容は、2営業日以内にメールにてご回答いたします。
                  お急ぎの場合は、その旨をお問い合わせ内容にお書き添えください。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
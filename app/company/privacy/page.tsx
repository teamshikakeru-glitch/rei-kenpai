import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プライバシーポリシー｜株式会社SHIKAKERU",
  description: "株式会社SHIKAKERUのプライバシーポリシー。個人情報の取り扱いについてご説明します。",
};

export default function PrivacyPage() {
  return (
    <>
      {/* ── Page Hero ── */}
      <section className="co-page-hero" style={{ paddingBottom: "60px" }}>
        <div className="co-container">
          <div className="co-page-hero-inner">
            <div className="co-breadcrumb">
              <Link href="/company">トップ</Link>
              <span className="sep">/</span>
              <span>プライバシーポリシー</span>
            </div>
            <h1>プライバシーポリシー</h1>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="privacy-content co-section" style={{ paddingTop: "40px" }}>
        <div className="co-container">
          <div className="privacy-inner">
            <p className="privacy-intro">
              株式会社SHIKAKERU（以下「当社」といいます）は、お客様の個人情報の保護を重要な責務と認識し、以下のとおりプライバシーポリシーを定め、個人情報の適切な取り扱いに努めます。
            </p>

            <div className="privacy-section">
              <h2>1. 個人情報の定義</h2>
              <p>
                本プライバシーポリシーにおいて「個人情報」とは、個人情報保護法に定める個人情報を指し、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、メールアドレス、その他の記述等により特定の個人を識別できるものをいいます。
              </p>
            </div>

            <div className="privacy-section">
              <h2>2. 個人情報の収集方法</h2>
              <p>当社は、以下の方法により個人情報を収集することがあります。</p>
              <ul>
                <li>お問い合わせフォームからのご連絡</li>
                <li>サービスのお申し込み</li>
                <li>メールでのお問い合わせ</li>
                <li>その他、当社サービスのご利用に際して</li>
              </ul>
            </div>

            <div className="privacy-section">
              <h2>3. 個人情報の利用目的</h2>
              <p>当社は、収集した個人情報を以下の目的で利用いたします。</p>
              <ul>
                <li>当社サービスの提供・運営</li>
                <li>お問い合わせへの対応</li>
                <li>サービスに関するご案内・情報提供</li>
                <li>サービスの改善・新サービスの開発</li>
                <li>利用規約に違反した利用者への対応</li>
                <li>その他、上記利用目的に付随する目的</li>
              </ul>
            </div>

            <div className="privacy-section">
              <h2>4. 個人情報の第三者提供</h2>
              <p>
                当社は、以下の場合を除き、お客様の同意なく個人情報を第三者に提供することはありません。
              </p>
              <ul>
                <li>法令に基づく場合</li>
                <li>人の生命、身体または財産の保護のために必要がある場合</li>
                <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
                <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合</li>
              </ul>
            </div>

            <div className="privacy-section">
              <h2>5. 個人情報の安全管理</h2>
              <p>
                当社は、個人情報の紛失、破壊、改ざん及び漏洩などを防止するため、適切なセキュリティ対策を実施し、個人情報の安全管理に努めます。
              </p>
            </div>

            <div className="privacy-section">
              <h2>6. 個人情報の開示・訂正・削除</h2>
              <p>
                お客様は、当社が保有するご自身の個人情報について、開示・訂正・削除を請求することができます。ご希望の場合は、下記のお問い合わせ先までご連絡ください。本人確認の上、合理的な期間内に対応いたします。
              </p>
            </div>

            <div className="privacy-section">
              <h2>7. Cookieの使用について</h2>
              <p>
                当社のウェブサイトでは、サービスの利便性向上のためCookieを使用することがあります。Cookieの使用を希望されない場合は、ブラウザの設定によりCookieを無効にすることができます。ただし、Cookieを無効にした場合、一部のサービスをご利用いただけなくなる場合があります。
              </p>
            </div>

            <div className="privacy-section">
              <h2>8. プライバシーポリシーの変更</h2>
              <p>
                当社は、必要に応じて本プライバシーポリシーを変更することがあります。変更した場合は、当ウェブサイトに掲載することによりお知らせいたします。
              </p>
            </div>

            <div className="privacy-section">
              <h2>9. お問い合わせ窓口</h2>
              <p>本プライバシーポリシーに関するお問い合わせは、下記までお願いいたします。</p>
              <div className="privacy-contact">
                <p>
                  <strong>株式会社SHIKAKERU</strong><br />
                  〒910-0017 福井県福井市文京2-26-2<br />
                  メール：team.shikakeru@gmail.com
                </p>
              </div>
            </div>

            <div className="privacy-footer">
              <p>制定日：2025年1月1日</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
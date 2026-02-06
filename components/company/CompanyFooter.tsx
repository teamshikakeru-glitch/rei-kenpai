import Link from "next/link";

export default function CompanyFooter() {
  return (
    <footer className="co-footer">
      <div className="co-footer-inner">
        <div className="co-footer-grid">
          <div className="co-footer-brand">
            <div className="co-logo" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div className="co-logo-mark">礼</div>
              <div className="co-logo-text" style={{ color: "rgba(255,255,255,0.8)" }}>
                SHIKAKERU
              </div>
            </div>
            <p>生きる仕掛けを。</p>
            <div className="co-footer-contact-info">
              〒910-0017<br />
              福井県福井市文京2-26-2
            </div>
          </div>
          <div className="co-footer-col">
            <h4>サービス</h4>
            <Link href="/company/service/rei">礼（Rei）</Link>
            <Link href="/company/service/rei-custom">礼カスタム</Link>
          </div>
          <div className="co-footer-col">
            <h4>会社</h4>
            <Link href="/company/about">会社概要</Link>
            <Link href="/company/contact">お問い合わせ</Link>
          </div>
          <div className="co-footer-col">
            <h4>その他</h4>
            <Link href="/company/privacy">プライバシーポリシー</Link>
            <Link href="/terms">利用規約</Link>
          </div>
        </div>
        <div className="co-footer-bottom">
          <span>&copy; 2025 株式会社SHIKAKERU All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  );
}
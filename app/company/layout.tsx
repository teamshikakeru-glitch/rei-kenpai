import type { Metadata } from "next";
import CompanyHeader from "@/components/company/CompanyHeader";
import CompanyFooter from "@/components/company/CompanyFooter";
import RevealObserver from "@/components/company/RevealObserver";
import "./company.css";

export const metadata: Metadata = {
  title: {
    template: "%s｜株式会社SHIKAKERU",
    default: "株式会社SHIKAKERU｜葬儀業界のデジタル革新パートナー",
  },
  description:
    "株式会社SHIKAKERUは、遠隔献杯システム「礼（Rei）」を提供。導入企業様には葬儀社向け業務システム「礼カスタム」もご用意。テクノロジーで弔いの文化を守り、進化させます。",
};

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap"
        rel="stylesheet"
      />

      <div
        style={{
          fontFamily: "var(--font-sans)",
          background: "var(--color-bg)",
          color: "var(--color-text)",
          lineHeight: 1.8,
          fontSize: "15px",
          overflowX: "hidden",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <CompanyHeader />
        <main>{children}</main>
        <CompanyFooter />
        <RevealObserver />
      </div>
    </>
  );
}
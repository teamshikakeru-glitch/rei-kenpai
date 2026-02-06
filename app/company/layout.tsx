import type { Metadata } from "next";
import CompanyHeader from "@/components/company/CompanyHeader";
import CompanyFooter from "@/components/company/CompanyFooter";
import RevealObserver from "@/components/company/RevealObserver";
import "./company.css";

export const metadata: Metadata = {
  title: {
    template: "%s｜株式会社SHIKAKERU",
    default: "株式会社SHIKAKERU｜人生が動くきっかけを、仕掛ける。",
  },
  description:
    "SHIKAKERUは、人・土地・組織の感情と行動が動き出す仕掛けを設計する会社です。遠隔献杯システム「礼（Rei）」を提供しています。",
  openGraph: {
    title: "株式会社SHIKAKERU｜人生が動くきっかけを、仕掛ける。",
    description: "SHIKAKERUは、人・土地・組織の感情と行動が動き出す仕掛けを設計する会社です。",
    url: "https://rei-kenpai-b3z8.vercel.app/company",
    siteName: "株式会社SHIKAKERU",
    images: [
      {
        url: "https://rei-kenpai-b3z8.vercel.app/shikakeru-logo.jpg",
        width: 1200,
        height: 630,
        alt: "SHIKAKERU",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "株式会社SHIKAKERU｜人生が動くきっかけを、仕掛ける。",
    description: "SHIKAKERUは、人・土地・組織の感情と行動が動き出す仕掛けを設計する会社です。",
    images: ["https://rei-kenpai-b3z8.vercel.app/shikakeru-logo.jpg"],
  },
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
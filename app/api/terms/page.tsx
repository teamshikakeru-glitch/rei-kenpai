import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "利用規約｜礼（Rei）遠隔献杯システム",
  description: "礼（Rei）遠隔献杯システムの利用規約です。",
};

export default function TermsPage() {
  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#FAFAF7", 
      padding: "120px 24px 80px",
      fontFamily: "'Noto Sans JP', sans-serif"
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ 
          fontSize: "28px", 
          fontWeight: "400", 
          marginBottom: "48px",
          fontFamily: "'Noto Serif JP', serif"
        }}>
          利用規約
        </h1>

        <div style={{ fontSize: "14px", color: "#5C5C5C", lineHeight: "2" }}>
          <section style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "500", color: "#1A1A1A", marginBottom: "16px" }}>
              1. 本規約の適用
            </h2>
            <p>
              本利用規約（以下「本規約」といいます）は、株式会社SHIKAKERU（以下「当社」といいます）が提供する遠隔献杯システム「礼（Rei）」（以下「本サービス」といいます）の利用に関する条件を定めるものです。本サービスを利用するすべての方（以下「利用者」といいます）は、本規約に同意したものとみなされます。
            </p>
          </section>

          <section style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "500", color: "#1A1A1A", marginBottom: "16px" }}>
              2. サービスの内容
            </h2>
            <p>
              本サービスは、葬儀に参列できない方がオンラインで香典（献杯）とメッセージを届けることができるシステムです。利用者は、本サービスを通じて故人への弔意を表すことができます。
            </p>
          </section>

          <section style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "500", color: "#1A1A1A", marginBottom: "16px" }}>
              3. 献杯（送金）について
            </h2>
            <p style={{ marginBottom: "16px" }}>
              献杯（送金）は、クレジットカード決済により行われます。決済完了後のキャンセル・返金は原則としてお受けできません。
            </p>
            <p>
              献杯金額から所定の手数料（11.6%）を差し引いた金額が遺族に届けられます。手数料の内訳は、カード決済手数料3.6%およびシステム利用料8.0%です。
            </p>
          </section>

          <section style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "500", color: "#1A1A1A", marginBottom: "16px" }}>
              4. メッセージ内容について
            </h2>
            <p>
              献杯時にご入力いただいたメッセージ内容について、当社は一切の責任を負いません。不適切な表現が確認された場合、葬儀社またはご遺族様の判断により、メッセージが非表示となる場合がございます。
            </p>
          </section>

          <section style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "500", color: "#1A1A1A", marginBottom: "16px" }}>
              5. 個人情報の取り扱い
            </h2>
            <p>
              取得した個人情報は、献杯の受付・清算・リスト作成の目的にのみ利用いたします。上記目的以外での利用、および第三者への提供は行いません。詳細は<Link href="/company/privacy" style={{ color: "#2C4A3E" }}>プライバシーポリシー</Link>をご確認ください。
            </p>
          </section>

          <section style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "500", color: "#1A1A1A", marginBottom: "16px" }}>
              6. 免責事項
            </h2>
            <p style={{ marginBottom: "16px" }}>
              システム障害・通信環境等により、一時的にサービスをご利用いただけない場合がございます。
            </p>
            <p>
              当社は、本サービスの中断、停止、終了、利用不能、または変更等により生じた損害について、一切の責任を負わないものといたします。
            </p>
          </section>

          <section style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "500", color: "#1A1A1A", marginBottom: "16px" }}>
              7. 規約の変更
            </h2>
            <p>
              当社は、必要に応じて本規約を変更することがあります。変更後の規約は、本ウェブサイトに掲載した時点で効力を生じるものとします。
            </p>
          </section>

          <section style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "500", color: "#1A1A1A", marginBottom: "16px" }}>
              8. 準拠法・管轄裁判所
            </h2>
            <p>
              本規約は日本法に準拠し、本サービスに関する紛争については、福井地方裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
          </section>
        </div>

        <div style={{ 
          marginTop: "48px", 
          paddingTop: "32px", 
          borderTop: "1px solid #E5E2DB",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <p style={{ fontSize: "13px", color: "#8A8A8A" }}>最終更新日：2025年1月1日</p>
          <Link 
            href="/company" 
            style={{ 
              fontSize: "14px", 
              color: "#2C4A3E", 
              textDecoration: "none" 
            }}
          >
            ← トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
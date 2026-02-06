'use client';

export default function TermsPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(160deg, #faf9f7 0%, #f0eeeb 100%)',
      padding: '2rem 1rem'
    }}>
      <style jsx>{`
        .terms-container {
          max-width: 800px;
          margin: 0 auto;
        }
        .terms-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .terms-logo {
          width: 60px;
          height: 60px;
          background: linear-gradient(145deg, #c9a227 0%, #8b6914 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          font-weight: 700;
          color: white;
          margin: 0 auto 1rem;
          box-shadow: 0 4px 12px rgba(184, 134, 11, 0.3);
        }
        .terms-title {
          font-size: 1.75rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }
        .terms-subtitle {
          font-size: 0.9rem;
          color: #666;
        }
        .terms-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
          overflow: hidden;
          margin-bottom: 1.5rem;
        }
        .terms-section {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #f0f0f0;
        }
        .terms-section:last-child {
          border-bottom: none;
        }
        .section-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #1e3a5f 0%, #2c4a6e 100%);
          color: white;
          border-radius: 50%;
          font-size: 0.8rem;
          font-weight: 600;
          margin-right: 0.75rem;
        }
        .section-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
        }
        .section-content {
          color: #444;
          font-size: 0.95rem;
          line-height: 1.8;
        }
        .section-content p {
          margin-bottom: 0.75rem;
        }
        .section-content p:last-child {
          margin-bottom: 0;
        }
        .highlight-box {
          background: #f8f7f5;
          border-left: 3px solid #c9a227;
          padding: 1rem 1.25rem;
          margin: 1rem 0;
          border-radius: 0 8px 8px 0;
        }
        .highlight-box p {
          margin: 0;
          font-size: 0.9rem;
        }
        .terms-footer {
          text-align: center;
          padding: 2rem;
          color: #888;
          font-size: 0.85rem;
        }
        .back-link {
          display: inline-block;
          margin-top: 1rem;
          color: #1e3a5f;
          text-decoration: none;
          font-weight: 500;
        }
        .back-link:hover {
          text-decoration: underline;
        }
        @media (max-width: 768px) {
          .terms-section {
            padding: 1.25rem 1.5rem;
          }
          .terms-title {
            font-size: 1.5rem;
          }
          .section-title {
            font-size: 1rem;
          }
          .section-content {
            font-size: 0.9rem;
          }
        }
      `}</style>

      <div className="terms-container">
        <div className="terms-header">
          <div className="terms-logo">礼</div>
          <h1 className="terms-title">利用規約</h1>
          <p className="terms-subtitle">Rei 献杯管理システム</p>
        </div>

        <div className="terms-card">
          {/* 第1条：資金の位置づけ */}
          <div className="terms-section">
            <h2 className="section-title">
              <span className="section-number">1</span>
              献杯金の位置づけ
            </h2>
            <div className="section-content">
              <div className="highlight-box">
                <p>本サービスを通じてお預かりする献杯金は、葬儀社および遺族に帰属する支援金であり、当社はその決済および清算を代行する立場にあります。</p>
              </div>
              <p>当社は献杯金の収納代行として、支援者様からのご入金を一時的にお預かりし、所定の手数料を差し引いた金額を葬儀社を通じてご遺族様へお届けいたします。</p>
            </div>
          </div>

          {/* 第2条：返金・キャンセル */}
          <div className="terms-section">
            <h2 className="section-title">
              <span className="section-number">2</span>
              返金・キャンセルについて
            </h2>
            <div className="section-content">
              <div className="highlight-box">
                <p>献杯金の性質上、決済完了後のキャンセル・返金は原則としてお受けできません。</p>
              </div>
              <p>ご入力いただいた内容（お名前・金額・メッセージ）は、決済完了後に変更することができません。</p>
              <p>送信前に内容を十分にご確認いただきますようお願いいたします。</p>
            </div>
          </div>

          {/* 第3条：サービスの性質 */}
          <div className="terms-section">
            <h2 className="section-title">
              <span className="section-number">3</span>
              サービスの性質
            </h2>
            <div className="section-content">
              <div className="highlight-box">
                <p>本サービスは、宗教的儀式・供養行為そのものを提供するものではありません。</p>
              </div>
              <p>本サービスは、故人様へのお気持ちを金銭的な形でお届けするための決済・清算代行サービスです。</p>
            </div>
          </div>

          {/* 第4条：メッセージ内容 */}
          <div className="terms-section">
            <h2 className="section-title">
              <span className="section-number">4</span>
              メッセージ内容について
            </h2>
            <div className="section-content">
              <div className="highlight-box">
                <p>献杯時にご入力いただいたメッセージ内容について、当社は一切の責任を負いません。</p>
              </div>
              <p>不適切な表現が確認された場合、葬儀社またはご遺族様の判断により、メッセージが非表示となる場合がございます。</p>
            </div>
          </div>

          {/* 第5条：個人情報 */}
          <div className="terms-section">
            <h2 className="section-title">
              <span className="section-number">5</span>
              個人情報の取り扱い
            </h2>
            <div className="section-content">
              <div className="highlight-box">
                <p>取得した個人情報は、献杯の受付・清算・リスト作成の目的にのみ利用いたします。</p>
              </div>
              <p>上記目的以外での利用、および第三者への提供は行いません。</p>
            </div>
          </div>

          {/* 第6条：免責事項 */}
          <div className="terms-section">
            <h2 className="section-title">
              <span className="section-number">6</span>
              免責事項
            </h2>
            <a href="/company" className="back-link">← トップページに戻る</a>
              <div className="highlight-box">
                <p>システム障害・通信環境等により、一時的にサービスをご利用いただけない場合がございます。</p>
              </div>
              <p>当社は、本サービスの中断、停止、終了、利用不能、または変更等により生じた損害について、一切の責任を負わないものといたします。</p>
            </div>
          </div>
        </div>

        <div className="terms-footer">
          <p>最終更新日：2026年1月13日</p>
          <a href="/company" className="back-link">← トップページに戻る</a>
        </div>
      </div>
    </div>
  );
}
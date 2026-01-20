'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function FamilyPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [project, setProject] = useState<any>(null);
  const [kenpaiList, setKenpaiList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const supabase = createClient();

  // プロジェクト情報を取得（パスワード認証前）
  useEffect(() => {
    const fetchProject = async () => {
      if (!slug) return;
      
      const { data: projectData, error } = await supabase
        .from('projects')
        .select('id, deceased_name, slug, family_password')
        .eq('slug', slug)
        .single();
      
      if (error || !projectData) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      
      setProject(projectData);
      
      // セッションストレージで認証状態を確認
      const savedAuth = sessionStorage.getItem(`family_auth_${slug}`);
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
        await fetchKenpaiData(projectData.id);
      }
      
      setLoading(false);
    };
    
    fetchProject();
  }, [slug]);

  // 献杯データを取得
  const fetchKenpaiData = async (projectId: string) => {
    const { data: kenpaiData } = await supabase
      .from('kenpai')
      .select('id, donor_name, amount, message, is_anonymous, created_at')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    setKenpaiList(kenpaiData || []);
  };

  // パスワード認証
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!password) {
      setError('パスワードを入力してください');
      return;
    }
    
    if (password === project.family_password) {
      setIsAuthenticated(true);
      sessionStorage.setItem(`family_auth_${slug}`, 'true');
      await fetchKenpaiData(project.id);
    } else {
      setError('パスワードが正しくありません');
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  };

  const formatDateTime = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const totalAmount = kenpaiList.reduce((sum, k) => sum + (k.amount || 0), 0);

  // ローディング
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #faf8f5 0%, #f5f0e8 100%)' }}>
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ width: '48px', height: '48px', border: '3px solid #e8e4dc', borderTopColor: '#c9a227', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  // 404
  if (notFound || !project) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #faf8f5 0%, #f5f0e8 100%)', fontFamily: '"Noto Serif JP", serif' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '64px', marginBottom: '16px', color: '#d4cfc4' }}>404</p>
          <p style={{ color: '#888' }}>ページが見つかりません</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #faf8f5 0%, #f5f0e8 100%)', fontFamily: '"Noto Serif JP", "Hiragino Mincho ProN", serif' }}>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.5s ease-out; }
        .fade-in-up { animation: fadeInUp 0.6s ease-out; }
        .input-focus:focus {
          outline: none;
          border-color: #c9a227 !important;
          box-shadow: 0 0 0 4px rgba(201,162,39,0.1);
        }
      `}</style>

      {/* ヘッダー */}
      <header style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #c9a227 0%, #d4af37 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(201,162,39,0.3)',
          }}>礼</div>
          <span style={{ color: 'white', fontSize: '18px', fontWeight: '500', letterSpacing: '0.1em' }}>Rei</span>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', letterSpacing: '0.15em' }}>ご遺族様専用</span>
      </header>

      <main style={{ maxWidth: '520px', margin: '0 auto', padding: '24px 16px 40px' }}>
        
        {/* タイトル */}
        <div className="fade-in-up" style={{
          background: 'white',
          borderRadius: '24px',
          padding: '32px 24px',
          marginBottom: '24px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '12px', color: '#c9a227', letterSpacing: '0.3em', marginBottom: '12px' }}>
            ✦ 入金状況確認 ✦
          </p>
          <h1 style={{ fontSize: '24px', fontWeight: '500', color: '#1a1a1a', marginBottom: '8px', letterSpacing: '0.05em' }}>
            故 {project.deceased_name} 様
          </h1>
          <p style={{ fontSize: '13px', color: '#888' }}>
            献杯いただいた皆様からのお気持ち
          </p>
        </div>

        {/* パスワード認証画面 */}
        {!isAuthenticated ? (
          <div className="fade-in" style={{
            background: 'white',
            borderRadius: '24px',
            padding: '32px 24px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '500', color: '#1a1a1a', textAlign: 'center', marginBottom: '8px' }}>
              パスワードを入力
            </h2>
            <p style={{ fontSize: '13px', color: '#888', textAlign: 'center', marginBottom: '24px' }}>
              葬儀社よりお知らせしたパスワードをご入力ください
            </p>

            {error && (
              <div style={{
                marginBottom: '20px',
                padding: '14px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '12px',
                color: '#dc2626',
                fontSize: '13px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワード"
                className="input-focus"
                style={{
                  width: '100%',
                  padding: '18px',
                  border: '2px solid #e8e4dc',
                  borderRadius: '14px',
                  fontSize: '18px',
                  textAlign: 'center',
                  letterSpacing: '0.2em',
                  boxSizing: 'border-box',
                  marginBottom: '20px',
                }}
              />
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '18px',
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                }}
              >
                確認する
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* 合計金額 */}
            <div className="fade-in" style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
              borderRadius: '20px',
              padding: '28px 24px',
              marginBottom: '24px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                皆様からのお気持ち（合計）
              </p>
              <p style={{ fontSize: '42px', fontWeight: '600', color: '#c9a227', letterSpacing: '0.02em', marginBottom: '8px' }}>
                ¥{totalAmount.toLocaleString()}
              </p>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                {kenpaiList.length}名の方々より
              </p>
            </div>

            {/* 手数料の説明 */}
            <div className="fade-in" style={{
              background: '#fffbf0',
              border: '1px solid #f0e6c8',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '24px',
            }}>
              <p style={{ fontSize: '13px', color: '#92400e', lineHeight: '1.8' }}>
                ※ 決済手数料（3.6%）およびシステム利用料（8%）を差し引いた金額が葬儀費用に充当されます。<br />
                <span style={{ fontWeight: '600' }}>お受け取り目安：約¥{Math.floor(totalAmount * 0.884).toLocaleString()}</span>
              </p>
            </div>

            {/* 献杯者一覧 */}
            <div className="fade-in-up" style={{
              background: 'white',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #f8f6f2 0%, #f0ebe3 100%)',
                padding: '20px 24px',
                borderBottom: '1px solid #e8e4dc',
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '500', color: '#1a1a1a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#c9a227' }}>✦</span>
                  献杯いただいた皆様
                  <span style={{ marginLeft: 'auto', fontSize: '13px', color: '#888', fontWeight: '400' }}>
                    全{kenpaiList.length}件
                  </span>
                </h3>
              </div>

              {kenpaiList.length === 0 ? (
                <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                  <p style={{ fontSize: '14px', color: '#999' }}>まだ献杯はありません</p>
                </div>
              ) : (
                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  {kenpaiList.map((item, index) => (
                    <div
                      key={item.id}
                      style={{
                        padding: '20px 24px',
                        borderBottom: index < kenpaiList.length - 1 ? '1px solid #f0ebe3' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: item.message ? '12px' : 0 }}>
                        <div>
                          <p style={{ fontSize: '16px', fontWeight: '500', color: '#1a1a1a', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {item.is_anonymous || item.donor_name === '匿名' ? (
                              <>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '28px',
                                  height: '28px',
                                  background: '#e8e4dc',
                                  borderRadius: '50%',
                                  fontSize: '12px',
                                  color: '#888',
                                }}>匿</span>
                                匿名の方
                              </>
                            ) : (
                              <>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '28px',
                                  height: '28px',
                                  background: 'linear-gradient(135deg, #c9a227 0%, #d4af37 100%)',
                                  borderRadius: '50%',
                                  color: 'white',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                }}>{item.donor_name.charAt(0)}</span>
                                {item.donor_name} 様
                              </>
                            )}
                          </p>
                          <p style={{ fontSize: '12px', color: '#999' }}>{formatDateTime(item.created_at)}</p>
                        </div>
                        <p style={{ fontSize: '18px', fontWeight: '600', color: '#c9a227' }}>
                          ¥{item.amount.toLocaleString()}
                        </p>
                      </div>

                      {item.message && (
                        <div style={{
                          background: '#faf9f7',
                          borderRadius: '12px',
                          padding: '14px 16px',
                          marginTop: '8px',
                        }}>
                          <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.8', margin: 0 }}>{item.message}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* フッター */}
        <footer style={{ textAlign: 'center', padding: '32px 16px' }}>
          <a href={`/${slug}`} style={{ fontSize: '13px', color: '#888', textDecoration: 'none' }}>
            ← 献杯ページに戻る
          </a>
          <p style={{ marginTop: '20px', fontSize: '11px', color: '#ccc' }}>
            Powered by Rei © 2026 SHIKAKERU Inc.
          </p>
        </footer>
      </main>
    </div>
  );
}
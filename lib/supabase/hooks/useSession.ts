'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// セッションの有効期限（ミリ秒）- 2時間
const SESSION_TIMEOUT = 2 * 60 * 60 * 1000;
// 警告を表示する残り時間（ミリ秒）- 5分前
const WARNING_BEFORE = 5 * 60 * 1000;

interface SessionData {
  funeral_home_id: string;
  funeral_home_name: string;
  loginTime: number;
  lastActivity: number;
}

export function useSession() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // セッションを更新（アクティビティがあったとき）
  const updateActivity = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const data = sessionStorage.getItem('session_data');
    if (data) {
      const parsed = JSON.parse(data);
      parsed.lastActivity = Date.now();
      sessionStorage.setItem('session_data', JSON.stringify(parsed));
      setShowWarning(false);
    }
  }, []);

  // ログアウト処理
  const logout = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    sessionStorage.removeItem('funeral_home_id');
    sessionStorage.removeItem('funeral_home_name');
    sessionStorage.removeItem('session_data');
    setIsAuthenticated(false);
    setSessionData(null);
    router.push('/');
  }, [router]);

  // セッションを延長
  const extendSession = useCallback(() => {
    updateActivity();
    setShowWarning(false);
  }, [updateActivity]);

  // 初期化とセッションチェック
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkSession = () => {
      const funeralHomeId = sessionStorage.getItem('funeral_home_id');
      const funeralHomeName = sessionStorage.getItem('funeral_home_name');
      let data = sessionStorage.getItem('session_data');

      if (!funeralHomeId || !funeralHomeName) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // session_dataがない場合は作成（既存ユーザー対応）
      if (!data) {
        const newSessionData: SessionData = {
          funeral_home_id: funeralHomeId,
          funeral_home_name: funeralHomeName,
          loginTime: Date.now(),
          lastActivity: Date.now()
        };
        sessionStorage.setItem('session_data', JSON.stringify(newSessionData));
        data = JSON.stringify(newSessionData);
      }

      const parsed: SessionData = JSON.parse(data);
      const now = Date.now();
      const timeSinceActivity = now - parsed.lastActivity;
      const remaining = SESSION_TIMEOUT - timeSinceActivity;

      // セッション期限切れ
      if (remaining <= 0) {
        logout();
        return;
      }

      // 警告表示（残り5分以下）
      if (remaining <= WARNING_BEFORE) {
        setShowWarning(true);
        setRemainingTime(Math.ceil(remaining / 1000 / 60)); // 分単位
      } else {
        setShowWarning(false);
      }

      setSessionData(parsed);
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    // 初回チェック
    checkSession();

    // 1分ごとにセッションをチェック
    const interval = setInterval(checkSession, 60 * 1000);

    // ユーザーアクティビティを監視
    const handleActivity = () => {
      updateActivity();
    };

    window.addEventListener('click', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('scroll', handleActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [logout, updateActivity]);

  return {
    isAuthenticated,
    isLoading,
    sessionData,
    showWarning,
    remainingTime,
    logout,
    extendSession,
    updateActivity
  };
}

// ログイン時にセッションを作成する関数
export function createSession(funeralHomeId: string, funeralHomeName: string) {
  if (typeof window === 'undefined') return;
  
  const sessionData: SessionData = {
    funeral_home_id: funeralHomeId,
    funeral_home_name: funeralHomeName,
    loginTime: Date.now(),
    lastActivity: Date.now()
  };
  
  sessionStorage.setItem('funeral_home_id', funeralHomeId);
  sessionStorage.setItem('funeral_home_name', funeralHomeName);
  sessionStorage.setItem('session_data', JSON.stringify(sessionData));
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CompanyHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.pageYOffset > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    document.body.style.overflow = !menuOpen ? "hidden" : "";
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <>
      <header className={`co-header ${scrolled ? "scrolled" : ""}`}>
        <div className="co-header-inner">
          <Link href="/company" className="co-logo">
            <div className="co-logo-mark">礼</div>
            <div className="co-logo-text">SHIKAKERU</div>
          </Link>
          <nav className="co-nav">
            <Link href="/company/service/rei">礼（Rei）</Link>
            <Link href="/company/service/rei-custom">礼カスタム</Link>
            <Link href="/company/cases">導入事例</Link>
            <Link href="/company/blog">コラム</Link>
            <Link href="/company/about">会社概要</Link>
            <Link href="/company/contact" className="co-nav-cta">
              お問い合わせ
            </Link>
          </nav>
          <button
            className={`co-menu-toggle ${menuOpen ? "active" : ""}`}
            onClick={toggleMenu}
            aria-label="メニュー"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <div className={`co-mobile-nav ${menuOpen ? "open" : ""}`}>
        <Link href="/company/service/rei" onClick={closeMenu}>礼（Rei）</Link>
        <Link href="/company/service/rei-custom" onClick={closeMenu}>礼カスタム</Link>
        <Link href="/company/cases" onClick={closeMenu}>導入事例</Link>
        <Link href="/company/blog" onClick={closeMenu}>コラム</Link>
        <Link href="/company/about" onClick={closeMenu}>会社概要</Link>
        <Link href="/company/contact" className="co-nav-cta-mobile" onClick={closeMenu}>
          お問い合わせ
        </Link>
      </div>
    </>
  );
}
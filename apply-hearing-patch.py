#!/usr/bin/env python3
"""
=== 営業ポータルにヒアリングフォーム共有機能を追加 ===

【使い方】
  cd smart-kenpai-v2
  python3 apply-hearing-patch.py public/sales-portal.html

※ 元ファイルのバックアップが自動で作成されます
※ 失敗した場合は .bak ファイルで復元できます
"""
import sys, os, shutil

if len(sys.argv) < 2:
    print("使い方: python3 apply-hearing-patch.py public/sales-portal.html")
    sys.exit(1)

filepath = sys.argv[1]
if not os.path.exists(filepath):
    print(f"エラー: {filepath} が見つかりません")
    sys.exit(1)

# バックアップ作成
backup = filepath + '.bak'
shutil.copy2(filepath, backup)
print(f"📁 バックアップ作成: {backup}")

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

print(f"📄 読み込み: {len(content)} 文字")

# ===== パッチ1: 「その他」ページにヒアリングカードを追加 =====
HEARING_CARD = '''      <!-- ヒアリングフォーム共有カード -->
      <div class="card" style="background:linear-gradient(135deg, #b8941f 0%, #d4a827 50%, #c9a227 100%); color:white; margin-bottom:1rem; border-radius:16px;">
        <div class="card-body" style="padding:1.25rem;">
          <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem;">
            <div style="font-size:2rem;">📋</div>
            <div>
              <div style="font-size:1.1rem; font-weight:700;">ヒアリングフォーム</div>
              <div style="font-size:0.8rem; opacity:0.9;">葬儀社にすぐ送れます</div>
            </div>
          </div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button onclick="shareHearingLine()" style="flex:1; min-width:80px; padding:0.7rem; border:none; border-radius:10px; background:#06C755; color:white; font-weight:600; font-size:0.85rem; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:0.4rem;">
              <span>💬</span> LINE
            </button>
            <button onclick="shareHearingEmail()" style="flex:1; min-width:80px; padding:0.7rem; border:none; border-radius:10px; background:#4285F4; color:white; font-weight:600; font-size:0.85rem; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:0.4rem;">
              <span>✉️</span> メール
            </button>
            <button onclick="copyHearingUrl()" id="copyHearingBtn" style="flex:1; min-width:80px; padding:0.7rem; border:none; border-radius:10px; background:rgba(255,255,255,0.25); color:white; font-weight:600; font-size:0.85rem; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:0.4rem;">
              <span>🔗</span> URLコピー
            </button>
          </div>
          <div style="margin-top:0.75rem; font-size:0.75rem; opacity:0.8; text-align:center;">💡 商談後のフォローや事前調査にご活用ください</div>
        </div>
      </div>

'''

# パターン: 「その他」ページの最初の<div class="card">を探す
marker = '    <!-- その他 -->\n    <div class="page" id="page-more">\n      <div class="card">'
if marker in content:
    replacement = '    <!-- その他 -->\n    <div class="page" id="page-more">\n' + HEARING_CARD + '      <div class="card">'
    content = content.replace(marker, replacement, 1)
    print("✅ パッチ1: ヒアリングカードHTML追加OK")
else:
    print("❌ パッチ1: 「その他」ページのパターンが見つかりません")
    print("   手動で追加が必要です")

# ===== パッチ2: JavaScript関数を追加 =====
HEARING_JS = """
// ==================== ヒアリングフォーム共有機能 ====================
var HEARING_FORM_URL = 'https://rei-kenpai-b3z8.vercel.app/hearing-form.html';

function shareHearingLine() {
  var text = '【礼カスタム】業務に関する簡単なアンケートのお願い\\\\n\\\\nお忙しいところ恐れ入りますが、御社の業務についてお聞かせください。\\\\n5分程度・選択式が中心です。\\\\n\\\\n▼ こちらからお願いします\\\\n' + HEARING_FORM_URL;
  var lineUrl = 'https://line.me/R/share?text=' + encodeURIComponent(text);
  window.open(lineUrl, '_blank');
}

function shareHearingEmail() {
  var subject = '【礼カスタム】業務に関する簡単なアンケートのお願い';
  var body = 'お世話になっております。\\\\n先日はお時間をいただきありがとうございました。\\\\n\\\\n御社の業務について、簡単なアンケートにご協力いただけますでしょうか。\\\\n5分程度で完了いたします。選択式が中心ですので、お気軽にお答えください。\\\\n\\\\n▼ アンケートはこちら\\\\n' + HEARING_FORM_URL + '\\\\n\\\\n正解・不正解はございません。\\\\n率直なお声をお聞かせいただけますと幸いです。\\\\n\\\\nどうぞよろしくお願いいたします。';
  window.location.href = 'mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
}

function copyHearingUrl() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(HEARING_FORM_URL).then(function() {
      showHearingCopySuccess();
    }).catch(function() { fallbackHearingCopy(); });
  } else {
    fallbackHearingCopy();
  }
}

function fallbackHearingCopy() {
  var ta = document.createElement('textarea');
  ta.value = HEARING_FORM_URL;
  ta.style.cssText = 'position:fixed;left:-9999px;';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); showHearingCopySuccess(); }
  catch(e) { alert('URL:\\\\n' + HEARING_FORM_URL); }
  document.body.removeChild(ta);
}

function showHearingCopySuccess() {
  var btn = document.getElementById('copyHearingBtn');
  if (!btn) return;
  var orig = btn.innerHTML;
  btn.innerHTML = '<span>✅</span> コピー済み！';
  btn.style.background = 'rgba(40,167,69,0.5)';
  setTimeout(function() { btn.innerHTML = orig; btn.style.background = 'rgba(255,255,255,0.25)'; }, 2000);
}
"""

if '</script>' in content:
    content = content.replace('</script>', HEARING_JS + '\n</script>', 1)
    print("✅ パッチ2: JavaScript関数追加OK")
else:
    print("❌ パッチ2: </script>タグが見つかりません")

# 保存
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n🎉 パッチ適用完了: {filepath}")
print(f"📁 バックアップ: {backup}")
print()
print("デプロイコマンド:")
print(f"  git add {filepath}")
print('  git commit -m "営業ポータルにヒアリングフォーム共有機能を追加"')
print("  git push")
print()
print("⚠️  注意: このスクリプト自体はデプロイしないでください！")
print("    sales-portal.html だけをデプロイしてください。")
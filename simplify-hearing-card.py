#!/usr/bin/env python3
"""
=== ヒアリングフォームカードをシンプル化（URLコピーのみ） ===

【使い方】
  cd smart-kenpai-v2
  python3 simplify-hearing-card.py public/sales-portal.html

※ 元ファイルのバックアップが自動で作成されます
"""
import sys, os, shutil

if len(sys.argv) < 2:
    print("使い方: python3 simplify-hearing-card.py public/sales-portal.html")
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

# ===== パッチ1: 既存の3ボタンカードを1ボタン（URLコピーのみ）に置き換え =====

# 既存カードを検出するパターン（前回パッチで追加した部分）
old_card_start = '      <!-- ヒアリングフォーム共有カード -->'
old_card_end_marker = '💡 商談後のフォローや事前調査にご活用ください</div>'

if old_card_start in content and old_card_end_marker in content:
    # 既存カード全体を特定
    start_idx = content.index(old_card_start)
    # カードの終了位置を見つける（</div>が3つ続く部分）
    end_search_start = content.index(old_card_end_marker) + len(old_card_end_marker)
    # 残りの閉じタグを見つける: </div></div></div> + 空行
    remaining = content[end_search_start:]
    close_count = 0
    end_offset = 0
    for i, ch in enumerate(remaining):
        if remaining[i:i+6] == '</div>':
            close_count += 1
            if close_count >= 3:
                end_offset = i + 6
                break
    
    # 改行も含める
    actual_end = end_search_start + end_offset
    while actual_end < len(content) and content[actual_end] in '\n\r ':
        actual_end += 1
    
    # 新しいシンプルカード
    new_card = '''      <!-- ヒアリングフォーム共有カード -->
      <div class="card" style="background:linear-gradient(135deg, #b8941f 0%, #d4a827 50%, #c9a227 100%); color:white; margin-bottom:1rem; border-radius:16px;">
        <div class="card-body" style="padding:1rem 1.25rem;">
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <div style="display:flex; align-items:center; gap:0.75rem;">
              <div style="font-size:1.5rem;">📋</div>
              <div>
                <div style="font-size:1rem; font-weight:700;">ヒアリングフォーム</div>
                <div style="font-size:0.75rem; opacity:0.85;">タップでリンクをコピー</div>
              </div>
            </div>
            <button onclick="copyHearingUrl()" id="copyHearingBtn" style="padding:0.6rem 1.2rem; border:none; border-radius:10px; background:rgba(255,255,255,0.25); color:white; font-weight:600; font-size:0.85rem; cursor:pointer; display:flex; align-items:center; gap:0.4rem;">
              <span>🔗</span> コピー
            </button>
          </div>
        </div>
      </div>

'''
    
    content = content[:start_idx] + new_card + content[actual_end:]
    print("✅ パッチ1: カードをシンプル化OK")
else:
    print("❌ パッチ1: 既存のヒアリングカードが見つかりません")
    print("   手動で修正が必要です")

# ===== パッチ2: 不要なJS関数を削除（LINE・メール関連） =====
# shareHearingLine と shareHearingEmail を削除、copyHearingUrl は残す

# LINE関数を削除
line_func_start = "function shareHearingLine()"
line_func_marker = "window.open(lineUrl, '_blank');"
if line_func_start in content and line_func_marker in content:
    # LINE関数の開始位置
    ls = content.index(line_func_start)
    # 関数終了の } を見つける
    le = content.index(line_func_marker) + len(line_func_marker)
    # 閉じ括弧と改行を見つける
    remaining = content[le:]
    for i, ch in enumerate(remaining):
        if ch == '}':
            le = le + i + 1
            break
    # 前後の改行も削除
    while ls > 0 and content[ls-1] == '\n':
        ls -= 1
    while le < len(content) and content[le] in '\n':
        le += 1
    content = content[:ls] + content[le:]
    print("✅ shareHearingLine関数 削除OK")

# メール関数を削除
email_func_start = "function shareHearingEmail()"
email_func_marker = "window.location.href = 'mailto:?"
if email_func_start in content and email_func_marker in content:
    es = content.index(email_func_start)
    em = content.index(email_func_marker)
    # この行の末尾を見つける
    line_end = content.index('\n', em)
    # 閉じ括弧を見つける
    remaining = content[line_end:]
    for i, ch in enumerate(remaining):
        if ch == '}':
            ee = line_end + i + 1
            break
    while es > 0 and content[es-1] == '\n':
        es -= 1
    while ee < len(content) and content[ee] in '\n':
        ee += 1
    content = content[:es] + content[ee:]
    print("✅ shareHearingEmail関数 削除OK")

# LINE/メール用の変数も削除
for var_name in ['HEARING_LINE_TEXT', 'HEARING_EMAIL_SUBJECT', 'HEARING_EMAIL_BODY']:
    if var_name in content:
        vs = content.index(f"var {var_name}")
        # 行末を見つける（;で終わる行、または複数行の場合は';まで）
        ve = content.index(';', vs) + 1
        while ve < len(content) and content[ve] in '\n':
            ve += 1
        while vs > 0 and content[vs-1] == '\n':
            vs -= 1
        content = content[:vs] + content[ve:]

# 保存
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n🎉 パッチ適用完了: {filepath}")
print(f"📁 バックアップ: {backup}")
print()
print("デプロイコマンド:")
print(f"  git add {filepath}")
print('  git commit -m "ヒアリングフォームカードをシンプル化（URLコピーのみ）"')
print("  git push")
print()
print("⚠️  注意: このスクリプト自体はデプロイしないでください！")
print("    sales-portal.html だけをデプロイしてください。")
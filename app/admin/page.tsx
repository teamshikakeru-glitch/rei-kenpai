import { createClient } from '@/lib/supabase/server'
import { createProject } from './actions'
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: funeralHome } = await supabase
    .from('funeral_homes')
    .select('*')
    .single()

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* ロゴアイコン */}
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-lg shrink-0">
              K
            </div>
            <h1 className="text-xl font-bold text-slate-800">Smart Kenpai</h1>
          </div>
          <div className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {funeralHome?.name || 'ログイン中...'}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* 左：入力フォーム */}
          <div className="md:col-span-5">
            <div className="bg-white rounded-lg shadow border border-slate-200 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
                ✏️ 新規案件の作成
              </h2>
              <p className="text-sm text-slate-500 mb-6">故人様のお名前を入力してください</p>
              
              <form action={createProject} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    故人様のお名前 <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="deceasedName"
                    type="text"
                    placeholder="（例）佐藤 一郎"
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-md focus:border-blue-500 focus:ring-0 outline-none transition-colors text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    URL用ID (半角英数) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="slug"
                      type="text"
                      placeholder="" 
                      required
                      className="w-full px-4 py-3 pl-20 bg-white border-2 border-slate-300 rounded-md focus:border-blue-500 focus:ring-0 outline-none transition-colors text-base font-mono"
                    />
                    {/* ID入力欄の左側に固定表示 */}
                    <div className="absolute left-3 top-3.5 text-slate-400 font-bold select-none text-sm">
                      /kenpai/
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    ※ ページのアドレスになります。例: sato-ichiro
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-md shadow transition-transform active:scale-95 text-base"
                >
                  ページを発行する
                </button>
              </form>
            </div>
          </div>

          {/* 右：リスト */}
          <div className="md:col-span-7">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">作成済みリスト</h2>
              <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded">
                {projects?.length || 0}件
              </span>
            </div>

            <div className="space-y-4">
              {projects && projects.length > 0 ? (
                projects.map((project) => (
                  <div key={project.id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        {project.deceased_name} 家
                        <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded border border-green-200">受付中</span>
                      </h3>
                      <p className="text-sm text-slate-500 font-mono mt-1">
                        ID: {project.slug}
                      </p>
                    </div>
                    <Link 
                      href={`/admin/${project.slug}`}
                      className="shrink-0 bg-blue-50 text-blue-700 font-bold border border-blue-200 px-4 py-2 rounded hover:bg-blue-100 transition-colors text-sm text-center"
                    >
                      QRコード発行 &rarr;
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
                  <p className="text-slate-500 font-bold">まだ案件がありません</p>
                  <p className="text-slate-400 text-sm mt-1">左のフォームから作成してください</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
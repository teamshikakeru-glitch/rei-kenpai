import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  
  const supabase = await createClient()

  // 案件データを取得
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!project) return <div>案件が見つかりません</div>

  // 本番で遺族に渡すURL（まだ開発中なのでlocalhost）
  const kenpaiUrl = `http://localhost:3000/kenpai/${project.slug}`
  
  // QRコード生成APIのURL（Google等のAPIを利用して画像を生成）
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${kenpaiUrl}`

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow border border-gray-200">
        
        {/* 戻るボタン */}
        <Link href="/admin" className="text-gray-500 hover:text-gray-800 mb-6 inline-flex items-center gap-1 font-bold">
          &larr; 一覧に戻る
        </Link>

        <h1 className="text-3xl font-bold mb-2">{project.deceased_name} 家 専用ページ</h1>
        <p className="text-gray-500 mb-8 border-b pb-4">ID: {project.slug}</p>

        <div className="bg-blue-50 border-2 border-blue-100 border-dashed rounded-xl p-10 text-center">
          <h2 className="font-bold text-blue-900 text-xl mb-2">ご遺族へお渡しするQRコード</h2>
          <p className="text-blue-600 text-sm mb-6">この画面を印刷するか、QRコードを保存してお渡しください</p>
          
          {/* QRコード画像 */}
          <div className="bg-white p-4 inline-block rounded-lg shadow-sm mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrCodeUrl} alt="QR Code" width={250} height={250} className="block" />
          </div>

          <div className="text-left bg-white p-4 rounded border text-sm text-gray-600">
             <p className="font-bold mb-1">読み取り先URL:</p>
             <p className="break-all font-mono text-blue-600">{kenpaiUrl}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
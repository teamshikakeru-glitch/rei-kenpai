'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProject(formData: FormData) {
  const supabase = await createClient()

  // フォームから入力値を取得
  const deceasedName = formData.get('deceasedName') as string
  const slug = formData.get('slug') as string

  // ★MVP用簡略化: 登録されている最初の葬儀社IDを自動で使います
  const { data: home } = await supabase
    .from('funeral_homes')
    .select('id')
    .limit(1)
    .single()

  if (!home) throw new Error('葬儀社が見つかりません')

  // データを保存
  const { error } = await supabase.from('projects').insert({
    funeral_home_id: home.id,
    deceased_name: deceasedName,
    slug: slug, // URLになります (例: tanaka-ke)
    is_active: true
  })

  if (error) {
    console.error(error)
    throw new Error('保存に失敗しました')
  }

  // 画面を更新
  revalidatePath('/admin')
}
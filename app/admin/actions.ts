'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '../../lib/supabase/server';

export async function createProject(formData: FormData) {
  const supabase = await createClient();
  
  const deceasedName = formData.get('deceased_name') as string;
  const slug = formData.get('slug') as string;

  // 葬儀社IDを取得(現状は最初の1件を取得)
  const { data: funeralHome } = await supabase
    .from('funeral_homes')
    .select('id')
    .limit(1)
    .single();

  if (!funeralHome) {
    throw new Error('葬儀社が見つかりません');
  }

  // プロジェクト作成
  const { data, error } = await supabase
    .from('projects')
    .insert([
      {
        deceased_name: deceasedName,
        slug: slug,
        funeral_home_id: funeralHome.id,
      }
    ])
    .select();

  if (error) {
    console.error('Error creating project:', error);
    throw new Error('プロジェクトの作成に失敗しました');
  }

  revalidatePath('/admin');
  return data;
}

export async function getProjects() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('projects')
    .select('id, deceased_name, slug, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return data || [];
}
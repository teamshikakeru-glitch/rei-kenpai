import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import KenpaiPageClient from './KenpaiPageClient';

// Supabaseクライアント（サーバー用）
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = {
  params: Promise<{ slug: string }>;
};

// OGPメタデータを動的に生成
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  const { data: project } = await supabase
    .from('projects')
    .select('deceased_name, family_message, photo_url')
    .eq('slug', slug)
    .single();

  if (!project) {
    return {
      title: 'ページが見つかりません | Rei',
    };
  }

  const title = `${project.deceased_name}様への献杯 | Rei`;
  const description = project.family_message 
    ? project.family_message.substring(0, 100) 
    : `${project.deceased_name}様への献杯ページです。お気持ちをお届けください。`;
  
  // OGP画像（写真があれば使用、なければデフォルト）
  const ogImage = project.photo_url || 'https://smartkenpai.com/og-default.jpg';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://smartkenpai.com/${slug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: 'Rei - 遠隔献杯システム',
      locale: 'ja_JP',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

// ページコンポーネント
export default function KenpaiPage() {
  return <KenpaiPageClient />;
}
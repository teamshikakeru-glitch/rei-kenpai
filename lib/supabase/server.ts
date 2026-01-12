import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  // ▼▼▼ ここに再度、キーを入力してください ▼▼▼
  
  const supabaseUrl = 'https://osyysvompcfuadlnuojs.supabase.co'
  
  // ★重要: ここに「anon / public」キーを貼り付けてください
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zeXlzdm9tcGNmdWFkbG51b2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNjYzODQsImV4cCI6MjA4MzY0MjM4NH0.6GkJnnULLFH0Ep2q7IzkV5O4XNlpy8vDEB2GNM7b0w4'

  // ▲▲▲▲▲▲

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
          }
        },
      },
    }
  )
}
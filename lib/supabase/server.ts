import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
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
            // Cookie mutations throw in certain Next.js contexts (e.g. during static generation).
            // This is expected and safe to ignore — the middleware handles cookie forwarding.
          }
        },
      },
    }
  )
}

/**
 * Shared utility to handle authentication in API routes and Server Actions.
 * Returns the user and supabase client, or an error response if unauthorized.
 */
export async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      user: null,
      supabase,
      errorResponse: NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    };
  }

  return { user, supabase, errorResponse: null };
}

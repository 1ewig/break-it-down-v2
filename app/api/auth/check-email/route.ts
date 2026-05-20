import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

const requestSchema = z.object({
  email: z.string().email().max(255),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = requestSchema.parse(body)

    const supabase = createAdminClient()
    const { data, error } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    })

    if (error) {
      console.error('listUsers error:', error.message)
      return NextResponse.json({ error: 'Failed to verify email' }, { status: 500 })
    }

    const exists = data.users.some((u) => u.email?.toLowerCase() === email.toLowerCase())

    return NextResponse.json({ exists })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

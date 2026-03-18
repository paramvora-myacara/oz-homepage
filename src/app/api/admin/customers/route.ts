import { NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin/auth'
import { createAdminClient } from '@/utils/supabase/admin'

/** List customer admin users (internal_admin only) — for grant-access picker */
export async function GET() {
  const user = await verifyAdmin()
  if (!user || user.role !== 'internal_admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('admin_users')
    .select('id, email')
    .eq('role', 'customer')
    .order('email')

  if (error) {
    console.error('[admin/customers]', error)
    return NextResponse.json({ error: 'Failed to load customers' }, { status: 500 })
  }

  return NextResponse.json({ customers: data ?? [] })
}

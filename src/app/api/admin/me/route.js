import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export async function GET(request) {
  try {
    const supabase = await createClient();
    
    // Read the admin cookie
    let email = null;
    let password = null;
    
    try {
      const cookieStore = await cookies();
      const raw = cookieStore.get('oz_admin_basic')?.value;
      if (raw) {
        const decoded = Buffer.from(raw, 'base64').toString('utf8');
        [email, password] = decoded.split(':');
      }
    } catch {
      // Fallback: try reading from headers
      const headersList = await headers();
      const cookieHeader = headersList.get('cookie') || '';
      const match = cookieHeader
        .split(';')
        .map(s => s.trim())
        .find(s => s.startsWith('oz_admin_basic='));
      if (match) {
        const raw = decodeURIComponent(match.split('=')[1] || '');
        const decoded = Buffer.from(raw, 'base64').toString('utf8');
        [email, password] = decoded.split(':');
      }
    }

    if (!email || !password) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    // Verify credentials against admin_users table
    const { data: adminUser, error: userError } = await supabase
      .from('admin_users')
      .select('id, email, password')
      .eq('email', email)
      .single();

    if (userError || !adminUser || adminUser.password !== password) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: adminUser.id,
        email: adminUser.email
      }
    });
  } catch (error) {
    console.error('Error checking admin auth:', error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }
}

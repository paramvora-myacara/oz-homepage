import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, email, password')
      .eq('email', email)
      .single();

    if (error || !data || data.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const basic = Buffer.from(`${email}:${password}`).toString('base64');
    const cookieStore = await cookies();
    
    // Check if we're in production (HTTPS) or development (HTTP)
    const isSecure = process.env.NODE_ENV === 'production';
    
    // Set httpOnly cookie for server-side auth
    cookieStore.set('oz_admin_basic', basic, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isSecure,
      path: '/',
    });

    return NextResponse.json({ userId: data.id, email: data.email });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

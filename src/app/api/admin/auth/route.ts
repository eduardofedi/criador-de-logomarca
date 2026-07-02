import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { currentPassword, newPassword, mode } = await req.json();

  // Buscar senha atual no banco
  const { data: config } = await supabase.from('settings').select('*').eq('key', 'admin_config').single();
  const savedPassword = config?.value?.password || 'Cr1ad0r@Logo#26';

  if (mode === 'login') {
    if (currentPassword === savedPassword) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
  }

  if (mode === 'change') {
    if (currentPassword !== savedPassword) {
      return NextResponse.json({ error: 'Senha atual incorreta' }, { status: 401 });
    }
    const { error } = await supabase
      .from('settings')
      .upsert({ key: 'admin_config', value: { password: newPassword } });
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Modo inválido' }, { status: 400 });
}

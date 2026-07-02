import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Ignorar arquivos estáticos, _next, imagens, etc para não poluir os logs
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Coletar dados de acesso
  const accessData = {
    timestamp: new Date().toISOString(),
    path: request.nextUrl.pathname,
    ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    referer: request.headers.get('referer') || 'direct',
  };

  // Imprime no console (será capturado pelos Logs da Vercel para você metrificar)
  console.log('[USER_ACCESS]', JSON.stringify(accessData));

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

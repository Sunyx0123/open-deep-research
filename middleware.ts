import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import * as jose from 'jose';
import { authConfig } from '@/app/(auth)/auth.config';

export default NextAuth(authConfig).auth;

export async function middleware(request: NextRequest) {
  // 使用与环境匹配的cookie名称
  // console.log('request', request);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  const cookieName = "next-auth.session-token";
  
  // 检查cookie是否存在
  const hasSessionCookie = request.cookies.has(cookieName);
  console.log(`Cookie '${cookieName}' exists:`, hasSessionCookie);
  // 在middleware.ts中，输出密钥的部分信息
  
  // 使用cookie存在性而不是token
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                    request.nextUrl.pathname.startsWith('/register');
  
  if (!hasSessionCookie && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (hasSessionCookie && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/chat/:id',
    '/login',
    '/register',
    '/api/:path*',
    
  ],
};

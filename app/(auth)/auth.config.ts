import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    newUser: '/',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
  authorized({ auth, request: { nextUrl } }) {
    const isLoggedIn = !!auth?.user;
    const isOnRegister = nextUrl.pathname.startsWith('/register');
    const isOnLogin = nextUrl.pathname.startsWith('/login');
    const isOnAuthPage = isOnLogin || isOnRegister;
    
    // 添加调试信息
    console.log('Auth callback - isLoggedIn:', isLoggedIn);
    
    // 登录后跳转到首页
    if (isLoggedIn && isOnAuthPage) {
      return Response.redirect(new URL('/', nextUrl));
    }
    
    // 未登录跳转到登录页
    if (!isLoggedIn && !isOnAuthPage) {
      return Response.redirect(new URL('/login', nextUrl));
    }
    
    return true;
  },
}
} satisfies NextAuthConfig;
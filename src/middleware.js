import { NextRequest, NextResponse } from 'next/server';
// import { includes } from "lodash";

const isSuperAdminRoute = (pathname) => pathname.startsWith('/api/supadmin');

const isUserRoute = (pathname) => pathname.startsWith('/api/admin');

export async function middleware(req) {
  // const jwtToken = req.headers.get("authorization");
  // // const { pathname } = req.nextUrl;
  //   if(!jwtToken){
  //       return NextResponse.redirect(new URL('/api/user/unauthorized', req.url));
  //   }

  // const user =

  // if(user ){ // && user.jwtTokenExpire <= new Date().getTime()

  //     if (isUserRoute(pathname) && !includes([2,6], user.roleId)) {
  //         return NextResponse.redirect(new URL('/api/user/unauthorized', req.url));
  //     }

  //     // 2 is reserved for admin
  //     if (isSuperAdminRoute(pathname) && user.roleId !== 2) {
  //         return NextResponse.redirect(new URL('/api/user/unauthorized', req.url));
  //     }

  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*', '/api/supadmin/:path*'],
};

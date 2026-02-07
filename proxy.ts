import { NextRequest, NextResponse } from 'next/server';

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

function hasAuthCookie(req: NextRequest) {

  return req.cookies.has("accessToken") || req.cookies.has("refreshToken");
  
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPrivate = privateRoutes.some((p) => pathname.startsWith(p));
  const isAuth = publicRoutes.some((p) => pathname.startsWith(p));

  const isAuthed = hasAuthCookie(req);

  if (isPrivate && !isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  if (isAuth && isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/sign-in', '/sign-up', '/notes/:path*'],
};

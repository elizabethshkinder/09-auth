import { NextRequest, NextResponse } from "next/server";
import { serverCheckSession } from "@/lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

function hasCookie(req: NextRequest, name: string) {
  return req.cookies.has(name);
}

function isPrivatePath(pathname: string) {
  return privateRoutes.some((p) => pathname.startsWith(p));
}

function isPublicAuthPath(pathname: string) {
  return publicRoutes.some((p) => pathname.startsWith(p));
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPrivate = isPrivatePath(pathname);
  const isAuthPage = isPublicAuthPath(pathname);

  const hasAccess = hasCookie(req, "accessToken");
  const hasRefresh = hasCookie(req, "refreshToken");

 
  if (hasAccess) {
   
    if (isAuthPage) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  
  if (hasRefresh) {
    try {
      const res = await serverCheckSession(); 
      const success = Boolean(res.data?.success);

      if (success) {
        
        if (isAuthPage) {
          const url = req.nextUrl.clone();
          url.pathname = "/";
          const nextRes = NextResponse.redirect(url);

          
          const setCookie = res.headers?.["set-cookie"];
          if (setCookie) {
          
            const cookiesArr = Array.isArray(setCookie) ? setCookie : [setCookie];
            cookiesArr.forEach((c) => nextRes.headers.append("set-cookie", c));
          }

          return nextRes;
        }

        const nextRes = NextResponse.next();

        const setCookie = res.headers?.["set-cookie"];
        if (setCookie) {
          const cookiesArr = Array.isArray(setCookie) ? setCookie : [setCookie];
          cookiesArr.forEach((c) => nextRes.headers.append("set-cookie", c));
        }

        return nextRes;
      }
    } catch {
  
    }
  }

  if (isPrivate) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/sign-in", "/sign-up", "/notes/:path*"],
};

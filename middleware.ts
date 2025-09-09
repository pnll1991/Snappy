import { NextResponse, type NextRequest } from "next/server"
import { decrypt, encrypt } from "@/lib/session"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get("session")?.value
  const payload = sessionCookie ? await decrypt(sessionCookie) : null

  // Redirect logged-in users away from the login page
  if (pathname === "/admin/login" && payload) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  // Block access to protected admin routes if not logged in
  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !payload) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  // Refresh session for authenticated requests
  if (payload) {
    const res = NextResponse.next()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const newSession = await encrypt({ userId: payload.userId, expiresAt })
    res.cookies.set("session", newSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expiresAt,
      sameSite: "lax",
      path: "/",
    })
    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

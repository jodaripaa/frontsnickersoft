import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar si el usuario está autenticado
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ["/", "/login"]
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith("/api/auth"))

  // Si la ruta es pública, permitir acceso
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Si no hay token y la ruta no es pública, redirigir al login
  if (!token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  // Verificar permisos según el rol
  const role = token.role as string

  // Rutas de super-user
  if (pathname.startsWith("/dashboard/super-user") && role !== "super-user") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Rutas de admin
  if (pathname.startsWith("/dashboard/admin") && role !== "admin" && role !== "super-user") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Rutas de employee
  if (pathname.startsWith("/dashboard/employee") && role !== "employee" && role !== "admin" && role !== "super-user") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

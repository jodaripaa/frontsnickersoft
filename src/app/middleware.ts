import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Este middleware es una simulación ya que en un entorno real
// necesitaríamos verificar tokens JWT o cookies de sesión
export function middleware(request: NextRequest) {
  // En una implementación real, verificaríamos tokens JWT o cookies
  // Por ahora, solo redirigimos a la página de inicio si se intenta
  // acceder directamente a las rutas protegidas sin pasar por el login

  const url = request.nextUrl.clone()

  // Si es una ruta de dashboard, verificamos que haya pasado por login
  if (url.pathname.startsWith("/dashboard")) {
    // En una implementación real, verificaríamos el token aquí
    // Por ahora, simplemente redirigimos al inicio
    // Nota: Este middleware es solo ilustrativo, ya que localStorage
    // no está disponible en el middleware de Next.js

    // En una implementación real, usaríamos cookies o JWT
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Configurar las rutas que deben pasar por el middleware
export const config = {
  matcher: ["/dashboard/:path*"],
}

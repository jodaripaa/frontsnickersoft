// Tipos para los usuarios
export type UserRole = "super-user" | "admin" | "employee"

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  createdAt: string
}

// Función para verificar si un usuario está autenticado
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false

  const role = localStorage.getItem("userRole")
  return !!role
}

// Función para verificar el rol del usuario
export function getUserRole(): UserRole | null {
  if (typeof window === "undefined") return null

  const role = localStorage.getItem("userRole") as UserRole | null
  return role
}

// Función para verificar si un usuario tiene permisos para una ruta
export function hasPermission(requiredRole: UserRole): boolean {
  const role = getUserRole()

  if (!role) return false

  // Lógica de jerarquía de permisos
  if (requiredRole === "employee") {
    // Todos los roles pueden acceder a rutas de empleados
    return true
  }

  if (requiredRole === "admin") {
    // Solo admin y super-user pueden acceder a rutas de admin
    return role === "admin" || role === "super-user"
  }

  if (requiredRole === "super-user") {
    // Solo super-user puede acceder a rutas de super-user
    return role === "super-user"
  }

  return false
}

// Función para cerrar sesión
export function logout(): void {
  if (typeof window === "undefined") return

  localStorage.removeItem("userRole")
  localStorage.removeItem("userName")
}

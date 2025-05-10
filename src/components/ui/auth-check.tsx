"use client"

import type React from "react"

import type { Session } from "next-auth"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

// Extend the Session type to include the role property
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string | null
    }
  }
}

export function AuthCheck({
  children,
  requiredRole,
}: {
  children: React.ReactNode
  requiredRole?: string
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated") {
      router.push("/login")
    } else if (requiredRole && session?.user?.role !== requiredRole) {
      // Si se requiere un rol específico y el usuario no lo tiene
      if (
        !(
          requiredRole === "employee" ||
          (requiredRole === "admin" && session?.user?.role === "super-user") ||
          (requiredRole === "employee" && ["admin", "super-user"].includes(session?.user?.role as string))
        )
      ) {
        router.push("/")
      }
    }
  }, [status, session, router, requiredRole])

  if (status === "loading") {
    return <div>Cargando...</div>
  }

  if (status === "unauthenticated") {
    return null
  }

  if (requiredRole && session?.user?.role !== requiredRole) {
    // Verificar jerarquía de roles
    if (
      !(
        requiredRole === "employee" ||
        (requiredRole === "admin" && session?.user?.role === "super-user") ||
        (requiredRole === "employee" && ["admin", "super-user"].includes(session?.user?.role as string))
      )
    ) {
      return null
    }
  }

  return <>{children}</>
}

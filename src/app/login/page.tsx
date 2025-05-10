"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const errorParam = searchParams.get("error")

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (status === "authenticated") {
      // Redirigir según el rol
      if (session.user.role === "super-user") {
        router.push("/dashboard/super-user")
      } else if (session.user.role === "admin") {
        router.push("/dashboard/admin")
      } else if (session.user.role === "employee") {
        router.push("/dashboard/employee")
      } else {
        router.push("/")
      }
    }
  }, [status, session, router])

  // Mostrar error de URL si existe
  useEffect(() => {
    if (errorParam) {
      setError("Credenciales incorrectas. Por favor, intente nuevamente.")
    }
  }, [errorParam])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>, role: string) {
    event.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Credenciales incorrectas. Por favor, intente nuevamente.")
      } else {
        // La redirección se maneja en el useEffect
      }
    } catch (err) {
      setError("Error al iniciar sesión. Intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <p>Cargando...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
          <CardDescription className="text-center">Ingrese sus credenciales para acceder al sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="super-user">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="super-user">Super Usuario</TabsTrigger>
              <TabsTrigger value="admin">Administrativo</TabsTrigger>
              <TabsTrigger value="employee">Empleado</TabsTrigger>
            </TabsList>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <TabsContent value="super-user">
              <form onSubmit={(e) => handleSubmit(e, "super-user")} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email-su">Correo Electrónico</Label>
                  <Input
                    id="email-su"
                    name="email"
                    type="email"
                    placeholder="admin@example.com"
                    defaultValue="admin@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-su">Contraseña</Label>
                  <Input
                    id="password-su"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    defaultValue="password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="admin">
              <form onSubmit={(e) => handleSubmit(e, "admin")} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email-admin">Correo Electrónico</Label>
                  <Input
                    id="email-admin"
                    name="email"
                    type="email"
                    placeholder="empresa@example.com"
                    defaultValue="empresa@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-admin">Contraseña</Label>
                  <Input
                    id="password-admin"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    defaultValue="password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="employee">
              <form onSubmit={(e) => handleSubmit(e, "employee")} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email-emp">Correo Electrónico</Label>
                  <Input
                    id="email-emp"
                    name="email"
                    type="email"
                    placeholder="empleado@example.com"
                    defaultValue="empleado@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-emp">Contraseña</Label>
                  <Input
                    id="password-emp"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    defaultValue="password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">
            Volver a la página principal
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

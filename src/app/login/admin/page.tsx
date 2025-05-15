"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Lock, User } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { verifyCredentials } from "@/services/user-service"
import toast from "react-hot-toast"

export default function AdminLogin() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      // Simulación de latencia
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Verificar credenciales
      const user = verifyCredentials(email, password)

      if (user && (user.role === "admin" || user.role === "super-user")) {
        // Mostrar toast de éxito
        toast.success("Inicio de sesión exitoso", {
          icon: "🔐",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        })

        // Almacenar información de sesión
        localStorage.setItem("userRole", user.role)
        localStorage.setItem("userName", user.name)

        // Redirigir al dashboard correspondiente
        router.push("/dashboard/admin")
      } else {
        setError("Credenciales incorrectas o usuario no autorizado")
        toast.error("Credenciales incorrectas", {
          icon: "❌",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        })
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err)
      setError("Error al iniciar sesión. Intente nuevamente.")
      toast.error("Error al iniciar sesión", {
        icon: "⚠️",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-4 overflow-hidden">
      {/* Elementos decorativos */}
      <div className="fixed top-20 left-20 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="fixed top-40 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="fixed -bottom-20 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-md z-10">
        <div className={`text-center mb-8 ${mounted ? "animate-fade-in" : ""}`}>
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500 rounded-full blur-xl opacity-20 animate-pulse-slow"></div>
              <div className="relative bg-white p-4 rounded-full shadow-lg animate-float-shadow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-cyan-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight text-gradient animate-blur-in">
            Acceso Empresarial
          </h1>
          <p className="mt-2 text-gray-600">Ingrese sus credenciales para continuar</p>
        </div>

        <Card className={`glass-card border-white/50 shadow-xl overflow-hidden ${mounted ? "animate-scale-in" : ""}`}>
          <CardHeader className="bg-gradient-to-r from-cyan-600 to-cyan-500 text-white">
            <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
            <CardDescription className="text-cyan-100">Panel de administración empresarial</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {error && (
              <Alert variant="destructive" className="mb-4 animate-shake">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4" /> Usuario
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    placeholder="Ingrese su usuario"
                    required
                    className="pl-10 input-3d rounded-lg h-11"
                  />
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 flex items-center gap-2">
                  <Lock className="h-4 w-4" /> Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="pl-10 input-3d rounded-lg h-11"
                  />
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white h-12 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 btn-glow mt-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Iniciando sesión...
                  </span>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t bg-gray-50/50 py-4">
            <Link
              href="/"
              className="text-sm text-cyan-600 hover:text-cyan-800 transition-colors flex items-center gap-1 hover-scale"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver a la selección de usuario
            </Link>
          </CardFooter>
        </Card>

        <div className={`text-center mt-6 text-sm text-gray-500 ${mounted ? "animate-fade-in delay-300" : ""}`}>
          <p>© {new Date().getFullYear()} Sistema de Gestión. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  )
}

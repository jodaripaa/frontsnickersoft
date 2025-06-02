"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react"
import type { CollaboratorFormValues } from "@/types/collaborator"
import { addCollaborator } from "@/services/collaborator-service"
import toast from "react-hot-toast"

export default function CreateCollaboratorPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formValues, setFormValues] = useState<CollaboratorFormValues>({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    joinDate: new Date().toISOString().split("T")[0],
    password: "",
  })

  useEffect(() => {
    setMounted(true)

    // Verificar si el usuario está autenticado y es admin
    const role = localStorage.getItem("userRole")

    if (!role || (role !== "admin" && role !== "super-user")) {
      router.push("/login/admin")
      return
    }

    return () => setMounted(false)
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validar campos obligatorios
      if (!formValues.name || !formValues.email || !formValues.position || !formValues.password) {
        toast.error("Por favor complete todos los campos obligatorios")
        setLoading(false)
        return
      }

      // Obtener el ID de la empresa del usuario actual
      const companyId = localStorage.getItem("userId") || "1"

      // Crear colaborador
      const newCollaborator = addCollaborator(companyId, formValues)

      toast.success(`Colaborador ${newCollaborator.name} creado correctamente`, {
        icon: "✅",
        duration: 3000,
      })

      // Redirigir a la lista de colaboradores
      router.push("/dashboard/admin/collaborators")
    } catch (error) {
      console.error("Error al crear el colaborador:", error)
      toast.error("Error al crear el colaborador")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <Button
        variant="ghost"
        className={`mb-4 ${mounted ? "animate-fade-in" : "opacity-0"}`}
        onClick={() => router.push("/dashboard/admin/collaborators")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a la lista
      </Button>

      <Card className={mounted ? "animate-scale-in" : "opacity-0"}>
        <CardHeader>
          <CardTitle>Crear Nuevo Colaborador</CardTitle>
          <CardDescription>Ingresa los datos para registrar un nuevo colaborador en tu empresa</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formValues.name}
                  onChange={handleChange}
                  required
                  className="input-3d"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formValues.email}
                  onChange={handleChange}
                  required
                  className="input-3d"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" name="phone" value={formValues.phone} onChange={handleChange} className="input-3d" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Cargo *</Label>
                <Input
                  id="position"
                  name="position"
                  value={formValues.position}
                  onChange={handleChange}
                  required
                  className="input-3d"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Input
                  id="department"
                  name="department"
                  value={formValues.department}
                  onChange={handleChange}
                  className="input-3d"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="joinDate">Fecha de Ingreso</Label>
                <Input
                  id="joinDate"
                  name="joinDate"
                  type="date"
                  value={formValues.joinDate}
                  onChange={handleChange}
                  className="input-3d"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formValues.password}
                    onChange={handleChange}
                    required
                    className="input-3d pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/admin/collaborators")}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="btn-glow bg-cyan-500 hover:bg-cyan-600">
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
                  Guardando...
                </span>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Colaborador
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

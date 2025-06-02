"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import type { Collaborator } from "@/types/collaborator"
import { Switch } from "@/components/ui/switch"
import { getCollaboratorById, updateCollaborator } from "@/services/collaborator-service"
import toast from "react-hot-toast"

export default function EditCollaboratorPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(false)
  const [collaborator, setCollaborator] = useState<Collaborator | null>(null)
  const [mounted, setMounted] = useState(false)
  const [formValues, setFormValues] = useState<Partial<Collaborator> & { active: boolean }>({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    joinDate: "",
    active: true,
  })

  useEffect(() => {
    setMounted(true)

    // Verificar si el usuario está autenticado y es admin
    const role = localStorage.getItem("userRole")

    if (!role || (role !== "admin" && role !== "super-user")) {
      router.push("/login/admin")
      return
    }

    // Obtener el ID de la empresa del usuario actual
    const companyId = localStorage.getItem("userId") || "1"

    // Cargar datos del colaborador
    const foundCollaborator = getCollaboratorById(companyId, id)
    if (foundCollaborator) {
      setCollaborator(foundCollaborator)
      setFormValues({
        name: foundCollaborator.name,
        email: foundCollaborator.email,
        phone: foundCollaborator.phone,
        position: foundCollaborator.position,
        department: foundCollaborator.department,
        joinDate: foundCollaborator.joinDate,
        active: foundCollaborator.active,
      })
    } else {
      // Si no se encuentra el colaborador, redirigir a la lista
      toast.error("Colaborador no encontrado")
      router.push("/dashboard/admin/collaborators")
    }

    return () => setMounted(false)
  }, [id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleToggleActive = (checked: boolean) => {
    setFormValues((prev) => ({ ...prev, active: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validar campos obligatorios
      if (!formValues.name || !formValues.email || !formValues.position) {
        toast.error("Por favor complete todos los campos obligatorios")
        setLoading(false)
        return
      }

      // Obtener el ID de la empresa del usuario actual
      const companyId = localStorage.getItem("userId") || "1"

      // Actualizar colaborador
      const updatedCollaborator = updateCollaborator(companyId, id, formValues)

      if (updatedCollaborator) {
        toast.success(`Colaborador ${updatedCollaborator.name} actualizado correctamente`, {
          icon: "✅",
          duration: 3000,
        })

        // Redirigir a la lista de colaboradores
        router.push("/dashboard/admin/collaborators")
      } else {
        toast.error("Error al actualizar el colaborador")
      }
    } catch (error) {
      console.error("Error al actualizar el colaborador:", error)
      toast.error("Error al actualizar el colaborador")
    } finally {
      setLoading(false)
    }
  }

  if (!collaborator && !mounted) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    )
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
          <CardTitle>Editar Colaborador</CardTitle>
          <CardDescription>Modifica los datos del colaborador {collaborator?.name}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Switch id="active" checked={formValues.active} onCheckedChange={handleToggleActive} />
              <Label htmlFor="active">{formValues.active ? "Colaborador Activo" : "Colaborador Inactivo"}</Label>
            </div>

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
            </div>

            {collaborator && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label>Fecha de Creación</Label>
                  <Input value={collaborator.createdAt} disabled />
                </div>

                <div className="space-y-2">
                  <Label>Última Actualización</Label>
                  <Input value={collaborator.updatedAt} disabled />
                </div>
              </div>
            )}
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
                  Actualizar Colaborador
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

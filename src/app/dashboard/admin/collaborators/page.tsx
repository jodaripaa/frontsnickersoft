"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, Ban, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Collaborator } from "@/types/collaborator"
import type { ColumnDef } from "@tanstack/react-table"
import { getCollaborators, toggleCollaboratorStatus, deleteCollaborator } from "@/services/collaborator-service"
import toast from "react-hot-toast"

export default function CollaboratorsPage() {
  const router = useRouter()
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Verificar si el usuario está autenticado y es admin
    const role = localStorage.getItem("userRole")

    if (!role || (role !== "admin" && role !== "super-user")) {
      router.push("/login/admin")
      return
    }

    // Obtener el ID de la empresa del usuario actual
    // En un sistema real, esto vendría de la sesión o token
    const companyId = localStorage.getItem("userId") || "1"

    // Cargar colaboradores
    const loadedCollaborators = getCollaborators(companyId)
    setCollaborators(loadedCollaborators)
    setLoading(false)

    return () => setMounted(false)
  }, [router])

  const handleCreateCollaborator = () => {
    router.push("/dashboard/admin/collaborators/create")
  }

  const handleEditCollaborator = (id: string) => {
    router.push(`/dashboard/admin/collaborators/edit/${id}`)
  }

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    try {
      const companyId = localStorage.getItem("userId") || "1"
      const updatedCollaborator = toggleCollaboratorStatus(companyId, id)
      if (updatedCollaborator) {
        setCollaborators(
          collaborators.map((collaborator) => (collaborator.id === id ? updatedCollaborator : collaborator)),
        )
        toast.success(`Colaborador ${currentStatus ? "desactivado" : "activado"} correctamente`, {
          icon: currentStatus ? "🔴" : "🟢",
        })
      }
    } catch (error) {
      console.error("Error al cambiar estado del colaborador:", error)
      toast.error("Error al cambiar el estado del colaborador")
    }
  }

  const handleDeleteCollaborator = (id: string) => {
    try {
      const companyId = localStorage.getItem("userId") || "1"
      const success = deleteCollaborator(companyId, id)
      if (success) {
        setCollaborators(collaborators.filter((collaborator) => collaborator.id !== id))
        toast.success("Colaborador eliminado correctamente", {
          icon: "🗑️",
        })
      }
    } catch (error) {
      console.error("Error al eliminar el colaborador:", error)
      toast.error("Error al eliminar el colaborador")
    }
  }

  const columns: ColumnDef<Collaborator>[] = [
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
    },
    {
      accessorKey: "position",
      header: "Cargo",
    },
    {
      accessorKey: "department",
      header: "Departamento",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Teléfono",
    },
    {
      accessorKey: "joinDate",
      header: "Fecha de Ingreso",
    },
    {
      accessorKey: "active",
      header: "Estado",
      cell: ({ row }) => {
        const active = row.getValue("active") as boolean
        return (
          <Badge variant={active ? "success" : "secondary"} className="capitalize">
            {active ? "Activo" : "Inactivo"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const collaborator = row.original
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditCollaborator(collaborator.id)}
              title="Editar colaborador"
              className="text-gray-500 hover:text-[#2a7da2] hover:bg-gray-100"
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <ConfirmDialog
              title={collaborator.active ? "Desactivar Colaborador" : "Activar Colaborador"}
              description={`¿Estás seguro de que deseas ${collaborator.active ? "desactivar" : "activar"} a ${collaborator.name}?`}
              confirmText={collaborator.active ? "Desactivar" : "Activar"}
              onConfirm={() => handleToggleStatus(collaborator.id, collaborator.active)}
              variant={collaborator.active ? "destructive" : "default"}
            >
              <Button
                variant="ghost"
                size="icon"
                title={collaborator.active ? "Desactivar colaborador" : "Activar colaborador"}
                className={
                  collaborator.active
                    ? "text-gray-500 hover:text-red-500 hover:bg-gray-100"
                    : "text-gray-500 hover:text-green-500 hover:bg-gray-100"
                }
              >
                {collaborator.active ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
              </Button>
            </ConfirmDialog>

            <ConfirmDialog
              title="Eliminar Colaborador"
              description={`¿Estás seguro de que deseas eliminar a ${collaborator.name}? Esta acción no se puede deshacer.`}
              confirmText="Eliminar"
              onConfirm={() => handleDeleteCollaborator(collaborator.id)}
              variant="destructive"
            >
              <Button
                variant="ghost"
                size="icon"
                title="Eliminar colaborador"
                className="text-gray-500 hover:text-red-500 hover:bg-gray-100"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </ConfirmDialog>
          </div>
        )
      },
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-primary">
      <header className="header-admin p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Panel Administrativo</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/admin")}
            className="text-white border-white hover:bg-white/20"
          >
            Volver al Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <Card className={`shadow-lg ${mounted ? "animate-fade-in" : "opacity-0"}`}>
          <CardHeader className="flex flex-row items-center justify-between bg-gray-50 border-b">
            <div>
              <CardTitle className="text-[#2a7da2]">Gestión de Colaboradores</CardTitle>
              <CardDescription>Administra los colaboradores de tu empresa</CardDescription>
            </div>
            <Button onClick={handleCreateCollaborator} className="btn-admin">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Colaborador
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={collaborators}
                searchKey="name"
                searchPlaceholder="Buscar por nombre..."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

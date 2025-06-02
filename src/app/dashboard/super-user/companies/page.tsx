"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, Ban, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Company } from "@/types/company"
import type { ColumnDef } from "@tanstack/react-table"
import { getCompanies, toggleCompanyStatus, deleteCompany } from "@/services/company-service"
import toast from "react-hot-toast"

export default function CompaniesPage() {
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Verificar si el usuario está autenticado y es super usuario
    const role = localStorage.getItem("userRole")

    if (!role || role !== "super-user") {
      router.push("/login/super-user")
      return
    }

    // Cargar empresas
    const loadedCompanies = getCompanies()
    setCompanies(loadedCompanies)
    setLoading(false)

    return () => setMounted(false)
  }, [router])

  const handleCreateCompany = () => {
    router.push("/dashboard/super-user/companies/create")
  }

  const handleEditCompany = (id: string) => {
    router.push(`/dashboard/super-user/companies/edit/${id}`)
  }

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    try {
      const updatedCompany = toggleCompanyStatus(id)
      if (updatedCompany) {
        setCompanies(companies.map((company) => (company.id === id ? updatedCompany : company)))
        toast.success(`Empresa ${currentStatus ? "desactivada" : "activada"} correctamente`, {
          icon: currentStatus ? "🔴" : "🟢",
        })
      }
    } catch (error) {
      console.error("Error al cambiar estado de la empresa:", error)
      toast.error("Error al cambiar el estado de la empresa")
    }
  }

  const handleDeleteCompany = (id: string) => {
    try {
      const success = deleteCompany(id)
      if (success) {
        setCompanies(companies.filter((company) => company.id !== id))
        toast.success("Empresa eliminada correctamente", {
          icon: "🗑️",
        })
      }
    } catch (error) {
      console.error("Error al eliminar la empresa:", error)
      toast.error("Error al eliminar la empresa")
    }
  }

  const columns: ColumnDef<Company>[] = [
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
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
      accessorKey: "city",
      header: "Ciudad",
    },
    {
      accessorKey: "active",
      header: "Estado",
      cell: ({ row }) => {
        const active = row.getValue("active") as boolean
        return (
          <Badge variant={active ? "success" : "secondary"} className="capitalize">
            {active ? "Activa" : "Inactiva"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const company = row.original
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditCompany(company.id)}
              title="Editar empresa"
              className="text-gray-500 hover:text-[#2d4a6d] hover:bg-gray-100"
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <ConfirmDialog
              title={company.active ? "Desactivar Empresa" : "Activar Empresa"}
              description={`¿Estás seguro de que deseas ${company.active ? "desactivar" : "activar"} la empresa ${company.name}?`}
              confirmText={company.active ? "Desactivar" : "Activar"}
              onConfirm={() => handleToggleStatus(company.id, company.active)}
              variant={company.active ? "destructive" : "default"}
            >
              <Button
                variant="ghost"
                size="icon"
                title={company.active ? "Desactivar empresa" : "Activar empresa"}
                className={
                  company.active
                    ? "text-gray-500 hover:text-red-500 hover:bg-gray-100"
                    : "text-gray-500 hover:text-green-500 hover:bg-gray-100"
                }
              >
                {company.active ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
              </Button>
            </ConfirmDialog>

            <ConfirmDialog
              title="Eliminar Empresa"
              description={`¿Estás seguro de que deseas eliminar la empresa ${company.name}? Esta acción no se puede deshacer.`}
              confirmText="Eliminar"
              onConfirm={() => handleDeleteCompany(company.id)}
              variant="destructive"
            >
              <Button
                variant="ghost"
                size="icon"
                title="Eliminar empresa"
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
      <header className="header-super-user p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Panel de Super Usuario</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/super-user")}
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
              <CardTitle className="text-[#2d4a6d]">Gestión de Empresas</CardTitle>
              <CardDescription>Administra las empresas registradas en el sistema</CardDescription>
            </div>
            <Button onClick={handleCreateCompany} className="btn-super-user">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Empresa
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <DataTable columns={columns} data={companies} searchKey="name" searchPlaceholder="Buscar por nombre..." />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

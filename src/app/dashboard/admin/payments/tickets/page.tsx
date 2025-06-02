"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Ticket } from "@/types/ticket"
import type { ColumnDef } from "@tanstack/react-table"
import { getTickets, deleteTicket } from "@/services/ticket-service"
import toast from "react-hot-toast"

export default function TicketsPage() {
  const router = useRouter()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Verify if the user is authenticated and is admin
    const role = localStorage.getItem("userRole")
    if (!role || (role !== "admin" && role !== "super-user")) {
      router.push("/login/admin")
      return
    }

    // Load tickets
    const ticketsList = getTickets()
    setTickets(ticketsList)
    setLoading(false)

    return () => setMounted(false)
  }, [router])

  const handleCreateTicket = () => {
    router.push("/dashboard/admin/payments/tickets/create")
  }

  const handleViewTicket = (id: string) => {
    router.push(`/dashboard/admin/payments/tickets/${id}`)
  }

  const handleDeleteTicket = (id: string) => {
    try {
      const success = deleteTicket(id)
      if (success) {
        setTickets(tickets.filter((ticket) => ticket.id !== id))
        toast.success("Ticket eliminado correctamente", {
          icon: "🗑️",
        })
      }
    } catch (error) {
      console.error("Error al eliminar el ticket:", error)
      toast.error("Error al eliminar el ticket")
    }
  }

  const columns: ColumnDef<Ticket>[] = [
    {
      accessorKey: "clientName",
      header: "Cliente",
      cell: ({ row }) => <span className="font-medium">{row.getValue("clientName")}</span>,
    },
    {
      accessorKey: "reference",
      header: "Referencia",
    },
    {
      accessorKey: "series",
      header: "Serie",
    },
    {
      accessorKey: "date",
      header: "Fecha",
      cell: ({ row }) => new Date(row.getValue("date")).toLocaleDateString(),
    },
    {
      accessorKey: "pairs",
      header: "Pares",
    },
    {
      accessorKey: "operations",
      header: "Operaciones",
      cell: ({ row }) => {
        const operations = row.getValue("operations") as any[]
        return operations.length
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const ticket = row.original
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleViewTicket(ticket.id)}
              title="Ver detalles"
              className="text-gray-500 hover:text-[#2a7da2] hover:bg-gray-100"
            >
              <FileText className="h-4 w-4" />
            </Button>

            <ConfirmDialog
              title="Eliminar Ticket"
              description={`¿Estás seguro de que deseas eliminar este ticket? Esta acción no se puede deshacer.`}
              confirmText="Eliminar"
              onConfirm={() => handleDeleteTicket(ticket.id)}
              variant="destructive"
            >
              <Button
                variant="ghost"
                size="icon"
                title="Eliminar ticket"
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
          <h1 className="text-xl font-bold">Panel Administrativo - Tickets de Producción</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/admin/payments")}
            className="text-white border-white hover:bg-white/20"
          >
            Volver a Pagos
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <Card className={`shadow-lg ${mounted ? "animate-fade-in" : "opacity-0"}`}>
          <CardHeader className="flex flex-row items-center justify-between bg-gray-50 border-b">
            <div>
              <CardTitle className="text-[#2a7da2]">Tickets de Producción</CardTitle>
              <CardDescription>Administra los tickets de producción para calcular pagos</CardDescription>
            </div>
            <Button onClick={handleCreateTicket} className="btn-admin">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Ticket
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
                data={tickets}
                searchKey="clientName"
                searchPlaceholder="Buscar por cliente..."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

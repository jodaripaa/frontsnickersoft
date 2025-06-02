"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, Users, Tag, Palette } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Ticket } from "@/types/ticket"
import { getTicketById, updateOperationStatus } from "@/services/ticket-service"
import toast from "react-hot-toast"

export default function TicketDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [ticket, setTicket] = useState<Ticket | null>(null)
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

    // Load ticket details
    const ticketData = getTicketById(id)
    if (ticketData) {
      setTicket(ticketData)
    } else {
      toast.error("Ticket no encontrado")
      router.push("/dashboard/admin/payments/tickets")
    }

    setLoading(false)

    return () => setMounted(false)
  }, [id, router])

  const handleToggleOperationStatus = (operationId: string, completed: boolean) => {
    if (!ticket) return

    try {
      const success = updateOperationStatus(ticket.id, operationId, completed)
      if (success) {
        // Update local state
        const updatedTicket = {
          ...ticket,
          operations: ticket.operations.map((op) => (op.id === operationId ? { ...op, completed } : op)),
        }
        setTicket(updatedTicket)

        toast.success(`Operación ${completed ? "completada" : "pendiente"}`, {
          icon: completed ? "✅" : "⏳",
        })
      }
    } catch (error) {
      console.error("Error al actualizar el estado de la operación:", error)
      toast.error("Error al actualizar el estado de la operación")
    }
  }

  if (loading || !ticket) {
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
        onClick={() => router.push("/dashboard/admin/payments/tickets")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a la lista de tickets
      </Button>

      <Card className={mounted ? "animate-scale-in" : "opacity-0"}>
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-[#2a7da2]">Detalles del Ticket</CardTitle>
            <div className="text-sm bg-gray-200 px-3 py-1 rounded-full">Ticket #{ticket.id}</div>
          </div>
          <CardDescription>Gestiona las operaciones y detalles del ticket de producción</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex gap-2 items-start">
                <Users className="h-5 w-5 text-[#2a7da2] mt-1" />
                <div>
                  <h3 className="font-medium">Cliente</h3>
                  <p className="text-gray-700">{ticket.clientName}</p>
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <Tag className="h-5 w-5 text-[#2a7da2] mt-1" />
                <div>
                  <h3 className="font-medium">Referencia</h3>
                  <p className="text-gray-700">{ticket.reference}</p>
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <Palette className="h-5 w-5 text-[#2a7da2] mt-1" />
                <div>
                  <h3 className="font-medium">Color</h3>
                  <p className="text-gray-700">{ticket.color}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2 items-start">
                <Calendar className="h-5 w-5 text-[#2a7da2] mt-1" />
                <div>
                  <h3 className="font-medium">Fecha</h3>
                  <p className="text-gray-700">{new Date(ticket.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <Tag className="h-5 w-5 text-[#2a7da2] mt-1" />
                <div>
                  <h3 className="font-medium">Serie</h3>
                  <p className="text-gray-700">{ticket.series}</p>
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <Users className="h-5 w-5 text-[#2a7da2] mt-1" />
                <div>
                  <h3 className="font-medium">Número de Pares</h3>
                  <p className="text-gray-700">{ticket.pairs}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Operaciones</h3>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>Tipo de Operación</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead className="w-32">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ticket.operations.length > 0 ? (
                    ticket.operations.map((operation) => (
                      <TableRow key={operation.id}>
                        <TableCell className="font-medium">{operation.type}</TableCell>
                        <TableCell className="text-right">{operation.quantity}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={operation.completed}
                              onCheckedChange={(checked) => handleToggleOperationStatus(operation.id, checked)}
                            />
                            <Label>{operation.completed ? "Completada" : "Pendiente"}</Label>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                        No hay operaciones en este ticket
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

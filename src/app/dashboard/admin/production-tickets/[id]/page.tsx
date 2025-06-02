"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Printer, CreditCard, Trash } from "lucide-react"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { TicketStatus, type ShoeType } from "@/types/production-ticket"
import {
  getProductionTicketById,
  updateShoeTypeStatus,
  markTicketAsPaid,
  deleteProductionTicket,
} from "@/services/production-ticket-service"
import toast from "react-hot-toast"

export default function ProductionTicketDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [mounted, setMounted] = useState(false)
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Verificar si el usuario está autenticado y es admin
    const role = localStorage.getItem("userRole")
    if (!role || (role !== "admin" && role !== "super-user")) {
      router.push("/login/admin")
      return
    }

    // Cargar ticket
    if (params.id) {
      const ticketData = getProductionTicketById(params.id)
      if (ticketData) {
        setTicket(ticketData)
      } else {
        toast.error("Ticket no encontrado")
        router.push("/dashboard/admin/production-tickets")
      }
    }

    return () => setMounted(false)
  }, [router, params.id])

  const handleShoeTypeStatusChange = (shoeType: ShoeType, completed: boolean) => {
    if (!ticket) return

    const updatedTicket = updateShoeTypeStatus(ticket.id, shoeType, completed)
    if (updatedTicket) {
      setTicket(updatedTicket)
      toast.success(`Estado actualizado correctamente`)
    } else {
      toast.error("Error al actualizar el estado")
    }
  }

  const handleMarkAsPaid = () => {
    if (!ticket) return
    setLoading(true)

    try {
      const updatedTicket = markTicketAsPaid(ticket.id)
      if (updatedTicket) {
        setTicket(updatedTicket)
        toast.success(`Ticket marcado como pagado`)
      } else {
        toast.error("Error al marcar como pagado")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error al marcar como pagado")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTicket = () => {
    if (!ticket) return
    setLoading(true)

    try {
      const deleted = deleteProductionTicket(ticket.id)
      if (deleted) {
        toast.success(`Ticket eliminado correctamente`)
        router.push("/dashboard/admin/production-tickets")
      } else {
        toast.error("Error al eliminar el ticket")
        setLoading(false)
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error al eliminar el ticket")
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (!ticket) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <h2 className="text-xl font-medium mb-2">Cargando ticket...</h2>
            <p className="text-gray-500">Por favor espere mientras cargamos la información</p>
          </div>
        </div>
      </div>
    )
  }

  // Calcular el estado de completado
  const completedTypes = ticket.shoeTypes.filter((type) => type.completed).length
  const totalTypes = ticket.shoeTypes.length
  const completionPercentage = Math.round((completedTypes / totalTypes) * 100)

  // Determinar el texto y color del estado
  let statusText = "Desconocido"
  let statusColor = "bg-gray-200"

  switch (ticket.status) {
    case TicketStatus.PENDING:
      statusText = "Pendiente"
      statusColor = "bg-gray-200"
      break
    case TicketStatus.IN_PROGRESS:
      statusText = "En Proceso"
      statusColor = "bg-blue-200"
      break
    case TicketStatus.COMPLETED:
      statusText = "Completado"
      statusColor = "bg-green-200"
      break
    case TicketStatus.PAID:
      statusText = "Pagado"
      statusColor = "bg-purple-200"
      break
  }

  return (
    <div className="p-6">
      <Button
        variant="ghost"
        className={`mb-4 ${mounted ? "animate-fade-in" : "opacity-0"}`}
        onClick={() => router.push("/dashboard/admin/production-tickets")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a la lista
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className={mounted ? "animate-scale-in" : "opacity-0"}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Ticket de Producción #{ticket.id}</CardTitle>
                <CardDescription>Detalles del ticket de producción</CardDescription>
              </div>
              <Badge className={`${statusColor} text-gray-800`}>{statusText}</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Información general del ticket */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-md">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Cliente</h3>
                  <p className="font-medium">{ticket.clientName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Referencia</h3>
                  <p className="font-medium">{ticket.reference}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Serie</h3>
                  <p className="font-medium">{ticket.series}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Color</h3>
                  <p className="font-medium">{ticket.color || "-"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Fecha</h3>
                  <p className="font-medium">{ticket.date}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Semana</h3>
                  <p className="font-medium">{ticket.weekNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Pares</h3>
                  <p className="font-medium">{ticket.totalPairs}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Empleado</h3>
                  <p className="font-medium">{ticket.employeeName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Progreso</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${completionPercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{completionPercentage}%</span>
                  </div>
                </div>
              </div>

              {/* Distribución de tallas */}
              <div>
                <h3 className="text-lg font-medium mb-3">Distribución de Tallas</h3>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                  {ticket.sizes.distribution.map((item) => (
                    <div key={item.size} className="text-center">
                      <div className="bg-white border rounded-md p-2">
                        <div className="text-xs text-gray-500">Talla</div>
                        <div className="font-medium">{item.size}</div>
                        <div className="text-xs text-gray-500">Pares</div>
                        <div className="font-medium">{item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tipos de calzado */}
              <div>
                <h3 className="text-lg font-medium mb-3">Tipos de Calzado</h3>
                <div className="space-y-2">
                  {ticket.shoeTypes.map((shoeType, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-4 p-3 border rounded-md ${
                        shoeType.completed ? "bg-green-50 border-green-200" : "bg-gray-50"
                      }`}
                    >
                      <Checkbox
                        id={`shoe-type-${index}`}
                        checked={shoeType.completed}
                        onCheckedChange={(checked) => handleShoeTypeStatusChange(shoeType.type, !!checked)}
                        disabled={ticket.status === TicketStatus.PAID}
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`shoe-type-${index}`}
                          className={`font-medium ${shoeType.completed ? "line-through text-gray-500" : ""}`}
                        >
                          {shoeType.type}
                        </label>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">{shoeType.quantity} pares</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(true)}
                disabled={loading || ticket.status === TicketStatus.PAID}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir
                </Button>
                <Button
                  onClick={handleMarkAsPaid}
                  disabled={loading || ticket.status === TicketStatus.PAID || ticket.status !== TicketStatus.COMPLETED}
                  className="btn-glow bg-[#2a7da2] hover:bg-[#1c6a8c]"
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
                      Procesando...
                    </span>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Marcar como Pagado
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card className={mounted ? "animate-scale-in animate-delay-100" : "opacity-0"}>
            <CardHeader>
              <CardTitle>Resumen del Ticket</CardTitle>
              <CardDescription>Información resumida del ticket de producción</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">ID del Ticket:</span>
                  <span className="font-medium">#{ticket.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fecha de Creación:</span>
                  <span className="font-medium">{ticket.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Última Actualización:</span>
                  <span className="font-medium">{ticket.updatedAt}</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total de Pares:</span>
                  <span className="font-medium">{ticket.totalPairs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tipos de Calzado:</span>
                  <span className="font-medium">{ticket.shoeTypes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tipos Completados:</span>
                  <span className="font-medium">
                    {completedTypes} de {totalTypes}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Estado del Ticket</h4>
                <div className={`p-3 rounded-md ${statusColor}`}>
                  <div className="font-medium text-gray-800">{statusText}</div>
                  <div className="text-sm text-gray-600">
                    {ticket.status === TicketStatus.PENDING && "El ticket está pendiente de iniciar."}
                    {ticket.status === TicketStatus.IN_PROGRESS && "El ticket está en proceso de producción."}
                    {ticket.status === TicketStatus.COMPLETED && "El ticket ha sido completado y está listo para pago."}
                    {ticket.status === TicketStatus.PAID && "El ticket ha sido pagado."}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Eliminar Ticket"
        description="¿Estás seguro de que deseas eliminar este ticket? Esta acción no se puede deshacer."
        onConfirm={handleDeleteTicket}
      />
    </div>
  )
}

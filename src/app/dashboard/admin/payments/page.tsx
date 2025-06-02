"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, UserRound } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { getWorkers, calculateWorkerPayment } from "@/services/worker-service"
import type { WorkerPayment } from "@/types/worker"
import toast from "react-hot-toast"

export default function PaymentsPage() {
  const router = useRouter()
  const [workers, setWorkers] = useState([])
  const [selectedWorkerId, setSelectedWorkerId] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [payment, setPayment] = useState<WorkerPayment | null>(null)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Verify if the user is authenticated and is admin
    const role = localStorage.getItem("userRole")
    if (!role || (role !== "admin" && role !== "super-user")) {
      router.push("/login/admin")
      return
    }

    // Set default dates to current month
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    setStartDate(firstDay.toISOString().split("T")[0])
    setEndDate(lastDay.toISOString().split("T")[0])

    // Load workers
    const workersList = getWorkers()
    setWorkers(workersList)

    return () => setMounted(false)
  }, [router])

  const handleCalculatePayment = () => {
    if (!selectedWorkerId) {
      toast.error("Por favor seleccione un trabajador")
      return
    }

    setLoading(true)
    try {
      const paymentData = calculateWorkerPayment(selectedWorkerId, startDate, endDate)
      setPayment(paymentData)

      if (!paymentData || paymentData.tickets.length === 0) {
        toast("No hay información de pago para este periodo", {
          icon: "ℹ️",
        })
      }
    } catch (error) {
      console.error("Error al calcular el pago:", error)
      toast.error("Error al calcular el pago")
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = () => {
    // In a real implementation, this would generate a PDF
    toast.success("Exportando reporte de pago a PDF...")
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount)
  }

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
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <Card className={`shadow-lg ${mounted ? "animate-fade-in" : "opacity-0"}`}>
          <CardHeader className="flex flex-row items-center justify-between bg-gray-50 border-b">
            <div>
              <CardTitle className="text-[#2a7da2]">Cálculo de Pagos por Producción</CardTitle>
              <CardDescription>Calcule los pagos de sus trabajadores según su producción</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="worker">Trabajador</Label>
                <Select value={selectedWorkerId} onValueChange={setSelectedWorkerId}>
                  <SelectTrigger id="worker" className="input-3d">
                    <SelectValue placeholder="Seleccionar trabajador" />
                  </SelectTrigger>
                  <SelectContent>
                    {workers.map((worker) => (
                      <SelectItem key={worker.id} value={worker.id}>
                        {worker.name} - {worker.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Fecha Inicio</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input-3d"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Fecha Fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input-3d"
                />
              </div>
            </div>

            <div className="flex justify-end mb-6">
              <Button
                onClick={handleCalculatePayment}
                disabled={loading}
                className="bg-[#2a7da2] hover:bg-[#1c6a8c] text-white"
              >
                {loading ? "Calculando..." : "Calcular Pago"}
              </Button>
            </div>

            {payment && (
              <div className="mt-6 border rounded-md p-4 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <UserRound className="text-[#2a7da2] mr-2" />
                    <h3 className="text-lg font-semibold">{payment.workerName}</h3>
                    <span className="ml-2 text-gray-500">({payment.position})</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportPDF}
                    className="border-[#2a7da2] text-[#2a7da2] hover:bg-[#2a7da2] hover:text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar PDF
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Periodo:</p>
                    <p className="font-medium">
                      {new Date(payment.period.start).toLocaleDateString()} -{" "}
                      {new Date(payment.period.end).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total a pagar:</p>
                    <p className="text-xl font-bold text-[#2a7da2]">{formatCurrency(payment.totalAmount)}</p>
                  </div>
                </div>

                {payment.tickets.length > 0 ? (
                  payment.tickets.map((ticket, ticketIndex) => (
                    <div key={ticket.ticketId} className="mb-4 border rounded-md overflow-hidden">
                      <div className="bg-gray-50 p-2 border-b">
                        <h4 className="font-medium">Ticket #{ticket.ticketId}</h4>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Operación</TableHead>
                            <TableHead className="text-right">Cantidad</TableHead>
                            <TableHead className="text-right">Tarifa</TableHead>
                            <TableHead className="text-right">Subtotal</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ticket.operations.map((op, opIndex) => (
                            <TableRow key={`${ticketIndex}-${opIndex}`}>
                              <TableCell>{op.type}</TableCell>
                              <TableCell className="text-right">{op.quantity}</TableCell>
                              <TableCell className="text-right">{formatCurrency(op.rate)}</TableCell>
                              <TableCell className="text-right font-medium">{formatCurrency(op.subtotal)}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="bg-gray-50">
                            <TableCell colSpan={3} className="text-right font-medium">
                              Total del Ticket:
                            </TableCell>
                            <TableCell className="text-right font-bold">
                              {formatCurrency(ticket.operations.reduce((sum, op) => sum + op.subtotal, 0))}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">No hay tickets de producción para este periodo</div>
                )}

                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-gray-600">Total operaciones:</div>
                    <div className="text-right font-medium">
                      {payment.tickets.reduce((sum, ticket) => sum + ticket.operations.length, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total tickets:</div>
                    <div className="text-right font-medium">{payment.tickets.length}</div>
                    <div className="text-base font-semibold">Total a pagar:</div>
                    <div className="text-right text-lg font-bold text-[#2a7da2]">
                      {formatCurrency(payment.totalAmount)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

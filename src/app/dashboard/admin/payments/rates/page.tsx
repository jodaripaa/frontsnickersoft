"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { WorkerPosition } from "@/types/worker"
import { OperationType } from "@/types/ticket"
import { getPaymentRates, updatePaymentRate } from "@/services/worker-service"
import toast from "react-hot-toast"

export default function PaymentRatesPage() {
  const router = useRouter()
  const [rates, setRates] = useState<Record<string, Record<string, number>>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Define operations by position for better organization
  const operationsByPosition: Record<WorkerPosition, OperationType[]> = {
    [WorkerPosition.CORTADOR]: [OperationType.CORTE],
    [WorkerPosition.MONTADOR]: [OperationType.MONTADO],
    [WorkerPosition.GUARNECEDOR]: [OperationType.GUARNECIDO],
    [WorkerPosition.TERMINADOR]: [OperationType.LATEX, OperationType.ADORNO, OperationType.PLANTA],
    [WorkerPosition.SUPERVISOR]: [],
  }

  useEffect(() => {
    setMounted(true)

    // Verify if the user is authenticated and is admin
    const role = localStorage.getItem("userRole")
    if (!role || (role !== "admin" && role !== "super-user")) {
      router.push("/login/admin")
      return
    }

    // Load payment rates
    const paymentRates = getPaymentRates()

    // Transform array to object for easier manipulation
    const ratesObject: Record<string, Record<string, number>> = {}

    // Initialize with empty rate fields
    Object.values(WorkerPosition).forEach((position) => {
      ratesObject[position] = {}

      // Add relevant operations for this position
      operationsByPosition[position].forEach((operation) => {
        ratesObject[position][operation] = 0
      })
    })

    // Fill in existing rates
    paymentRates.forEach((rate) => {
      if (!ratesObject[rate.position]) {
        ratesObject[rate.position] = {}
      }
      ratesObject[rate.position][rate.operationType] = rate.rate
    })

    setRates(ratesObject)
    setLoading(false)

    return () => setMounted(false)
  }, [router])

  const handleRateChange = (position: WorkerPosition, operation: OperationType, value: string) => {
    const numericValue = Number.parseFloat(value) || 0

    setRates((prev) => ({
      ...prev,
      [position]: {
        ...prev[position],
        [operation]: numericValue,
      },
    }))
  }

  const handleSaveRates = async () => {
    setSaving(true)

    try {
      // Save each rate
      Object.entries(rates).forEach(([position, operations]) => {
        Object.entries(operations).forEach(([operation, rate]) => {
          updatePaymentRate(position as WorkerPosition, operation as OperationType, rate)
        })
      })

      toast.success("Tarifas actualizadas correctamente", {
        duration: 3000,
      })
    } catch (error) {
      console.error("Error al guardar las tarifas:", error)
      toast.error("Error al guardar las tarifas")
    } finally {
      setSaving(false)
    }
  }

  // Helper function to translate position names
  const positionNames: Record<WorkerPosition, string> = {
    [WorkerPosition.CORTADOR]: "Cortador",
    [WorkerPosition.MONTADOR]: "Montador",
    [WorkerPosition.GUARNECEDOR]: "Guarnecedor",
    [WorkerPosition.TERMINADOR]: "Terminador",
    [WorkerPosition.SUPERVISOR]: "Supervisor",
  }

  return (
    <div className="p-6">
      <Button
        variant="ghost"
        className={`mb-4 ${mounted ? "animate-fade-in" : "opacity-0"}`}
        onClick={() => router.push("/dashboard/admin/payments")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a Pagos
      </Button>

      <Card className={mounted ? "animate-scale-in" : "opacity-0"}>
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-[#2a7da2]">Tarifas de Pago</CardTitle>
              <CardDescription>Configura las tarifas de pago por operación y posición</CardDescription>
            </div>
            <Button onClick={handleSaveRates} disabled={saving} className="bg-[#2a7da2] hover:bg-[#1c6a8c] text-white">
              {saving ? (
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
                  Guardar Tarifas
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(operationsByPosition).map(([position, operations]) => {
                // Skip positions with no operations
                if (operations.length === 0) return null

                return (
                  <div key={position} className="border rounded-md overflow-hidden">
                    <div className="bg-gray-50 p-3 border-b">
                      <h3 className="font-medium">{positionNames[position as WorkerPosition]}</h3>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Operación</TableHead>
                          <TableHead className="text-right">Tarifa ($ por unidad)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {operations.map((operation) => (
                          <TableRow key={`${position}-${operation}`}>
                            <TableCell>{operation}</TableCell>
                            <TableCell className="text-right">
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={rates[position as WorkerPosition]?.[operation] || 0}
                                onChange={(e) =>
                                  handleRateChange(position as WorkerPosition, operation, e.target.value)
                                }
                                className="w-24 ml-auto text-right input-3d"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

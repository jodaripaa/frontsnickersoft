"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Plus, Trash } from "lucide-react"
import { type TicketFormValues, OperationType } from "@/types/ticket"
import { addTicket } from "@/services/ticket-service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast from "react-hot-toast"

export default function CreateTicketPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [formValues, setFormValues] = useState<TicketFormValues>({
    clientName: "",
    reference: "",
    series: "",
    color: "",
    date: new Date().toISOString().split("T")[0],
    pairs: 0,
    operations: [],
  })

  useEffect(() => {
    setMounted(true)

    // Verify if the user is authenticated and is admin
    const role = localStorage.getItem("userRole")
    if (!role || (role !== "admin" && role !== "super-user")) {
      router.push("/login/admin")
      return
    }

    return () => setMounted(false)
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues((prev) => ({
      ...prev,
      [name]: name === "pairs" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleAddOperation = () => {
    setFormValues((prev) => ({
      ...prev,
      operations: [...prev.operations, { type: OperationType.BALETA, quantity: 0 }],
    }))
  }

  const handleRemoveOperation = (index: number) => {
    setFormValues((prev) => ({
      ...prev,
      operations: prev.operations.filter((_, i) => i !== index),
    }))
  }

  const handleOperationTypeChange = (value: string, index: number) => {
    setFormValues((prev) => ({
      ...prev,
      operations: prev.operations.map((op, i) => (i === index ? { ...op, type: value as OperationType } : op)),
    }))
  }

  const handleOperationQuantityChange = (value: string, index: number) => {
    setFormValues((prev) => ({
      ...prev,
      operations: prev.operations.map((op, i) => (i === index ? { ...op, quantity: Number.parseInt(value) || 0 } : op)),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!formValues.clientName || !formValues.reference || !formValues.series || !formValues.date) {
        toast.error("Por favor complete todos los campos obligatorios")
        setLoading(false)
        return
      }

      // Validate operations
      if (formValues.operations.length === 0) {
        toast.error("Debe agregar al menos una operación")
        setLoading(false)
        return
      }

      // Check for invalid operations
      const invalidOperation = formValues.operations.find((op) => op.quantity <= 0)
      if (invalidOperation) {
        toast.error("Todas las operaciones deben tener una cantidad mayor a cero")
        setLoading(false)
        return
      }

      // Create ticket
      const newTicket = addTicket(formValues)

      toast.success(`Ticket creado correctamente`, {
        duration: 3000,
      })

      // Redirect to tickets list
      router.push("/dashboard/admin/payments/tickets")
    } catch (error) {
      console.error("Error al crear el ticket:", error)
      toast.error("Error al crear el ticket")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <Button
        variant="ghost"
        className={`mb-4 ${mounted ? "animate-fade-in" : "opacity-0"}`}
        onClick={() => router.push("/dashboard/admin/payments/tickets")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a la lista
      </Button>

      <Card className={mounted ? "animate-scale-in" : "opacity-0"}>
        <CardHeader>
          <CardTitle>Crear Nuevo Ticket de Producción</CardTitle>
          <CardDescription>Ingresa los datos para registrar un nuevo ticket de producción</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Cliente *</Label>
                <Input
                  id="clientName"
                  name="clientName"
                  value={formValues.clientName}
                  onChange={handleChange}
                  required
                  className="input-3d"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reference">Referencia *</Label>
                <Input
                  id="reference"
                  name="reference"
                  value={formValues.reference}
                  onChange={handleChange}
                  required
                  className="input-3d"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="series">Serie *</Label>
                <Input
                  id="series"
                  name="series"
                  value={formValues.series}
                  onChange={handleChange}
                  required
                  className="input-3d"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input id="color" name="color" value={formValues.color} onChange={handleChange} className="input-3d" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Fecha *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formValues.date}
                  onChange={handleChange}
                  required
                  className="input-3d"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pairs">Número de Pares</Label>
                <Input
                  id="pairs"
                  name="pairs"
                  type="number"
                  min="0"
                  value={formValues.pairs.toString()}
                  onChange={handleChange}
                  className="input-3d"
                />
              </div>
            </div>

            <div className="space-y-4 mt-8">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Operaciones</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddOperation}
                  className="border-[#2a7da2] text-[#2a7da2] hover:bg-[#2a7da2] hover:text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Operación
                </Button>
              </div>

              {formValues.operations.length === 0 ? (
                <div className="text-center py-8 border rounded-md bg-gray-50">
                  <p className="text-gray-500">No hay operaciones. Agrega una operación usando el botón de arriba.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {formValues.operations.map((operation, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
                      <div className="flex-1">
                        <Label className="text-xs text-gray-500 mb-1">Tipo de Operación</Label>
                        <Select
                          value={operation.type}
                          onValueChange={(value) => handleOperationTypeChange(value, index)}
                        >
                          <SelectTrigger className="input-3d">
                            <SelectValue placeholder="Selecciona operación" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(OperationType).map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-24">
                        <Label className="text-xs text-gray-500 mb-1">Cantidad</Label>
                        <Input
                          type="number"
                          min="1"
                          value={operation.quantity.toString()}
                          onChange={(e) => handleOperationQuantityChange(e.target.value, index)}
                          className="input-3d"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-5 text-gray-500 hover:text-red-500 hover:bg-gray-100"
                        onClick={() => handleRemoveOperation(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/admin/payments/tickets")}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="btn-glow bg-[#2a7da2] hover:bg-[#1c6a8c]">
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
                  Guardar Ticket
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Plus, Trash } from "lucide-react"
import { type ProductionTicketFormValues, ShoeType } from "@/types/production-ticket"
import { addProductionTicket, getWeekNumber } from "@/services/production-ticket-service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getWorkers } from "@/services/worker-service"
import toast from "react-hot-toast"

export default function CreateProductionTicketPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [workers, setWorkers] = useState([])
  const [formValues, setFormValues] = useState<ProductionTicketFormValues>({
    clientName: "",
    reference: "",
    series: "",
    color: "",
    date: new Date().toISOString().split("T")[0],
    weekNumber: getWeekNumber(new Date()),
    totalPairs: 0,
    employeeId: "",
    shoeTypes: [],
    sizes: {
      from: 21,
      to: 33,
      distribution: [],
    },
  })

  useEffect(() => {
    setMounted(true)

    // Verificar si el usuario está autenticado y es admin
    const role = localStorage.getItem("userRole")
    if (!role || (role !== "admin" && role !== "super-user")) {
      router.push("/login/admin")
      return
    }

    // Cargar trabajadores
    const workersList = getWorkers()
    setWorkers(workersList)

    return () => setMounted(false)
  }, [router])

  // Actualizar la distribución de tallas cuando cambia el rango
  useEffect(() => {
    if (formValues.sizes.from && formValues.sizes.to) {
      const from = Number.parseInt(formValues.sizes.from.toString())
      const to = Number.parseInt(formValues.sizes.to.toString())

      if (from <= to) {
        const distribution = []
        const totalPairs = formValues.totalPairs || 0
        const sizes = to - from + 1

        // Distribuir los pares equitativamente entre las tallas
        let remainingPairs = totalPairs

        for (let size = from; size <= to; size++) {
          const pairsPerSize = Math.floor(totalPairs / sizes)
          distribution.push({ size, quantity: pairsPerSize })
          remainingPairs -= pairsPerSize
        }

        // Distribuir los pares restantes
        for (let i = 0; i < remainingPairs; i++) {
          distribution[i].quantity += 1
        }

        setFormValues((prev) => ({
          ...prev,
          sizes: {
            ...prev.sizes,
            distribution,
          },
        }))
      }
    }
  }, [formValues.sizes.from, formValues.sizes.to, formValues.totalPairs])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues((prev) => ({
      ...prev,
      [name]: name === "totalPairs" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleSizeChange = (field: "from" | "to", value: string) => {
    setFormValues((prev) => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        [field]: Number.parseInt(value) || 0,
      },
    }))
  }

  const handleAddShoeType = () => {
    setFormValues((prev) => ({
      ...prev,
      shoeTypes: [...prev.shoeTypes, { type: ShoeType.BALETA, quantity: 0 }],
    }))
  }

  const handleRemoveShoeType = (index: number) => {
    setFormValues((prev) => ({
      ...prev,
      shoeTypes: prev.shoeTypes.filter((_, i) => i !== index),
    }))
  }

  const handleShoeTypeChange = (value: string, index: number) => {
    setFormValues((prev) => ({
      ...prev,
      shoeTypes: prev.shoeTypes.map((type, i) => (i === index ? { ...type, type: value as ShoeType } : type)),
    }))
  }

  const handleShoeTypeQuantityChange = (value: string, index: number) => {
    setFormValues((prev) => ({
      ...prev,
      shoeTypes: prev.shoeTypes.map((type, i) =>
        i === index ? { ...type, quantity: Number.parseInt(value) || 0 } : type,
      ),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validar campos obligatorios
      if (
        !formValues.clientName ||
        !formValues.reference ||
        !formValues.series ||
        !formValues.date ||
        !formValues.employeeId
      ) {
        toast.error("Por favor complete todos los campos obligatorios")
        setLoading(false)
        return
      }

      // Validar tipos de calzado
      if (formValues.shoeTypes.length === 0) {
        toast.error("Debe agregar al menos un tipo de calzado")
        setLoading(false)
        return
      }

      // Verificar que la cantidad total de pares coincida con la suma de los tipos
      const totalShoeTypePairs = formValues.shoeTypes.reduce((sum, type) => sum + type.quantity, 0)
      if (totalShoeTypePairs !== formValues.totalPairs) {
        toast.error(
          `La suma de pares por tipo (${totalShoeTypePairs}) no coincide con el total de pares (${formValues.totalPairs})`,
        )
        setLoading(false)
        return
      }

      // Crear ticket
      const newTicket = addProductionTicket(formValues)

      toast.success(`Ticket creado correctamente`, {
        duration: 3000,
      })

      // Redirigir a la lista de tickets
      router.push("/dashboard/admin/production-tickets")
    } catch (error) {
      console.error("Error al crear el ticket:", error)
      toast.error("Error al crear el ticket")
    } finally {
      setLoading(false)
    }
  }

  // Calcular el total de pares por tipo
  const totalShoeTypePairs = formValues.shoeTypes.reduce((sum, type) => sum + type.quantity, 0)
  const pairsMatch = totalShoeTypePairs === formValues.totalPairs

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

      <Card className={mounted ? "animate-scale-in" : "opacity-0"}>
        <CardHeader>
          <CardTitle>Crear Nuevo Ticket de Producción</CardTitle>
          <CardDescription>Ingresa los datos para registrar un nuevo ticket de producción</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Información general del ticket */}
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
                <Label htmlFor="weekNumber">Semana</Label>
                <Input
                  id="weekNumber"
                  name="weekNumber"
                  type="number"
                  min="1"
                  max="53"
                  value={formValues.weekNumber.toString()}
                  onChange={handleChange}
                  className="input-3d"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalPairs">Número de Pares *</Label>
                <Input
                  id="totalPairs"
                  name="totalPairs"
                  type="number"
                  min="1"
                  value={formValues.totalPairs.toString()}
                  onChange={handleChange}
                  required
                  className="input-3d"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeId">Empleado *</Label>
                <Select
                  value={formValues.employeeId}
                  onValueChange={(value) => setFormValues((prev) => ({ ...prev, employeeId: value }))}
                >
                  <SelectTrigger id="employeeId" className="input-3d">
                    <SelectValue placeholder="Seleccionar empleado" />
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
            </div>

            {/* Rango de tallas */}
            <div className="border p-4 rounded-md bg-gray-50">
              <h3 className="text-lg font-medium mb-4">Rango de Tallas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sizeFrom">Desde</Label>
                  <Input
                    id="sizeFrom"
                    type="number"
                    min="15"
                    max="50"
                    value={formValues.sizes.from.toString()}
                    onChange={(e) => handleSizeChange("from", e.target.value)}
                    className="input-3d"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sizeTo">Hasta</Label>
                  <Input
                    id="sizeTo"
                    type="number"
                    min="15"
                    max="50"
                    value={formValues.sizes.to.toString()}
                    onChange={(e) => handleSizeChange("to", e.target.value)}
                    className="input-3d"
                  />
                </div>
              </div>

              {formValues.sizes.distribution.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Distribución de Pares por Talla</h4>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {formValues.sizes.distribution.map((item) => (
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
              )}
            </div>

            {/* Tipos de calzado */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Tipos de Calzado</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddShoeType}
                  className="border-[#2a7da2] text-[#2a7da2] hover:bg-[#2a7da2] hover:text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Tipo
                </Button>
              </div>

              {formValues.shoeTypes.length === 0 ? (
                <div className="text-center py-8 border rounded-md bg-gray-50">
                  <p className="text-gray-500">No hay tipos de calzado. Agrega un tipo usando el botón de arriba.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {formValues.shoeTypes.map((shoeType, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
                      <div className="flex-1">
                        <Label className="text-xs text-gray-500 mb-1">Tipo de Calzado</Label>
                        <Select value={shoeType.type} onValueChange={(value) => handleShoeTypeChange(value, index)}>
                          <SelectTrigger className="input-3d">
                            <SelectValue placeholder="Selecciona tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(ShoeType).map((type) => (
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
                          value={shoeType.quantity.toString()}
                          onChange={(e) => handleShoeTypeQuantityChange(e.target.value, index)}
                          className="input-3d"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-5 text-gray-500 hover:text-red-500 hover:bg-gray-100"
                        onClick={() => handleRemoveShoeType(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <div className="flex justify-between p-3 border rounded-md bg-white">
                    <span className="font-medium">Total de pares por tipo:</span>
                    <span className={`font-bold ${pairsMatch ? "text-green-600" : "text-red-600"}`}>
                      {totalShoeTypePairs} / {formValues.totalPairs}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/admin/production-tickets")}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !pairsMatch}
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

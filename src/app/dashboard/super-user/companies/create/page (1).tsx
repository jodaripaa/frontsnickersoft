"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import type { CompanyFormValues } from "@/types/company"

export default function CreateCompanyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formValues, setFormValues] = useState<CompanyFormValues>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    taxId: "",
  })

  useEffect(() => {
    // Verificar si el usuario está autenticado y es super usuario
    const role = localStorage.getItem("userRole")

    if (!role || role !== "super-user") {
      router.push("/login/super-user")
      return
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulación de envío a API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // En una aplicación real, aquí enviarías los datos a tu API
      console.log("Datos de la empresa a crear:", formValues)

      // Redirigir a la lista de empresas
      router.push("/dashboard/super-user/companies")
    } catch (error) {
      console.error("Error al crear la empresa:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <Button variant="ghost" className="mb-4" onClick={() => router.push("/dashboard/super-user/companies")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a la lista
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Crear Nueva Empresa</CardTitle>
          <CardDescription>Ingresa los datos para registrar una nueva empresa en el sistema</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Empresa *</Label>
                <Input id="name" name="name" value={formValues.name} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxId">Identificación Fiscal *</Label>
                <Input id="taxId" name="taxId" value={formValues.taxId} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico *</Label>
                <Input id="email" name="email" type="email" value={formValues.email} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <Input id="phone" name="phone" value={formValues.phone} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input id="address" name="address" value={formValues.address} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input id="city" name="city" value={formValues.city} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">País</Label>
                <Input id="country" name="country" value={formValues.country} onChange={handleChange} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/super-user/companies")}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                "Guardando..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Empresa
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

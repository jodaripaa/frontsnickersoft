"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import type { CompanyFormValues, Company } from "@/types/company"
import { Switch } from "@/components/ui/switch"

// Datos de ejemplo
const initialCompanies: Company[] = [
  {
    id: "1",
    name: "Empresa A",
    email: "contacto@empresaa.com",
    phone: "+34 912 345 678",
    address: "Calle Principal 123",
    city: "Madrid",
    country: "España",
    taxId: "A12345678",
    active: true,
    createdAt: "2023-01-15",
    updatedAt: "2023-01-15",
  },
  {
    id: "2",
    name: "Empresa B",
    email: "info@empresab.com",
    phone: "+34 934 567 890",
    address: "Avenida Central 456",
    city: "Barcelona",
    country: "España",
    taxId: "B87654321",
    active: true,
    createdAt: "2023-02-20",
    updatedAt: "2023-02-20",
  },
  {
    id: "3",
    name: "Empresa C",
    email: "contacto@empresac.com",
    phone: "+34 956 789 012",
    address: "Plaza Mayor 789",
    city: "Sevilla",
    country: "España",
    taxId: "C13579246",
    active: false,
    createdAt: "2023-03-10",
    updatedAt: "2023-04-05",
  },
]

export default function EditCompanyPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(false)
  const [company, setCompany] = useState<Company | null>(null)
  const [formValues, setFormValues] = useState<CompanyFormValues & { active: boolean }>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    taxId: "",
    active: true,
  })

  useEffect(() => {
    // Verificar si el usuario está autenticado y es super usuario
    const role = localStorage.getItem("userRole")

    if (!role || role !== "super-user") {
      router.push("/login/super-user")
      return
    }

    // Cargar datos de la empresa
    const foundCompany = initialCompanies.find((c) => c.id === id)
    if (foundCompany) {
      setCompany(foundCompany)
      setFormValues({
        name: foundCompany.name,
        email: foundCompany.email,
        phone: foundCompany.phone,
        address: foundCompany.address,
        city: foundCompany.city,
        country: foundCompany.country,
        taxId: foundCompany.taxId,
        active: foundCompany.active,
      })
    } else {
      // Si no se encuentra la empresa, redirigir a la lista
      router.push("/dashboard/super-user/companies")
    }
  }, [id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleToggleActive = (checked: boolean) => {
    setFormValues((prev) => ({ ...prev, active: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulación de envío a API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // En una aplicación real, aquí enviarías los datos a tu API
      console.log("Datos de la empresa a actualizar:", { id, ...formValues })

      // Redirigir a la lista de empresas
      router.push("/dashboard/super-user/companies")
    } catch (error) {
      console.error("Error al actualizar la empresa:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!company) {
    return <div className="p-6">Cargando...</div>
  }

  return (
    <div className="p-6">
      <Button variant="ghost" className="mb-4" onClick={() => router.push("/dashboard/super-user/companies")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a la lista
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Editar Empresa</CardTitle>
          <CardDescription>Modifica los datos de la empresa {company.name}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Switch id="active" checked={formValues.active} onCheckedChange={handleToggleActive} />
              <Label htmlFor="active">{formValues.active ? "Empresa Activa" : "Empresa Inactiva"}</Label>
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label>Fecha de Creación</Label>
                <Input value={company.createdAt} disabled />
              </div>

              <div className="space-y-2">
                <Label>Última Actualización</Label>
                <Input value={company.updatedAt} disabled />
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
                  Actualizar Empresa
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

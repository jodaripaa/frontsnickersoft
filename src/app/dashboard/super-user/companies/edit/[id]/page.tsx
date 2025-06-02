"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import type { Company } from "@/types/company"
import { Switch } from "@/components/ui/switch"
import { getCompanyById, updateCompany } from "@/services/company-service"
import toast from "react-hot-toast"

export default function EditCompanyPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(false)
  const [company, setCompany] = useState<Company | null>(null)
  const [mounted, setMounted] = useState(false)
  const [formValues, setFormValues] = useState<Partial<Company> & { active: boolean }>({
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
    setMounted(true)

    // Verificar si el usuario está autenticado y es super usuario
    const role = localStorage.getItem("userRole")

    if (!role || role !== "super-user") {
      router.push("/login/super-user")
      return
    }

    // Cargar datos de la empresa
    const foundCompany = getCompanyById(id)
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
      toast.error("Empresa no encontrada")
      router.push("/dashboard/super-user/companies")
    }

    return () => setMounted(false)
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
      // Validar campos obligatorios
      if (!formValues.name || !formValues.email || !formValues.phone || !formValues.taxId) {
        toast.error("Por favor complete todos los campos obligatorios")
        setLoading(false)
        return
      }

      // Actualizar empresa
      const updatedCompany = updateCompany(id, formValues)

      if (updatedCompany) {
        toast.success(`Empresa ${updatedCompany.name} actualizada correctamente`, {
          icon: "✅",
          duration: 3000,
        })

        // Redirigir a la lista de empresas
        router.push("/dashboard/super-user/companies")
      } else {
        toast.error("Error al actualizar la empresa")
      }
    } catch (error) {
      console.error("Error al actualizar la empresa:", error)
      toast.error("Error al actualizar la empresa")
    } finally {
      setLoading(false)
    }
  }

  if (!company && !mounted) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <Button
        variant="ghost"
        className={`mb-4 ${mounted ? "animate-fade-in" : "opacity-0"}`}
        onClick={() => router.push("/dashboard/super-user/companies")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a la lista
      </Button>

      <Card className={mounted ? "animate-scale-in" : "opacity-0"}>
        <CardHeader>
          <CardTitle>Editar Empresa</CardTitle>
          <CardDescription>Modifica los datos de la empresa {company?.name}</CardDescription>
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
                <Input
                  id="name"
                  name="name"
                  value={formValues.name}
                  onChange={handleChange}
                  required
                  className="input-3d"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxId">Identificación Fiscal *</Label>
                <Input
                  id="taxId"
                  name="taxId"
                  value={formValues.taxId}
                  onChange={handleChange}
                  required
                  className="input-3d"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formValues.email}
                  onChange={handleChange}
                  required
                  className="input-3d"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formValues.phone}
                  onChange={handleChange}
                  required
                  className="input-3d"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  name="address"
                  value={formValues.address}
                  onChange={handleChange}
                  className="input-3d"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input id="city" name="city" value={formValues.city} onChange={handleChange} className="input-3d" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">País</Label>
                <Input
                  id="country"
                  name="country"
                  value={formValues.country}
                  onChange={handleChange}
                  className="input-3d"
                />
              </div>
            </div>

            {company && (
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
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/super-user/companies")}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="btn-glow">
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

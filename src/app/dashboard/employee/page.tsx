"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut } from "lucide-react"

export default function EmployeeDashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState("")

  useEffect(() => {
    // Verificar si el usuario está autenticado y es empleado
    const role = localStorage.getItem("userRole")
    const name = localStorage.getItem("userName")

    if (!role || role !== "employee") {
      router.push("/login/employee")
      return
    }

    setUserName(name || "")
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#2a9d8f] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Panel de Empleado</h1>
          <div className="flex items-center gap-4">
            <span>Bienvenido, {userName}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-white border-white hover:bg-white/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-md">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-[#2a9d8f]">Mi Perfil</CardTitle>
              <CardDescription>Información de tu cuenta</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-700">Nombre:</span>
                  <span>{userName}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-700">Email:</span>
                  <span>empleado@empresa.com</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-700">Departamento:</span>
                  <span>Ventas</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-700">Fecha de registro:</span>
                  <span>01/01/2023</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-[#2a9d8f]">Actividad Reciente</CardTitle>
              <CardDescription>Tus últimas actividades en el sistema</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="border-l-4 border-[#2a9d8f] pl-4 py-2">
                  <p className="font-medium text-gray-700">Inicio de sesión</p>
                  <p className="text-sm text-gray-500">Hace 5 minutos</p>
                </div>
                <div className="border-l-4 border-[#2a9d8f] pl-4 py-2">
                  <p className="font-medium text-gray-700">Actualización de perfil</p>
                  <p className="text-sm text-gray-500">Ayer, 15:30</p>
                </div>
                <div className="border-l-4 border-[#2a9d8f] pl-4 py-2">
                  <p className="font-medium text-gray-700">Envío de reporte</p>
                  <p className="text-sm text-gray-500">03/05/2023, 10:15</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

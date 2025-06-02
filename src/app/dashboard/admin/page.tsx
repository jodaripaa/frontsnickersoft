"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnimatedCounter } from "@/components/animated-counter"
import { getCollaborators } from "@/services/collaborator-service"
import { addUser } from "@/services/user-service"
import { getWorkers } from "@/services/worker-service"
import { getProductionTickets } from "@/services/production-ticket-service"
import { TicketStatus } from "@/types/production-ticket"
import { Users, UserPlus, Briefcase, CreditCard, FileText, BarChart3, Settings, ChevronRight } from "lucide-react"
import toast from "react-hot-toast"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  })
  const [stats, setStats] = useState({
    collaborators: 0,
    workers: 0,
    pendingTickets: 0,
    completedTickets: 0,
  })

  useEffect(() => {
    setMounted(true)

    // Verificar si el usuario está autenticado y es admin
    const role = localStorage.getItem("userRole")
    if (!role || (role !== "admin" && role !== "super-user")) {
      router.push("/login/admin")
      return
    }

    // Cargar estadísticas
    const collaborators = getCollaborators()
    const workers = getWorkers()
    const tickets = getProductionTickets()

    setStats({
      collaborators: collaborators.length,
      workers: workers.length,
      pendingTickets: tickets.filter((t) => t.status === TicketStatus.PENDING || t.status === TicketStatus.IN_PROGRESS)
        .length,
      completedTickets: tickets.filter((t) => t.status === TicketStatus.COMPLETED || t.status === TicketStatus.PAID)
        .length,
    })

    return () => setMounted(false)
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value) => {
    setFormData((prev) => ({ ...prev, role: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validar campos
      if (!formData.name || !formData.email || !formData.password) {
        toast.error("Por favor complete todos los campos")
        setLoading(false)
        return
      }

      // Crear usuario
      const newUser = addUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })

      toast.success(`Usuario ${formData.name} creado correctamente`, {
        duration: 3000,
      })

      // Limpiar formulario
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "employee",
      })
    } catch (error) {
      console.error("Error al crear usuario:", error)
      toast.error("Error al crear el usuario")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className={`text-3xl font-bold mb-6 ${mounted ? "animate-fade-in" : "opacity-0"}`}>
        Panel de Administración
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className={`${mounted ? "animate-scale-in" : "opacity-0"} animate-delay-100`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Colaboradores</p>
                <h3 className="text-2xl font-bold mt-1">
                  <AnimatedCounter value={stats.collaborators} />
                </h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${mounted ? "animate-scale-in" : "opacity-0"} animate-delay-200`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Trabajadores</p>
                <h3 className="text-2xl font-bold mt-1">
                  <AnimatedCounter value={stats.workers} />
                </h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${mounted ? "animate-scale-in" : "opacity-0"} animate-delay-300`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Tickets Pendientes</p>
                <h3 className="text-2xl font-bold mt-1">
                  <AnimatedCounter value={stats.pendingTickets} />
                </h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${mounted ? "animate-scale-in" : "opacity-0"} animate-delay-400`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Tickets Completados</p>
                <h3 className="text-2xl font-bold mt-1">
                  <AnimatedCounter value={stats.completedTickets} />
                </h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className={mounted ? "animate-scale-in animate-delay-500" : "opacity-0"}>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Accede rápidamente a las funciones principales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-4 px-4 justify-start text-left"
                  onClick={() => router.push("/dashboard/admin/collaborators")}
                >
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Gestionar Colaboradores</h3>
                      <p className="text-sm text-gray-500">Administra los colaboradores de la empresa</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 px-4 justify-start text-left"
                  onClick={() => router.push("/dashboard/admin/payments")}
                >
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <CreditCard className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Gestionar Pagos</h3>
                      <p className="text-sm text-gray-500">Administra los pagos a trabajadores</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 px-4 justify-start text-left"
                  onClick={() => router.push("/dashboard/admin/production-tickets")}
                >
                  <div className="flex items-center">
                    <div className="bg-yellow-100 p-2 rounded-full mr-3">
                      <FileText className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Tickets de Producción</h3>
                      <p className="text-sm text-gray-500">Gestiona los tickets de producción</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 px-4 justify-start text-left"
                  onClick={() => router.push("/dashboard/admin/payments/rates")}
                >
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <Settings className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Tarifas de Pago</h3>
                      <p className="text-sm text-gray-500">Configura las tarifas de pago por tarea</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className={mounted ? "animate-scale-in animate-delay-600" : "opacity-0"}>
            <CardHeader>
              <CardTitle>Crear Usuario</CardTitle>
              <CardDescription>Añade un nuevo usuario al sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-3d"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-3d"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-3d"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <Select value={formData.role} onValueChange={handleRoleChange}>
                    <SelectTrigger id="role" className="input-3d">
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Empleado</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={loading} className="w-full btn-glow bg-[#2a7da2] hover:bg-[#1c6a8c]">
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
                      Creando...
                    </span>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Crear Usuario
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

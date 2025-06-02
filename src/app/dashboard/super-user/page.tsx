"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button3d } from "@/components/ui/button-3d"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Card3D from "@/components/ui/card-3d"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserPlus, LogOut, Building, Users, Eye, EyeOff, BarChart, Activity, Users2 } from "lucide-react"
import Link from "next/link"
import { addUser, getUsersByRole, type User } from "@/services/user-service"
import { AnimatedCounter } from "@/components/animated-counter"
import toast from "react-hot-toast"

export default function SuperUserDashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [adminUsers, setAdminUsers] = useState<User[]>([])
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)

    // Verificar si el usuario está autenticado y es super usuario
    const role = localStorage.getItem("userRole")
    const name = localStorage.getItem("userName")

    if (!role || role !== "super-user") {
      router.push("/login/super-user")
      return
    }

    setUserName(name || "")

    // Cargar usuarios administrativos
    const admins = getUsersByRole("admin")
    setAdminUsers(admins)

    // Efecto de paralaje para el header
    const handleScroll = () => {
      if (headerRef.current) {
        const scrollY = window.scrollY
        headerRef.current.style.backgroundPositionY = `${scrollY * 0.5}px`
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      setMounted(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    router.push("/")
  }

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validar que no exista un usuario con el mismo email
      const existingAdmin = adminUsers.find((admin) => admin.email === newAdmin.email)
      if (existingAdmin) {
        toast.error("Ya existe un usuario con ese email")
        setLoading(false)
        return
      }

      // Crear nuevo usuario administrativo
      const createdAdmin = addUser({
        name: newAdmin.name,
        email: newAdmin.email,
        password: newAdmin.password,
        role: "admin",
      })

      // Actualizar la lista de usuarios
      setAdminUsers([...adminUsers, createdAdmin])

      // Limpiar el formulario
      setNewAdmin({ name: "", email: "", password: "" })

      toast.success(`Se ha creado el usuario ${createdAdmin.name} correctamente`, {
        icon: "✅",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        duration: 3000,
      })
    } catch (error) {
      console.error("Error al crear usuario:", error)
      toast.error("Ha ocurrido un error al crear el usuario")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-mesh">
      <header
        ref={headerRef}
        className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-6 shadow-lg relative overflow-hidden"
        style={{ backgroundSize: "200% 200%" }}
      >
        {/* Partículas decorativas */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 10 + 10}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold">Panel de Super Usuario</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/10 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              Bienvenido, <span className="font-semibold">{userName}</span>
            </div>
            <Button3d
              size="sm"
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              variant="outline"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button3d>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {/* Estadísticas */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ${mounted ? "animate-fade-in" : "opacity-0"}`}>
          <Card3D className="glass-card rounded-xl overflow-hidden">
            <div className="p-6 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Users2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Usuarios</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  <AnimatedCounter end={adminUsers.length + 1} duration={2000} />
                </h3>
              </div>
            </div>
          </Card3D>

          <Card3D className="glass-card rounded-xl overflow-hidden">
            <div className="p-6 flex items-center">
              <div className="rounded-full bg-cyan-100 p-3 mr-4">
                <Building className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Empresas</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  <AnimatedCounter end={3} duration={2000} />
                </h3>
              </div>
            </div>
          </Card3D>

          <Card3D className="glass-card rounded-xl overflow-hidden">
            <div className="p-6 flex items-center">
              <div className="rounded-full bg-emerald-100 p-3 mr-4">
                <Activity className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Actividad Reciente</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  <AnimatedCounter end={12} duration={2000} suffix=" acciones" />
                </h3>
              </div>
            </div>
          </Card3D>
        </div>

        {/* Menú de navegación */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ${mounted ? "animate-fade-in delay-200" : "opacity-0"}`}
        >
          <Card3D className="card-hover-3d border-t-4 border-blue-600">
            <Link href="/dashboard/super-user" className="block h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-blue-600">Panel Principal</CardTitle>
              </CardHeader>
              <CardContent>
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <p className="text-sm text-gray-600">Gestión de usuarios administrativos</p>
              </CardContent>
            </Link>
          </Card3D>

          <Card3D className="card-hover-3d border-t-4 border-blue-600">
            <Link href="/dashboard/super-user/companies" className="block h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-blue-600">Gestión de Empresas</CardTitle>
              </CardHeader>
              <CardContent>
                <Building className="h-8 w-8 text-blue-600 mb-2" />
                <p className="text-sm text-gray-600">Administrar empresas del sistema</p>
              </CardContent>
            </Link>
          </Card3D>

          <Card3D className="card-hover-3d border-t-4 border-blue-600">
            <Link href="#" className="block h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-blue-600">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart className="h-8 w-8 text-blue-600 mb-2" />
                <p className="text-sm text-gray-600">Visualizar métricas del sistema</p>
              </CardContent>
            </Link>
          </Card3D>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card3D
            className={`glass-card rounded-xl overflow-hidden shadow-xl ${mounted ? "animate-slide-in-left" : "opacity-0"}`}
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-t-xl">
              <h2 className="text-xl font-bold">Crear Usuario Administrativo</h2>
              <p className="text-blue-100 text-sm mt-1">Crea nuevas cuentas para empresarios o administradores</p>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    Nombre de la Empresa
                  </Label>
                  <div className="perspective-container">
                    <Input
                      id="name"
                      value={newAdmin.name}
                      onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                      required
                      className="input-3d perspective-card"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Usuario
                  </Label>
                  <div className="perspective-container">
                    <Input
                      id="email"
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                      required
                      className="input-3d perspective-card"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                    Contraseña
                  </Label>
                  <div className="relative perspective-container">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                      required
                      className="input-3d perspective-card pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button3d type="submit" className="w-full h-12 rounded-lg font-medium mt-4" disabled={loading}>
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
                      Creando usuario...
                    </span>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Crear Usuario Administrativo
                    </>
                  )}
                </Button3d>
              </form>
            </div>
          </Card3D>

          <Card3D
            className={`glass-card rounded-xl overflow-hidden shadow-xl ${mounted ? "animate-slide-in-right" : "opacity-0"}`}
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-t-xl">
              <h2 className="text-xl font-bold">Usuarios Administrativos</h2>
              <p className="text-blue-100 text-sm mt-1">Lista de empresarios y administradores registrados</p>
            </div>
            <div className="p-6">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold">Nombre</TableHead>
                      <TableHead className="font-semibold">Usuario</TableHead>
                      <TableHead className="font-semibold">Fecha Creación</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminUsers.length > 0 ? (
                      adminUsers.map((user, index) => (
                        <TableRow
                          key={user.id}
                          className="table-row-hover"
                          style={{
                            animationName: "fadeIn",
                            animationDuration: "0.5s",
                            animationFillMode: "both",
                            animationDelay: `${index * 0.1 + 0.5}s`,
                          }}
                        >
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.createdAt}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                          <div className="flex flex-col items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-10 w-10 text-gray-300 mb-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                              />
                            </svg>
                            No hay usuarios administrativos registrados
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card3D>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-gray-50 to-gray-100 border-t py-8 mt-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-500/5"
              style={{
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 10 + 10}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span className="font-bold text-gray-800">Sistema de Gestión</span>
              </div>
              <p className="text-sm text-gray-600">© {new Date().getFullYear()} Todos los derechos reservados.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors hover-scale">
                Términos y Condiciones
              </a>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors hover-scale">
                Política de Privacidad
              </a>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors hover-scale">
                Ayuda
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

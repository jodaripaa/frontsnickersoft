"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserPlus, LogOut } from "lucide-react"

export default function SuperUserDashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [adminUsers, setAdminUsers] = useState([
    { id: 1, name: "Empresa A", email: "admin1@empresa.com", createdAt: "2023-01-15" },
    { id: 2, name: "Empresa B", email: "admin2@empresa.com", createdAt: "2023-02-20" },
  ])
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" })

  useEffect(() => {
    // Verificar si el usuario está autenticado y es super usuario
    const role = localStorage.getItem("userRole")
    const name = localStorage.getItem("userName")

    if (!role || role !== "super-user") {
      router.push("/login/super-user")
      return
    }

    setUserName(name || "")
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    router.push("/")
  }

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault()

    // En una aplicación real, esto enviaría los datos a una API
    const newAdminUser = {
      id: adminUsers.length + 1,
      name: newAdmin.name,
      email: newAdmin.email,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setAdminUsers([...adminUsers, newAdminUser])
    setNewAdmin({ name: "", email: "", password: "" })
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-slate-900 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Panel de Super Usuario</h1>
          <div className="flex items-center gap-4">
            <span>Bienvenido, {userName}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Crear Usuario Administrativo</CardTitle>
              <CardDescription>Crea nuevas cuentas para empresarios o administradores</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de la Empresa</Label>
                  <Input
                    id="name"
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Crear Usuario Administrativo
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usuarios Administrativos</CardTitle>
              <CardDescription>Lista de empresarios y administradores registrados</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Fecha Creación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.createdAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

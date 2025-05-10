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

export default function AdminDashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [employees, setEmployees] = useState([
    { id: 1, name: "Juan Pérez", email: "juan@empresa.com", department: "Ventas", createdAt: "2023-03-10" },
    { id: 2, name: "María López", email: "maria@empresa.com", department: "Marketing", createdAt: "2023-04-05" },
  ])
  const [newEmployee, setNewEmployee] = useState({ name: "", email: "", department: "", password: "" })

  useEffect(() => {
    // Verificar si el usuario está autenticado y es administrativo
    const role = localStorage.getItem("userRole")
    const name = localStorage.getItem("userName")

    if (!role || role !== "admin") {
      router.push("/login/admin")
      return
    }

    setUserName(name || "")
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    router.push("/")
  }

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault()

    // En una aplicación real, esto enviaría los datos a una API
    const newEmployeeUser = {
      id: employees.length + 1,
      name: newEmployee.name,
      email: newEmployee.email,
      department: newEmployee.department,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setEmployees([...employees, newEmployeeUser])
    setNewEmployee({ name: "", email: "", department: "", password: "" })
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-amber-700 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Panel Administrativo</h1>
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
              <CardTitle>Crear Usuario Empleado</CardTitle>
              <CardDescription>Crea nuevas cuentas para empleados de tu empresa</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateEmployee} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Input
                    id="department"
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newEmployee.password}
                    onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Crear Usuario Empleado
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Empleados</CardTitle>
              <CardDescription>Lista de empleados registrados</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Fecha Registro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.createdAt}</TableCell>
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

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Calendar, User, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable } from "@/components/ui/data-table"
import { TicketStatus, type ProductionTicket } from "@/types/production-ticket"
import { getProductionTickets, getWeekNumber } from "@/services/production-ticket-service"
import { getWorkers } from "@/services/worker-service"

export default function ProductionTicketsPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [tickets, setTickets] = useState<ProductionTicket[]>([])
  const [filteredTickets, setFilteredTickets] = useState<ProductionTicket[]>([])
  const [workers, setWorkers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [employeeFilter, setEmployeeFilter] = useState<string>("all")
  const [weekFilter, setWeekFilter] = useState<string>(getWeekNumber(new Date()).toString())

  useEffect(() => {
    setMounted(true)

    // Verificar si el usuario está autenticado y es admin
    const role = localStorage.getItem("userRole")
    if (!role || (role !== "admin" && role !== "super-user")) {
      router.push("/login/admin")
      return
    }

    // Cargar tickets y trabajadores
    const ticketsList = getProductionTickets()
    setTickets(ticketsList)
    setFilteredTickets(ticketsList)

    const workersList = getWorkers()
    setWorkers(workersList)

    return () => setMounted(false)
  }, [router])

  // Aplicar filtros cuando cambian
  useEffect(() => {
    let result = tickets

    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(
        (ticket) =>
          ticket.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.employeeName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por estado
    if (statusFilter !== "all") {
      result = result.filter((ticket) => ticket.status === statusFilter)
    }

    // Filtrar por empleado
    if (employeeFilter !== "all") {
      result = result.filter((ticket) => ticket.employeeId === employeeFilter)
    }

    // Filtrar por semana
    if (weekFilter !== "all") {
      result = result.filter((ticket) => ticket.weekNumber.toString() === weekFilter)
    }

    setFilteredTickets(result)
  }, [searchTerm, statusFilter, employeeFilter, weekFilter, tickets])

  // Columnas para la tabla de tickets
  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div>,
    },
    {
      accessorKey: "clientName",
      header: "Cliente",
    },
    {
      accessorKey: "reference",
      header: "Referencia",
    },
    {
      accessorKey: "series",
      header: "Serie",
    },
    {
      accessorKey: "totalPairs",
      header: "Pares",
      cell: ({ row }) => <div className="text-center">{row.getValue("totalPairs")}</div>,
    },
    {
      accessorKey: "employeeName",
      header: "Empleado",
    },
    {
      accessorKey: "date",
      header: "Fecha",
    },
    {
      accessorKey: "weekNumber",
      header: "Semana",
      cell: ({ row }) => <div className="text-center">{row.getValue("weekNumber")}</div>,
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.getValue("status") as TicketStatus
        let badgeVariant = "default"
        let badgeText = "Desconocido"

        switch (status) {
          case TicketStatus.PENDING:
            badgeVariant = "outline"
            badgeText = "Pendiente"
            break
          case TicketStatus.IN_PROGRESS:
            badgeVariant = "secondary"
            badgeText = "En Proceso"
            break
          case TicketStatus.COMPLETED:
            badgeVariant = "default"
            badgeText = "Completado"
            break
          case TicketStatus.PAID:
            badgeVariant = "success"
            badgeText = "Pagado"
            break
        }

        return <Badge variant={badgeVariant}>{badgeText}</Badge>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const ticket = row.original
        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/dashboard/admin/production-tickets/${ticket.id}`)}
            >
              <FileText className="h-4 w-4" />
              <span className="sr-only">Ver detalles</span>
            </Button>
          </div>
        )
      },
    },
  ]

  // Generar opciones para el filtro de semanas
  const weekOptions = []
  const currentWeek = getWeekNumber(new Date())
  for (let i = 1; i <= 53; i++) {
    weekOptions.push(
      <SelectItem key={i} value={i.toString()}>
        Semana {i} {i === currentWeek ? "(Actual)" : ""}
      </SelectItem>,
    )
  }

  return (
    <div className="p-6">
      <Card className={mounted ? "animate-scale-in" : "opacity-0"}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tickets de Producción</CardTitle>
            <CardDescription>Gestiona los tickets de producción de los empleados</CardDescription>
          </div>
          <Button
            onClick={() => router.push("/dashboard/admin/production-tickets/create")}
            className="btn-glow bg-[#2a7da2] hover:bg-[#1c6a8c]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Ticket
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
              <TabsList className="mb-4 md:mb-0">
                <TabsTrigger value="all" onClick={() => setStatusFilter("all")}>
                  Todos
                </TabsTrigger>
                <TabsTrigger value={TicketStatus.PENDING} onClick={() => setStatusFilter(TicketStatus.PENDING)}>
                  Pendientes
                </TabsTrigger>
                <TabsTrigger value={TicketStatus.IN_PROGRESS} onClick={() => setStatusFilter(TicketStatus.IN_PROGRESS)}>
                  En Proceso
                </TabsTrigger>
                <TabsTrigger value={TicketStatus.COMPLETED} onClick={() => setStatusFilter(TicketStatus.COMPLETED)}>
                  Completados
                </TabsTrigger>
                <TabsTrigger value={TicketStatus.PAID} onClick={() => setStatusFilter(TicketStatus.PAID)}>
                  Pagados
                </TabsTrigger>
              </TabsList>

              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Buscar tickets..."
                    className="pl-8 w-full md:w-[200px] input-3d"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
                    <SelectTrigger className="w-full md:w-[180px] input-3d">
                      <User className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filtrar por empleado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los empleados</SelectItem>
                      {workers.map((worker) => (
                        <SelectItem key={worker.id} value={worker.id}>
                          {worker.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={weekFilter} onValueChange={setWeekFilter}>
                    <SelectTrigger className="w-full md:w-[180px] input-3d">
                      <Calendar className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filtrar por semana" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las semanas</SelectItem>
                      {weekOptions}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <TabsContent value="all" className="m-0">
              <DataTable columns={columns} data={filteredTickets} />
            </TabsContent>
            <TabsContent value={TicketStatus.PENDING} className="m-0">
              <DataTable
                columns={columns}
                data={filteredTickets.filter((ticket) => ticket.status === TicketStatus.PENDING)}
              />
            </TabsContent>
            <TabsContent value={TicketStatus.IN_PROGRESS} className="m-0">
              <DataTable
                columns={columns}
                data={filteredTickets.filter((ticket) => ticket.status === TicketStatus.IN_PROGRESS)}
              />
            </TabsContent>
            <TabsContent value={TicketStatus.COMPLETED} className="m-0">
              <DataTable
                columns={columns}
                data={filteredTickets.filter((ticket) => ticket.status === TicketStatus.COMPLETED)}
              />
            </TabsContent>
            <TabsContent value={TicketStatus.PAID} className="m-0">
              <DataTable
                columns={columns}
                data={filteredTickets.filter((ticket) => ticket.status === TicketStatus.PAID)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

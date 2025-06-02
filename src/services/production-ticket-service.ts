import {
  type ProductionTicket,
  type ProductionTicketFormValues,
  TicketStatus,
  ShoeType,
} from "@/types/production-ticket"
import { getUserById } from "./user-service"

// Función para obtener todos los tickets de producción
export function getProductionTickets(): ProductionTicket[] {
  if (typeof window === "undefined") return []

  const ticketsJson = localStorage.getItem("productionTickets")
  if (!ticketsJson) {
    // Inicializar con tickets de ejemplo
    const defaultTickets: ProductionTicket[] = [
      {
        id: "1",
        clientName: "MARTHA LOCAL 146",
        reference: "505",
        series: "21-33",
        color: "PARIS ROJO CORREA NORMAL",
        date: "2023-04-07",
        weekNumber: 14,
        totalPairs: 13,
        employeeId: "1",
        employeeName: "Juan Pérez",
        shoeTypes: [
          { type: ShoeType.BALETA, quantity: 3, completed: true },
          { type: ShoeType.MOCASIN, quantity: 2, completed: true },
          { type: ShoeType.BOCAPESCADO, quantity: 2, completed: false },
          { type: ShoeType.SANDALIA, quantity: 2, completed: false },
          { type: ShoeType.PARTIDA, quantity: 1, completed: false },
          { type: ShoeType.PUNTUDA, quantity: 2, completed: false },
          { type: ShoeType.TIRA, quantity: 1, completed: false },
        ],
        sizes: {
          from: 21,
          to: 33,
          distribution: [
            { size: 21, quantity: 1 },
            { size: 22, quantity: 1 },
            { size: 23, quantity: 1 },
            { size: 24, quantity: 1 },
            { size: 25, quantity: 1 },
            { size: 26, quantity: 1 },
            { size: 27, quantity: 1 },
            { size: 28, quantity: 1 },
            { size: 29, quantity: 1 },
            { size: 30, quantity: 1 },
            { size: 31, quantity: 1 },
            { size: 32, quantity: 1 },
            { size: 33, quantity: 1 },
          ],
        },
        status: TicketStatus.IN_PROGRESS,
        createdAt: "2023-04-07",
        updatedAt: "2023-04-07",
      },
    ]
    localStorage.setItem("productionTickets", JSON.stringify(defaultTickets))
    return defaultTickets
  }

  return JSON.parse(ticketsJson)
}

// Función para obtener un ticket de producción por ID
export function getProductionTicketById(id: string): ProductionTicket | null {
  const tickets = getProductionTickets()
  return tickets.find((ticket) => ticket.id === id) || null
}

// Función para obtener tickets de producción por empleado
export function getProductionTicketsByEmployee(employeeId: string): ProductionTicket[] {
  const tickets = getProductionTickets()
  return tickets.filter((ticket) => ticket.employeeId === employeeId)
}

// Función para obtener tickets de producción por semana
export function getProductionTicketsByWeek(weekNumber: number): ProductionTicket[] {
  const tickets = getProductionTickets()
  return tickets.filter((ticket) => ticket.weekNumber === weekNumber)
}

// Función para añadir un nuevo ticket de producción
export function addProductionTicket(ticketData: ProductionTicketFormValues): ProductionTicket {
  const tickets = getProductionTickets()

  // Obtener información del empleado
  const employee = getUserById(ticketData.employeeId)
  if (!employee) {
    throw new Error("Empleado no encontrado")
  }

  const newTicket: ProductionTicket = {
    ...ticketData,
    id: Date.now().toString(),
    employeeName: employee.name,
    shoeTypes: ticketData.shoeTypes.map((type) => ({
      ...type,
      completed: false,
    })),
    status: TicketStatus.PENDING,
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  }

  tickets.push(newTicket)
  localStorage.setItem("productionTickets", JSON.stringify(tickets))

  return newTicket
}

// Función para actualizar un ticket de producción
export function updateProductionTicket(id: string, ticketData: Partial<ProductionTicket>): ProductionTicket | null {
  const tickets = getProductionTickets()
  const index = tickets.findIndex((ticket) => ticket.id === id)

  if (index === -1) return null

  tickets[index] = {
    ...tickets[index],
    ...ticketData,
    updatedAt: new Date().toISOString().split("T")[0],
  }

  localStorage.setItem("productionTickets", JSON.stringify(tickets))
  return tickets[index]
}

// Función para actualizar el estado de un tipo de calzado
export function updateShoeTypeStatus(
  ticketId: string,
  shoeType: ShoeType,
  completed: boolean,
): ProductionTicket | null {
  const tickets = getProductionTickets()
  const ticketIndex = tickets.findIndex((ticket) => ticket.id === ticketId)

  if (ticketIndex === -1) return null

  const shoeTypeIndex = tickets[ticketIndex].shoeTypes.findIndex((type) => type.type === shoeType)
  if (shoeTypeIndex === -1) return null

  tickets[ticketIndex].shoeTypes[shoeTypeIndex].completed = completed

  // Verificar si todos los tipos están completados
  const allCompleted = tickets[ticketIndex].shoeTypes.every((type) => type.completed)
  if (allCompleted) {
    tickets[ticketIndex].status = TicketStatus.COMPLETED
  } else {
    tickets[ticketIndex].status = TicketStatus.IN_PROGRESS
  }

  tickets[ticketIndex].updatedAt = new Date().toISOString().split("T")[0]
  localStorage.setItem("productionTickets", JSON.stringify(tickets))

  return tickets[ticketIndex]
}

// Función para marcar un ticket como pagado
export function markTicketAsPaid(id: string): ProductionTicket | null {
  const tickets = getProductionTickets()
  const index = tickets.findIndex((ticket) => ticket.id === id)

  if (index === -1) return null

  tickets[index].status = TicketStatus.PAID
  tickets[index].updatedAt = new Date().toISOString().split("T")[0]

  localStorage.setItem("productionTickets", JSON.stringify(tickets))
  return tickets[index]
}

// Función para eliminar un ticket de producción
export function deleteProductionTicket(id: string): boolean {
  const tickets = getProductionTickets()
  const filteredTickets = tickets.filter((ticket) => ticket.id !== id)

  if (filteredTickets.length === tickets.length) {
    return false // No se encontró el ticket
  }

  localStorage.setItem("productionTickets", JSON.stringify(filteredTickets))
  return true
}

// Función para calcular el número de semana de una fecha
export function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

// Función para obtener la fecha de inicio y fin de una semana
export function getWeekRange(weekNumber: number, year: number): { start: string; end: string } {
  const firstDayOfYear = new Date(year, 0, 1)
  const daysToFirstMonday = (8 - firstDayOfYear.getDay()) % 7
  const firstMonday = new Date(year, 0, 1 + daysToFirstMonday)

  const startDate = new Date(firstMonday)
  startDate.setDate(startDate.getDate() + (weekNumber - 1) * 7)

  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 6)

  return {
    start: startDate.toISOString().split("T")[0],
    end: endDate.toISOString().split("T")[0],
  }
}

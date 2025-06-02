import { type Ticket, type TicketFormValues, type TicketOperation, OperationType } from "@/types/ticket"

// Function to get all tickets
export function getTickets(): Ticket[] {
  if (typeof window === "undefined") return []

  const ticketsJson = localStorage.getItem("tickets")
  if (!ticketsJson) {
    // Initialize with sample tickets
    const defaultTickets: Ticket[] = [
      {
        id: "1",
        clientName: "MARTHA LOCAL 146",
        reference: "505",
        series: "21-33",
        color: "PARIS ROJO CORREA NORMAL",
        date: "2023-04-07",
        pairs: 13,
        operations: [
          { id: "1", type: OperationType.BALETA, quantity: 5, completed: true },
          { id: "2", type: OperationType.MOCASIN, quantity: 3, completed: true },
          { id: "3", type: OperationType.LATEX, quantity: 13, completed: false },
          { id: "4", type: OperationType.CORTE, quantity: 13, completed: false },
        ],
      },
    ]
    localStorage.setItem("tickets", JSON.stringify(defaultTickets))
    return defaultTickets
  }

  return JSON.parse(ticketsJson)
}

// Function to get a ticket by ID
export function getTicketById(id: string): Ticket | null {
  const tickets = getTickets()
  return tickets.find((ticket) => ticket.id === id) || null
}

// Function to add a new ticket
export function addTicket(ticketData: TicketFormValues): Ticket {
  const tickets = getTickets()

  // Create operations from the form data
  const operations: TicketOperation[] = ticketData.operations.map((op, index) => ({
    id: `${Date.now()}-${index}`,
    type: op.type,
    quantity: op.quantity,
    completed: false,
  }))

  const newTicket: Ticket = {
    id: Date.now().toString(),
    clientName: ticketData.clientName,
    reference: ticketData.reference,
    series: ticketData.series,
    color: ticketData.color,
    date: ticketData.date,
    pairs: ticketData.pairs,
    operations,
  }

  tickets.push(newTicket)
  localStorage.setItem("tickets", JSON.stringify(tickets))

  return newTicket
}

// Function to update a ticket
export function updateTicket(id: string, ticketData: Partial<Ticket>): Ticket | null {
  const tickets = getTickets()
  const index = tickets.findIndex((ticket) => ticket.id === id)

  if (index === -1) return null

  tickets[index] = {
    ...tickets[index],
    ...ticketData,
  }

  localStorage.setItem("tickets", JSON.stringify(tickets))
  return tickets[index]
}

// Function to delete a ticket
export function deleteTicket(id: string): boolean {
  const tickets = getTickets()
  const filteredTickets = tickets.filter((ticket) => ticket.id !== id)

  if (filteredTickets.length === tickets.length) {
    return false // No ticket was found with the given ID
  }

  localStorage.setItem("tickets", JSON.stringify(filteredTickets))
  return true
}

// Function to update operation status
export function updateOperationStatus(ticketId: string, operationId: string, completed: boolean): boolean {
  const tickets = getTickets()
  const ticketIndex = tickets.findIndex((ticket) => ticket.id === ticketId)

  if (ticketIndex === -1) return false

  const operationIndex = tickets[ticketIndex].operations.findIndex((op) => op.id === operationId)
  if (operationIndex === -1) return false

  tickets[ticketIndex].operations[operationIndex].completed = completed
  localStorage.setItem("tickets", JSON.stringify(tickets))

  return true
}

import { type Worker, WorkerPosition, type WorkerPaymentRate, type WorkerPayment } from "@/types/worker"
import { OperationType } from "@/types/ticket"
import { getTickets } from "./ticket-service"

// Function to get all workers
export function getWorkers(): Worker[] {
  if (typeof window === "undefined") return []

  const workersJson = localStorage.getItem("workers")
  if (!workersJson) {
    // Initialize with sample workers
    const defaultWorkers: Worker[] = [
      {
        id: "1",
        name: "Juan Pérez",
        position: WorkerPosition.CORTADOR,
        active: true,
        joinDate: "2022-01-15",
      },
      {
        id: "2",
        name: "María López",
        position: WorkerPosition.MONTADOR,
        active: true,
        joinDate: "2022-03-10",
      },
      {
        id: "3",
        name: "Carlos Rodríguez",
        position: WorkerPosition.GUARNECEDOR,
        active: true,
        joinDate: "2022-02-05",
      },
    ]
    localStorage.setItem("workers", JSON.stringify(defaultWorkers))
    return defaultWorkers
  }

  return JSON.parse(workersJson)
}

// Function to get a worker by ID
export function getWorkerById(id: string): Worker | null {
  const workers = getWorkers()
  return workers.find((worker) => worker.id === id) || null
}

// Function to add a new worker
export function addWorker(workerData: Omit<Worker, "id">): Worker {
  const workers = getWorkers()

  const newWorker: Worker = {
    ...workerData,
    id: Date.now().toString(),
  }

  workers.push(newWorker)
  localStorage.setItem("workers", JSON.stringify(workers))

  return newWorker
}

// Function to update a worker
export function updateWorker(id: string, workerData: Partial<Worker>): Worker | null {
  const workers = getWorkers()
  const index = workers.findIndex((worker) => worker.id === id)

  if (index === -1) return null

  workers[index] = {
    ...workers[index],
    ...workerData,
  }

  localStorage.setItem("workers", JSON.stringify(workers))
  return workers[index]
}

// Function to delete a worker
export function deleteWorker(id: string): boolean {
  const workers = getWorkers()
  const filteredWorkers = workers.filter((worker) => worker.id !== id)

  if (filteredWorkers.length === workers.length) {
    return false // No worker was found with the given ID
  }

  localStorage.setItem("workers", JSON.stringify(filteredWorkers))
  return true
}

// Function to get all payment rates
export function getPaymentRates(): WorkerPaymentRate[] {
  if (typeof window === "undefined") return []

  const ratesJson = localStorage.getItem("paymentRates")
  if (!ratesJson) {
    // Initialize with sample payment rates
    const defaultRates: WorkerPaymentRate[] = [
      { position: WorkerPosition.CORTADOR, operationType: OperationType.CORTE, rate: 5 },
      { position: WorkerPosition.MONTADOR, operationType: OperationType.MONTADO, rate: 7 },
      { position: WorkerPosition.GUARNECEDOR, operationType: OperationType.GUARNECIDO, rate: 6 },
      { position: WorkerPosition.TERMINADOR, operationType: OperationType.LATEX, rate: 4 },
      { position: WorkerPosition.TERMINADOR, operationType: OperationType.ADORNO, rate: 3 },
      { position: WorkerPosition.TERMINADOR, operationType: OperationType.PLANTA, rate: 5 },
    ]
    localStorage.setItem("paymentRates", JSON.stringify(defaultRates))
    return defaultRates
  }

  return JSON.parse(ratesJson)
}

// Function to update payment rates
export function updatePaymentRate(position: WorkerPosition, operationType: OperationType, rate: number): boolean {
  const rates = getPaymentRates()
  const index = rates.findIndex((r) => r.position === position && r.operationType === operationType)

  if (index !== -1) {
    rates[index].rate = rate
  } else {
    rates.push({ position, operationType, rate })
  }

  localStorage.setItem("paymentRates", JSON.stringify(rates))
  return true
}

// Function to calculate worker payment for a period
export function calculateWorkerPayment(workerId: string, startDate: string, endDate: string): WorkerPayment | null {
  const worker = getWorkerById(workerId)
  if (!worker) return null

  const tickets = getTickets()
  const rates = getPaymentRates()

  // Filter tickets by date range
  const periodTickets = tickets.filter((ticket) => ticket.date >= startDate && ticket.date <= endDate)

  // Initialize payment structure
  const payment: WorkerPayment = {
    workerId: worker.id,
    workerName: worker.name,
    position: worker.position,
    period: { start: startDate, end: endDate },
    tickets: [],
    totalAmount: 0,
  }

  // Process tickets
  periodTickets.forEach((ticket) => {
    const ticketPayment = {
      ticketId: ticket.id,
      operations: [] as {
        type: OperationType
        quantity: number
        rate: number
        subtotal: number
      }[],
    }

    // Process each operation in the ticket
    ticket.operations.forEach((op) => {
      // Check if this operation is applicable for this worker's position
      const rateInfo = rates.find((r) => r.position === worker.position && r.operationType === op.type)

      // If there's a rate for this operation and worker position
      if (rateInfo && op.completed) {
        const subtotal = op.quantity * rateInfo.rate
        ticketPayment.operations.push({
          type: op.type,
          quantity: op.quantity,
          rate: rateInfo.rate,
          subtotal,
        })
        payment.totalAmount += subtotal
      }
    })

    // Only add the ticket if it has operations for this worker
    if (ticketPayment.operations.length > 0) {
      payment.tickets.push(ticketPayment)
    }
  })

  return payment
}

import type { OperationType } from "./operationType" // Assuming OperationType is declared in another file

export interface Worker {
  id: string
  name: string
  position: WorkerPosition
  active: boolean
  joinDate: string
}

export enum WorkerPosition {
  CORTADOR = "CORTADOR",
  MONTADOR = "MONTADOR",
  GUARNECEDOR = "GUARNECEDOR",
  TERMINADOR = "TERMINADOR",
  SUPERVISOR = "SUPERVISOR",
}

export interface WorkerPaymentRate {
  position: WorkerPosition
  operationType: OperationType
  rate: number // Rate per unit
}

export interface WorkerPayment {
  workerId: string
  workerName: string
  position: WorkerPosition
  period: {
    start: string
    end: string
  }
  tickets: {
    ticketId: string
    operations: {
      type: OperationType
      quantity: number
      rate: number
      subtotal: number
    }[]
  }[]
  totalAmount: number
}

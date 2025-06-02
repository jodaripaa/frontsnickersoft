export interface ProductionTicket {
  id: string
  clientName: string
  reference: string
  series: string
  color: string
  date: string
  weekNumber: number
  totalPairs: number
  employeeId: string
  employeeName: string
  shoeTypes: ShoeTypeQuantity[]
  sizes: SizeRange
  status: TicketStatus
  createdAt: string
  updatedAt: string
}

export interface ShoeTypeQuantity {
  type: ShoeType
  quantity: number
  completed: boolean
  rate?: number // Tarifa por par
}

export enum ShoeType {
  BALETA = "BALETA",
  MOCASIN = "MOCASIN",
  BOCAPESCADO = "BOCAPESCADO",
  SANDALIA = "SANDALIA",
  PARTIDA = "PARTIDA",
  PUNTUDA = "PUNTUDA",
  TIRA = "TIRA",
}

export interface SizeRange {
  from: number
  to: number
  distribution: SizeDistribution[]
}

export interface SizeDistribution {
  size: number
  quantity: number
}

export enum TicketStatus {
  PENDING = "PENDIENTE",
  IN_PROGRESS = "EN_PROCESO",
  COMPLETED = "COMPLETADO",
  PAID = "PAGADO",
}

export interface ProductionTicketFormValues {
  clientName: string
  reference: string
  series: string
  color: string
  date: string
  weekNumber: number
  totalPairs: number
  employeeId: string
  shoeTypes: {
    type: ShoeType
    quantity: number
  }[]
  sizes: {
    from: number
    to: number
    distribution: {
      size: number
      quantity: number
    }[]
  }
}

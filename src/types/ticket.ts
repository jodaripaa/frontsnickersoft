export interface Ticket {
  id: string
  clientName: string
  reference: string
  series: string
  color: string
  date: string
  pairs: number
  operations: TicketOperation[]
}

export interface TicketOperation {
  id: string
  type: OperationType
  quantity: number
  completed: boolean
}

export enum OperationType {
  BALETA = "BALETA",
  MOCASIN = "MOCASIN",
  BOCAPESCADO = "BOCAPESCADO",
  SANDALIA = "SANDALIA",
  PARTIDA = "PARTIDA",
  PUNTUDA = "PUNTUDA",
  TIRA = "TIRA",
  LATEX = "LATEX",
  ADORNO = "ADORNO",
  CORTE = "CORTE",
  MONTADO = "MONTADO",
  PLANTA = "PLANTA",
  GUARNECIDO = "GUARNECIDO",
}

export interface TicketFormValues {
  clientName: string
  reference: string
  series: string
  color: string
  date: string
  pairs: number
  operations: {
    type: OperationType
    quantity: number
  }[]
}

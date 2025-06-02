import type { Collaborator, CollaboratorFormValues } from "@/types/collaborator"

// Función para obtener todos los colaboradores de una empresa
export function getCollaborators(companyId: string): Collaborator[] {
  if (typeof window === "undefined") return []

  const collaboratorsJson = localStorage.getItem(`collaborators_${companyId}`)
  if (!collaboratorsJson) {
    // Inicializar con colaboradores de ejemplo
    const defaultCollaborators: Collaborator[] = [
      {
        id: "1",
        name: "Juan Pérez",
        email: "juan.perez@empresa.com",
        phone: "+34 612 345 678",
        position: "Desarrollador Frontend",
        department: "Tecnología",
        joinDate: "2022-01-15",
        active: true,
        companyId,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      },
      {
        id: "2",
        name: "María López",
        email: "maria.lopez@empresa.com",
        phone: "+34 623 456 789",
        position: "Diseñadora UX/UI",
        department: "Diseño",
        joinDate: "2022-03-10",
        active: true,
        companyId,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      },
      {
        id: "3",
        name: "Carlos Rodríguez",
        email: "carlos.rodriguez@empresa.com",
        phone: "+34 634 567 890",
        position: "Analista de Datos",
        department: "Business Intelligence",
        joinDate: "2021-11-05",
        active: false,
        companyId,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      },
    ]
    localStorage.setItem(`collaborators_${companyId}`, JSON.stringify(defaultCollaborators))
    return defaultCollaborators
  }

  return JSON.parse(collaboratorsJson)
}

// Función para obtener un colaborador por ID
export function getCollaboratorById(companyId: string, id: string): Collaborator | null {
  const collaborators = getCollaborators(companyId)
  return collaborators.find((collaborator) => collaborator.id === id) || null
}

// Función para añadir un nuevo colaborador
export function addCollaborator(companyId: string, collaborator: CollaboratorFormValues): Collaborator {
  const collaborators = getCollaborators(companyId)

  const newCollaborator: Collaborator = {
    ...collaborator,
    id: Date.now().toString(),
    active: true,
    companyId,
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  }

  collaborators.push(newCollaborator)
  localStorage.setItem(`collaborators_${companyId}`, JSON.stringify(collaborators))

  // También añadimos el usuario al sistema para que pueda iniciar sesión
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  users.push({
    id: newCollaborator.id,
    name: newCollaborator.name,
    email: newCollaborator.email,
    password: collaborator.password,
    role: "employee",
    createdAt: newCollaborator.createdAt,
    companyId,
  })
  localStorage.setItem("users", JSON.stringify(users))

  return newCollaborator
}

// Función para actualizar un colaborador
export function updateCollaborator(
  companyId: string,
  id: string,
  collaboratorData: Partial<Collaborator>,
): Collaborator | null {
  const collaborators = getCollaborators(companyId)
  const index = collaborators.findIndex((collaborator) => collaborator.id === id)

  if (index === -1) return null

  const updatedCollaborator = {
    ...collaborators[index],
    ...collaboratorData,
    updatedAt: new Date().toISOString().split("T")[0],
  }

  collaborators[index] = updatedCollaborator
  localStorage.setItem(`collaborators_${companyId}`, JSON.stringify(collaborators))

  // Actualizar también el usuario en el sistema si se cambió el email o nombre
  if (collaboratorData.email || collaboratorData.name) {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const userIndex = users.findIndex((user: any) => user.id === id)
    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        ...(collaboratorData.name && { name: collaboratorData.name }),
        ...(collaboratorData.email && { email: collaboratorData.email }),
      }
      localStorage.setItem("users", JSON.stringify(users))
    }
  }

  return updatedCollaborator
}

// Función para cambiar el estado de un colaborador (activar/desactivar)
export function toggleCollaboratorStatus(companyId: string, id: string): Collaborator | null {
  const collaborators = getCollaborators(companyId)
  const index = collaborators.findIndex((collaborator) => collaborator.id === id)

  if (index === -1) return null

  collaborators[index] = {
    ...collaborators[index],
    active: !collaborators[index].active,
    updatedAt: new Date().toISOString().split("T")[0],
  }

  localStorage.setItem(`collaborators_${companyId}`, JSON.stringify(collaborators))
  return collaborators[index]
}

// Función para eliminar un colaborador
export function deleteCollaborator(companyId: string, id: string): boolean {
  const collaborators = getCollaborators(companyId)
  const filteredCollaborators = collaborators.filter((collaborator) => collaborator.id !== id)

  if (filteredCollaborators.length === collaborators.length) {
    return false // No se encontró el colaborador
  }

  localStorage.setItem(`collaborators_${companyId}`, JSON.stringify(filteredCollaborators))

  // Eliminar también el usuario del sistema
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const filteredUsers = users.filter((user: any) => user.id !== id)
  localStorage.setItem("users", JSON.stringify(filteredUsers))

  return true
}

// Función para obtener colaboradores activos
export function getActiveCollaborators(companyId: string): Collaborator[] {
  const collaborators = getCollaborators(companyId)
  return collaborators.filter((collaborator) => collaborator.active)
}

// Función para obtener el ID de la empresa del usuario actual
export function getCurrentCompanyId(): string {
  // En un sistema real, esto vendría de la sesión o token
  // Para este ejemplo, usaremos el ID del usuario admin como ID de empresa
  const userId = localStorage.getItem("userId") || ""
  return userId
}

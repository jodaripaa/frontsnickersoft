// Tipos de usuarios
export type UserRole = "super-user" | "admin" | "employee"

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  createdAt: string
  department?: string
  active?: boolean
}

// Función para obtener todos los usuarios
export function getUsers(): User[] {
  if (typeof window === "undefined") return []

  const usersJson = localStorage.getItem("users")
  if (!usersJson) {
    // Inicializar con el Super User por defecto
    const defaultUsers: User[] = [
      {
        id: "1",
        name: "Super Admin",
        email: "admin",
        password: "admin123",
        role: "super-user",
        createdAt: new Date().toISOString().split("T")[0],
        active: true,
      },
    ]
    localStorage.setItem("users", JSON.stringify(defaultUsers))
    return defaultUsers
  }

  return JSON.parse(usersJson)
}

// Función para añadir un nuevo usuario
export function addUser(user: Omit<User, "id" | "createdAt">): User {
  const users = getUsers()

  // Verificar si ya existe un usuario con el mismo email
  const existingUser = users.find((u) => u.email === user.email)
  if (existingUser) {
    throw new Error(`Ya existe un usuario con el email ${user.email}`)
  }

  const newUser: User = {
    ...user,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split("T")[0],
    active: true,
  }

  users.push(newUser)
  localStorage.setItem("users", JSON.stringify(users))

  console.log("Usuario creado:", newUser)
  return newUser
}

// Función para verificar credenciales
export function verifyCredentials(email: string, password: string): User | null {
  const users = getUsers()
  console.log("Verificando credenciales para:", email)
  console.log("Usuarios disponibles:", users)

  const user = users.find((u) => u.email === email && u.password === password && u.active !== false)

  if (user) {
    console.log("Usuario encontrado:", user)
  } else {
    console.log("Usuario no encontrado o inactivo")
  }

  return user || null
}

// Función para obtener usuarios por rol
export function getUsersByRole(role: UserRole): User[] {
  const users = getUsers()
  return users.filter((u) => u.role === role && u.active !== false)
}

// Función para obtener un usuario por ID
export function getUserById(id: string): User | null {
  const users = getUsers()
  return users.find((u) => u.id === id) || null
}

// Función para actualizar un usuario
export function updateUser(id: string, userData: Partial<User>): User | null {
  const users = getUsers()
  const userIndex = users.findIndex((u) => u.id === id)

  if (userIndex === -1) return null

  // Si se está actualizando el email, verificar que no exista otro usuario con ese email
  if (userData.email && userData.email !== users[userIndex].email) {
    const existingUser = users.find((u) => u.email === userData.email && u.id !== id)
    if (existingUser) {
      throw new Error(`Ya existe un usuario con el email ${userData.email}`)
    }
  }

  users[userIndex] = {
    ...users[userIndex],
    ...userData,
  }

  localStorage.setItem("users", JSON.stringify(users))
  return users[userIndex]
}

// Función para eliminar un usuario
export function deleteUser(id: string): boolean {
  const users = getUsers()
  const filteredUsers = users.filter((u) => u.id !== id)

  if (filteredUsers.length === users.length) return false

  localStorage.setItem("users", JSON.stringify(filteredUsers))
  return true
}

// Función para desactivar un usuario
export function deactivateUser(id: string): User | null {
  return updateUser(id, { active: false })
}

// Función para activar un usuario
export function activateUser(id: string): User | null {
  return updateUser(id, { active: true })
}

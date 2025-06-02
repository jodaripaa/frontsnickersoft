export interface Collaborator {
  id: string
  name: string
  email: string
  phone: string
  position: string
  department: string
  joinDate: string
  active: boolean
  companyId: string
  createdAt: string
  updatedAt: string
}

export interface CollaboratorFormValues {
  name: string
  email: string
  phone: string
  position: string
  department: string
  joinDate: string
  password: string
}

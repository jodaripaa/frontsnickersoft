export interface Company {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  taxId: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface CompanyFormValues {
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  taxId: string
}

import type { Company, CompanyFormValues } from "@/types/company"

// Función para obtener todas las empresas
export function getCompanies(): Company[] {
  if (typeof window === "undefined") return []

  const companiesJson = localStorage.getItem("companies")
  if (!companiesJson) {
    // Inicializar con empresas de ejemplo
    const defaultCompanies: Company[] = [
      {
        id: "1",
        name: "Empresa A",
        email: "contacto@empresaa.com",
        phone: "+34 912 345 678",
        address: "Calle Principal 123",
        city: "Madrid",
        country: "España",
        taxId: "A12345678",
        active: true,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      },
      {
        id: "2",
        name: "Empresa B",
        email: "info@empresab.com",
        phone: "+34 934 567 890",
        address: "Avenida Central 456",
        city: "Barcelona",
        country: "España",
        taxId: "B87654321",
        active: true,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      },
      {
        id: "3",
        name: "Empresa C",
        email: "contacto@empresac.com",
        phone: "+34 956 789 012",
        address: "Plaza Mayor 789",
        city: "Sevilla",
        country: "España",
        taxId: "C13579246",
        active: false,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      },
    ]
    localStorage.setItem("companies", JSON.stringify(defaultCompanies))
    return defaultCompanies
  }

  return JSON.parse(companiesJson)
}

// Función para obtener una empresa por ID
export function getCompanyById(id: string): Company | null {
  const companies = getCompanies()
  return companies.find((company) => company.id === id) || null
}

// Función para añadir una nueva empresa
export function addCompany(company: CompanyFormValues): Company {
  const companies = getCompanies()

  const newCompany: Company = {
    ...company,
    id: Date.now().toString(),
    active: true,
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  }

  companies.push(newCompany)
  localStorage.setItem("companies", JSON.stringify(companies))

  return newCompany
}

// Función para actualizar una empresa
export function updateCompany(id: string, companyData: Partial<Company>): Company | null {
  const companies = getCompanies()
  const index = companies.findIndex((company) => company.id === id)

  if (index === -1) return null

  const updatedCompany = {
    ...companies[index],
    ...companyData,
    updatedAt: new Date().toISOString().split("T")[0],
  }

  companies[index] = updatedCompany
  localStorage.setItem("companies", JSON.stringify(companies))

  return updatedCompany
}

// Función para cambiar el estado de una empresa (activar/desactivar)
export function toggleCompanyStatus(id: string): Company | null {
  const companies = getCompanies()
  const index = companies.findIndex((company) => company.id === id)

  if (index === -1) return null

  companies[index] = {
    ...companies[index],
    active: !companies[index].active,
    updatedAt: new Date().toISOString().split("T")[0],
  }

  localStorage.setItem("companies", JSON.stringify(companies))
  return companies[index]
}

// Función para eliminar una empresa
export function deleteCompany(id: string): boolean {
  const companies = getCompanies()
  const filteredCompanies = companies.filter((company) => company.id !== id)

  if (filteredCompanies.length === companies.length) {
    return false // No se encontró la empresa
  }

  localStorage.setItem("companies", JSON.stringify(filteredCompanies))
  return true
}

// Función para obtener empresas activas
export function getActiveCompanies(): Company[] {
  const companies = getCompanies()
  return companies.filter((company) => company.active)
}

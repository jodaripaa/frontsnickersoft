import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      {/* Elementos decorativos */}
      <div className="fixed top-20 left-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="fixed top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="fixed -bottom-20 left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-md space-y-8 animate-fade-in z-10">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-full blur-xl opacity-20 animate-pulse-slow"></div>
              <div className="relative bg-white p-4 rounded-full shadow-lg animate-float-shadow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight text-gradient animate-blur-in">
            Sistema de Gestión
          </h1>
          <p className="mt-3 text-gray-600 animate-fade-in delay-300">
            Seleccione su tipo de usuario para iniciar sesión
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8 border border-white/50 shadow-xl">
          <div className="space-y-6">
            <Link href="/login/super-user" className="block w-full">
              <Button className="w-full h-14 rounded-xl font-medium text-lg shadow-md hover:shadow-lg transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white btn-glow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Super Usuario
              </Button>
            </Link>

            <Link href="/login/admin" className="block w-full">
              <Button className="w-full h-14 rounded-xl font-medium text-lg shadow-md hover:shadow-lg transition-all duration-300 bg-cyan-500 hover:bg-cyan-600 text-white btn-glow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Empresario / Administrativo
              </Button>
            </Link>

            <Link href="/login/employee" className="block w-full">
              <Button className="w-full h-14 rounded-xl font-medium text-lg shadow-md hover:shadow-lg transition-all duration-300 bg-emerald-500 hover:bg-emerald-600 text-white btn-glow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Empleado
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 animate-fade-in delay-500">
          <p>© {new Date().getFullYear()} Sistema de Gestión. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  )
}

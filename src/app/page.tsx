import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 p-4 text-white">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-slate-800/50 p-8 shadow-lg backdrop-blur">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Sistema de Gestión</h1>
          <p className="mt-2 text-slate-300">Seleccione su tipo de usuario para iniciar sesión</p>
        </div>

        <div className="mt-8 space-y-4">
          <Link href="/login/super-user" className="w-full">
            <Button variant="default" className="w-full bg-red-600 hover:bg-red-700">
              Super Usuario
            </Button>
          </Link>

          <Link href="/login/admin" className="w-full">
            <Button variant="default" className="w-full bg-amber-600 hover:bg-amber-700">
              Empresario / Administrativo
            </Button>
          </Link>

          <Link href="/login/employee" className="w-full">
            <Button variant="default" className="w-full bg-emerald-600 hover:bg-emerald-700">
              Empleado
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

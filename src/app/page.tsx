import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Sistema de Gestión</h1>
          <p className="mt-2 text-gray-600">Seleccione su tipo de usuario para iniciar sesión</p>
        </div>

        <div className="mt-8 space-y-4">
          <Link href="/login/super-user" className="w-full block">
            <Button className="w-full bg-[#2d4a6d] hover:bg-[#1e3a5f] text-white">Super Usuario</Button>
          </Link>
          <Link href="/login/admin" className="w-full block">
            <Button className="w-full bg-[#2d4a6d] hover:bg-[#1e3a5f] text-white">Admin</Button>
          </Link>
          <Link href="/login/employee" className="w-full block">
            <Button className="w-full bg-[#2d4a6d] hover:bg-[#1e3a5f] text-white">Colaborador</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

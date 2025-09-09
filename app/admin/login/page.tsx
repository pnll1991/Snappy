import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { decrypt } from "@/lib/session"
import AdminLoginForm from "@/components/admin/login-form"

export default async function LoginPage() {
  // If already logged in, go to dashboard
  const session = cookies().get("session")?.value
  const payload = await decrypt(session)
  if (payload) {
    redirect("/admin/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-light">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold font-display">Iniciar Sesión</CardTitle>
          <CardDescription>Ingresá tus credenciales para acceder al panel de administración.</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminLoginForm />
        </CardContent>
      </Card>
    </div>
  )
}

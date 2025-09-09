"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { login } from "@/app/admin/actions"

type State = { error?: string } | undefined

export default function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState<State, FormData>(login, undefined)

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="username">Usuario</Label>
        <Input id="username" name="username" type="text" placeholder="admin" required autoComplete="username" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" name="password" type="password" required autoComplete="current-password" />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Ingresando..." : "Acceder"}
      </Button>
    </form>
  )
}

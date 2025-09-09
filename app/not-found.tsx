import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-light">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Página no encontrada</h2>
        <p className="text-muted-foreground mb-8">La página que buscás no existe o ha sido movida.</p>
        <Button asChild size="lg" variant="glass">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  )
}

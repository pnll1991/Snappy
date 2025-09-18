import Link from "next/link"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WhatsappButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5491141498531"
  const whatsappLink = `https://wa.me/${number}`

  return (
    <Button
      asChild
      variant="whatsapp"
      size="icon-whatsapp"
      className="fixed bottom-6 right-6 z-50 shadow-lg"
      aria-label="Contactanos por WhatsApp"
    >
      <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="w-8 h-8" />
      </Link>
    </Button>
  )
}

import Link from "next/link"
import { MessageCircle } from "lucide-react"

export default function WhatsappButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5491141498531"
  const whatsappLink = `https://wa.me/${number}`

  return (
    <Link
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-transform hover:scale-110"
      aria-label="Contactanos por WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
    </Link>
  )
}

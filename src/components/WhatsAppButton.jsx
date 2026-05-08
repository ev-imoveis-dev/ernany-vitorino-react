import React from 'react'
import { MessageCircle } from 'lucide-react'
import { useConfig } from '../context/ConfigContext'

function formatarWhatsApp(tel) {
  if (!tel) return null
  const numeros = tel.replace(/\D/g, '')
  return numeros.startsWith('55') ? numeros : `55${numeros}`
}

const WhatsAppButton = () => {
  const config = useConfig()
  const numero = formatarWhatsApp(config?.telefone1)
  if (!numero) return null

  const message = encodeURIComponent('Olá, tenho interesse em um imóvel.')
  const whatsappUrl = `https://wa.me/${numero}?text=${message}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
      aria-label="Fale pelo WhatsApp"
    >
      <MessageCircle size={32} fill="white" />
      <span className="absolute right-full mr-3 bg-white text-dark px-3 py-1 rounded-md text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-md">
        Fale conosco
      </span>
    </a>
  )
}

export default WhatsAppButton

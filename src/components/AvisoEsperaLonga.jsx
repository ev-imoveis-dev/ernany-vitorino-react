import React from 'react'
import { Loader2 } from 'lucide-react'

// Mostrado no lugar do texto de carregamento quando a espera passa dos segundos
// iniciais: o visitante precisa ver que algo continua acontecendo.
export default function AvisoEsperaLonga() {
  return (
    <div className="flex flex-col items-center gap-4 px-6 text-center">
      <Loader2 size={32} className="text-secondary animate-spin" aria-hidden="true" />
      <p className="text-gray-500 text-lg max-w-sm" role="status">
        O servidor está iniciando. Isso pode levar até um minuto.
      </p>
    </div>
  )
}

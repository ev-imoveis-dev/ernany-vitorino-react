import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

// Grade de miniaturas do formulario de imovel (cadastro e edicao).
// A ordem da lista e a ordem publicada: a primeira foto e a capa.
export default function GaleriaUpload({ imagens, onRemover, onMover }) {
  const [arrastando, setArrastando] = useState(null)
  const [alvo, setAlvo] = useState(null)

  if (!Array.isArray(imagens) || imagens.length === 0) return null

  function limparArraste() {
    setArrastando(null)
    setAlvo(null)
  }

  function handleDragOver(e, index) {
    e.preventDefault()
    if (arrastando !== null && alvo !== index) setAlvo(index)
  }

  function handleDrop(e, index) {
    e.preventDefault()
    if (arrastando !== null && arrastando !== index) onMover(arrastando, index)
    limparArraste()
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
      {imagens.map((foto, index) => {
        const sendoArrastada = arrastando === index
        const alvoDeSoltura = alvo === index && arrastando !== null && arrastando !== index

        return (
          <div
            key={index}
            draggable
            onDragStart={() => setArrastando(index)}
            onDragOver={e => handleDragOver(e, index)}
            onDrop={e => handleDrop(e, index)}
            onDragEnd={limparArraste}
            className={`relative group aspect-square rounded-xl cursor-move transition-all ${
              sendoArrastada ? 'opacity-50' : ''
            } ${alvoDeSoltura ? 'ring-2 ring-secondary' : ''}`}
          >
            <img
              src={foto.preview}
              alt={`Preview ${index + 1}`}
              draggable={false}
              className="w-full h-full object-cover rounded-xl border border-gray-100"
            />

            <button
              type="button"
              onClick={() => onMover(index, index - 1)}
              disabled={index === 0}
              aria-label="Mover foto para trás"
              className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
            </button>

            <button
              type="button"
              onClick={() => onMover(index, index + 1)}
              disabled={index === imagens.length - 1}
              aria-label="Mover foto para frente"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
            >
              <ChevronRight size={14} />
            </button>

            <button
              type="button"
              onClick={() => onRemover(index)}
              aria-label="Remover foto"
              className="absolute top-2 right-2 bg-red-500/90 text-white rounded-full p-1.5 shadow-lg transition-colors hover:bg-red-600"
            >
              <X size={14} />
            </button>

            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">
              {index + 1}
            </div>
          </div>
        )
      })}
    </div>
  )
}

import { useEffect, useState } from 'react'

// Diz quando um carregamento ja passou do tempo esperado, para a tela trocar a
// mensagem curta por uma explicacao — o cold start do servidor leva ate um minuto.
export function useEsperaLonga(carregando, ms = 4000) {
  const [demorou, setDemorou] = useState(false)

  useEffect(() => {
    if (!carregando) return

    const timer = setTimeout(() => setDemorou(true), ms)
    // Zera ao sair do carregamento (e no unmount), para a proxima espera
    // comecar de novo pela mensagem curta.
    return () => {
      clearTimeout(timer)
      setDemorou(false)
    }
  }, [carregando, ms])

  return carregando && demorou
}

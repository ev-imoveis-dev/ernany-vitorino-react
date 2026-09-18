import { useEffect } from 'react'
import { API_BASE_URL } from '../services/api'

// A API roda no plano free do Render e dorme depois de 15 minutos sem trafego,
// levando cerca de um minuto para religar. Um toque no /health assim que o site
// abre faz o servico comecar a acordar enquanto o visitante le a home.
let jaAqueceu = false

export function useWarmupApi() {
  useEffect(() => {
    if (jaAqueceu) return
    if (!API_BASE_URL) return

    jaAqueceu = true

    // fetch direto, sem a instancia do axios: o ping nao precisa de credenciais
    // nem do interceptor que desloga em 401. Falhar aqui nao e erro.
    fetch(`${API_BASE_URL}/health`).catch(() => {})
  }, [])
}

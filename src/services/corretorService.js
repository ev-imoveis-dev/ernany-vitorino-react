const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api'

export async function cadastrarCorretor(dados) {
    const response = await fetch(`${BASE_URL}/auth/registrar-corretor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.erro || 'Erro ao cadastrar corretor')
    return data
}
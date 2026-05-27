export function formatCurrencyInputBRL(value) {
  const digits = String(value ?? '').replace(/\D/g, '')

  if (!digits) return ''

  return `R$ ${Number(digits).toLocaleString('pt-BR')}`
}

export function parseCurrencyInputBRL(value) {
  const digits = String(value ?? '').replace(/\D/g, '')
  return digits ? Number(digits) : 0
}

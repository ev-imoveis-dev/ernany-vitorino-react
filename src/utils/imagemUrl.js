// Tamanhos entregues pelo Cloudinary. c_limit impede que fotos menores
// sejam ampliadas; f_auto entrega WebP/AVIF para quem suporta.
const PRESETS = {
  card: 'f_auto,q_auto,c_limit,w_600',
  galeria: 'f_auto,q_auto,c_limit,w_1600',
  zoom: 'f_auto,q_auto,c_limit,w_2560',
  og: 'f_auto,q_auto,c_limit,w_1200',
}

const MARCADOR = '/image/upload/'

export function urlImagem(url, preset) {
  if (typeof url !== 'string' || !url) return url

  const transformacao = PRESETS[preset]
  if (!transformacao) return url

  // URL de outra origem ou blob: do preview passa sem alteracao.
  const posicao = url.indexOf(MARCADOR)
  if (posicao === -1) return url

  const inicio = posicao + MARCADOR.length
  const resto = url.slice(inicio)

  // Se o trecho apos /upload/ nao e a versao (v123), ja ha transformacao.
  const primeiroTrecho = resto.split('/')[0]
  if (resto.includes('/') && !/^v\d+$/.test(primeiroTrecho)) return url

  return `${url.slice(0, inicio)}${transformacao}/${resto}`
}

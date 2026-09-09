export function criarItemImagem(file) {
  return {
    file,
    preview: URL.createObjectURL(file),
  }
}

export function criarItemImagemExistente(url) {
  return {
    url,
    preview: url,
  }
}

export function montarFormDataImovel(form, extras = {}) {
  const formData = new FormData()
  const { imagens = [], ...campos } = form

  Object.entries({ ...campos, ...extras }).forEach(([chave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== '' && !Number.isNaN(valor)) {
      formData.append(chave, valor)
    }
  })

  const urlsExistentes = imagens
    .map(item => item?.url)
    .filter(Boolean)

  if (Array.isArray(imagens)) {
    formData.append('imagensExistentes', JSON.stringify(urlsExistentes))
  }

  // Ordem final da galeria, na sequencia exata da tela: a URL para as fotos ja
  // salvas e o marcador __novo__<n> para os arquivos enviados neste request,
  // onde <n> e a posicao do arquivo dentro do campo `imagens`.
  const ordemImagens = []
  let indiceArquivo = 0

  imagens.forEach(item => {
    if (item?.file) {
      ordemImagens.push(`__novo__${indiceArquivo}`)
      indiceArquivo += 1
      return
    }

    if (item?.url) {
      ordemImagens.push(item.url)
    }
  })

  if (Array.isArray(imagens)) {
    formData.append('ordemImagens', JSON.stringify(ordemImagens))
  }

  imagens
    .map(item => item?.file)
    .filter(Boolean)
    .forEach(file => formData.append('imagens', file))

  return formData
}

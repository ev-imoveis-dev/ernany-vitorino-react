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
    if (valor !== undefined && valor !== null && valor !== '') {
      formData.append(chave, valor)
    }
  })

  const urlsExistentes = imagens
    .map(item => item?.url)
    .filter(Boolean)

  if (Array.isArray(imagens)) {
    formData.append('imagensExistentes', JSON.stringify(urlsExistentes))
  }

  imagens
    .map(item => item?.file)
    .filter(Boolean)
    .forEach(file => formData.append('imagens', file))

  return formData
}

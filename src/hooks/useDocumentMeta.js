import { useEffect } from 'react'

const DEFAULT_TITLE = 'Ernany Vitorino Imóveis'

function setMeta(prop, content, isName = false) {
  const attr = isName ? 'name' : 'property'
  let el = document.querySelector(`meta[${attr}="${prop}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, prop)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function useDocumentMeta({ title, description, imageUrl, url } = {}) {
  useEffect(() => {
    if (!title) return
    document.title = title
    setMeta('og:title', title)
    setMeta('og:type', 'website')
    if (url) setMeta('og:url', url)
    if (description) {
      setMeta('og:description', description)
      setMeta('twitter:description', description, true)
    }
    if (imageUrl) setMeta('og:image', imageUrl)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', title, true)
    return () => { document.title = DEFAULT_TITLE }
  }, [title, description, imageUrl, url])
}

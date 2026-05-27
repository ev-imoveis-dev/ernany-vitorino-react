import { useState } from 'react'

// transforms: { fieldName: (value) => transformedValue }
export function useForm(inicial, validar, transforms = {}) {
  const [form, setForm] = useState(inicial)
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: transforms[name] ? transforms[name](value) : value,
    }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function handleBlur(e) {
    const { name } = e.target
    if (!validar) return
    const erros = validar(form)
    setErrors(prev => ({ ...prev, [name]: erros[name] || '' }))
  }

  function validate() {
    if (!validar) return {}
    const erros = validar(form)
    setErrors(erros)
    return erros
  }

  return { form, setForm, errors, setErrors, handleChange, handleBlur, validate }
}

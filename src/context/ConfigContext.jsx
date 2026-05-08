import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const ConfigContext = createContext(null)

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(null)

  useEffect(() => {
    api.get('/configuracoes')
      .then(res => { if (res.data?.sucesso) setConfig(res.data.data) })
      .catch(() => {})
  }, [])

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
}

export function useConfig() {
  return useContext(ConfigContext)
}

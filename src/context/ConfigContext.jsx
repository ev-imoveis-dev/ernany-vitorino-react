import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { ConfigContext } from './ConfigContextValue'

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(null)

  useEffect(() => {
    api.get('/configuracoes')
      .then(res => { if (res.data?.sucesso) setConfig(res.data.data) })
      .catch(() => {})
  }, [])

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
}

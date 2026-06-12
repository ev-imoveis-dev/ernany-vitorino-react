import { useContext } from 'react'
import { ConfigContext } from './ConfigContextValue'

export function useConfig() {
  return useContext(ConfigContext)
}

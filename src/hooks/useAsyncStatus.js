import { useReducer } from 'react'

const inicial = { status: 'idle', erro: '' }

function reducer(state, action) {
  switch (action.type) {
    case 'SUBMITTING': return { status: 'loading', erro: '' }
    case 'SUCCESS':    return { status: 'success', erro: '' }
    case 'ERROR':      return { status: 'error', erro: action.erro }
    case 'RESET':      return inicial
    default:           return state
  }
}

// Models mutually-exclusive async states: idle → loading → success | error
export function useAsyncStatus() {
  const [state, dispatch] = useReducer(reducer, inicial)
  return {
    enviando:    state.status === 'loading',
    sucesso:     state.status === 'success',
    erro:        state.erro,
    iniciarEnvio: ()    => dispatch({ type: 'SUBMITTING' }),
    aoSucesso:    ()    => dispatch({ type: 'SUCCESS' }),
    aoErro:       (msg) => dispatch({ type: 'ERROR', erro: msg }),
    limparErro:   ()    => dispatch({ type: 'RESET' }),
    reset:        ()    => dispatch({ type: 'RESET' }),
  }
}

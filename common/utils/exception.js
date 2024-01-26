import store from '@/store/index'

export const getException = () => {
  return store.state.exception.exception_data
}

export const getExceptionLevel = () => {
  return store.state.exception.exception_level
}

export const appendException = message => {
  store.commit('exception/appendException', message)
}

export const clearException = () => {
  store.commit('exception/clearException')
}

export const getExceptionNumber = () => {
  return store.state.exception.exception_number
}

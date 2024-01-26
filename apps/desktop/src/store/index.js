import { createStore, createLogger } from 'vuex'
import modules from './modules'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})

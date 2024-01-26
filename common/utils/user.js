import store from '@/store/index'

export const getAllUser = () => {
  return store.state.user.user
}

/**
 * 获取当前用户
 * @return {number}
 */
export const getUser = () => {
  console.log(
    '====================================',
    store.state.user.loginUser
  )
  return store.state.user.loginUser
}

/**
 * 设置当前用户
 * @param index
 */
export const setUserState = (user) => {
  store.commit('user/setUserState', user)
}

export const setLoginUser = (user) => {
  store.commit('user/setLoginUser', user)
}

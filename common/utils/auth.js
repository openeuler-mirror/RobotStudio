// import Cookies from 'js-cookie'

const TokenKey = 'admin-tokenKey'
const refreshTokenKey = 'admin-refresh-token'

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function getrefreshToken() {
  return localStorage.getItem(refreshTokenKey)
}

export function setToken(token, refreshToken) {
  localStorage.setItem(TokenKey, token)
  localStorage.setItem(refreshTokenKey, refreshToken)
}

export function removeToken() {
  localStorage.clear()
}

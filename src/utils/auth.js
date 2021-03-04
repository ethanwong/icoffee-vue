/*
 * @Description:
 * @Author: Ethan Wong
 * @Date: 2020-09-04 16:19:39
 * @FilePath: \src\utils\auth.js
 * @LastEditTime: 2021-03-04 15:44:49
 * @LastEditors: your name
 */
import Cookies from 'js-cookie'

const AccessTokenKey = 'access-token'
const RefreshTokenKey = 'refresh-token'

export function getAccessToken() {
  return Cookies.get(AccessTokenKey)
}
export function setAccessToken(token) {
  return Cookies.set(AccessTokenKey, token)
}

export function removeAccessToken() {
  return Cookies.remove(AccessTokenKey)
}

export function getRefreshToken() {
  return Cookies.get(RefreshTokenKey)
}
export function setRefreshToken(token) {
  return Cookies.set(RefreshTokenKey, token)
}

export function removeRefreshToken() {
  return Cookies.remove(RefreshTokenKey)
}


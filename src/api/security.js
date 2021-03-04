/*
 * @Description:
 * @Author: Ethan Wong
 * @Date: 2021-01-30 15:12:51
 * @FilePath: \src\api\security.js
 * @LastEditTime: 2021-03-04 15:06:28
 * @LastEditors: your name
 */
import request from '@/utils/request'

export function getCaptcha() {
  return request({
    url: '/security/captcha',
    method: 'get'
  })
}

export function login(data) {
  return request({
    url: '/security/login',
    method: 'post',
    data
  })
}

export function getUserInfo() {
  return request({
    url: '/security/user',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/security/logout',
    method: 'post'
  })
}

export function refreshToken() {
  return request({
    url: '/security/refreshToken',
    method: 'post'
  })
}


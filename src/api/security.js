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

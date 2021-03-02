/*
 * @Description:
 * @Author: Ethan Wong
 * @Date: 2020-09-04 16:19:39
 * @FilePath: \src\api\system\user.js
 * @LastEditTime: 2021-02-26 10:53:44
 * @LastEditors: your name
 */
import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/system/user/page',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/system/user',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/system/user',
    method: 'put',
    data
  })
}

export function remove(id) {
  return request({
    url: '/system/user/' + id,
    method: 'delete'
  })
}

export function resetPassword(query) {
  return request({
    url: '/system/user/resetPassword',
    method: 'put',
    params: query
  })
}

/*
 * @Description:
 * @Author: Ethan Wong
 * @Date: 2021-02-08 15:35:17
 * @FilePath: \src\api\system\role.js
 * @LastEditTime: 2021-02-25 11:23:27
 * @LastEditors: your name
 */
import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/system/role/page',
    method: 'get',
    params: query
  })
}

export function getRolelist(query) {
  return request({
    url: '/system/role/getList',
    method: 'get',
    params: query
  })
}

export function update(data) {
  return request({
    url: '/system/role',
    method: 'put',
    data
  })
}

export function create(data) {
  return request({
    url: '/system/role',
    method: 'post',
    data
  })
}

export function remove(roleId) {
  return request({
    url: '/system/role/' + roleId,
    method: 'delete'
  })
}

export function setRoleAuth(data) {
  return request({
    url: '/system/role/setRoleAuth',
    method: 'put',
    data
  })
}

export function getById(id) {
  return request({
    url: '/system/role/getById/' + id,
    method: 'get'
  })
}

/*
 * @Description:
 * @Author: Ethan Wong
 * @Date: 2021-02-02 15:59:46
 * @FilePath: \src\api\system\menu.js
 * @LastEditTime: 2021-02-08 17:41:18
 * @LastEditors: your name
 */
import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/system/menu/page',
    method: 'get',
    params: query
  })
}
export function update(data) {
  return request({
    url: '/system/menu',
    method: 'put',
    data
  })
}

export function create(data) {
  return request({
    url: '/system/menu',
    method: 'post',
    data
  })
}

export function remove(menuid) {
  return request({
    url: '/system/menu/' + menuid,
    method: 'delete'
  })
}

export function listMenu(query) {
  return request({
    url: '/system/menu/list',
    method: 'get',
    params: query
  })
}

export function menuTree(parentId) {
  return request({
    url: '/system/menu/getTree/' + parentId,
    method: 'get'
  })
}

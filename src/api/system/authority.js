import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/system/authority/page',
    method: 'get',
    params: query
  })
}

export function getByModule(module) {
  return request({
    url: '/system/authority/getByModule/' + module,
    method: 'get'

  })
}

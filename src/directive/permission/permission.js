/*
 * @Description:
 * @Author: Ethan Wong
 * @Date: 2020-09-04 16:19:39
 * @FilePath: \src\directive\permission\permission.js
 * @LastEditTime: 2021-02-26 11:23:51
 * @LastEditors: your name
 */
import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding
  // const roles = store.getters && store.getters.roles

  const permissions = store.getters.permissions

  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoles = value

      const hasPermission = permissions.some(permission => {
        return permissionRoles.includes(permission.permission)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error(`need permissions! Like v-permission="['admin','editor']"`)
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}

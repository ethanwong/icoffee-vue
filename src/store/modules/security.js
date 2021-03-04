import { login, logout, getUserInfo, refreshToken } from '@/api/security'
import { getAccessToken, setAccessToken, removeAccessToken, getRefreshToken, setRefreshToken, removeRefreshToken } from '@/utils/auth'
import { constantRoutes, asyncRoutes, resetRouter } from '@/router'
import { filterAsyncRoutes, filterAsyncRouter } from '@/store/modules/permission'
import { Notification, MessageBox, Message } from 'element-ui'

const state = {
  accessToken: getAccessToken(),
  refreshToken: getRefreshToken(),
  username: '',
  avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
  roles: [],
  routes: [],
  permissions: [],
  userinfo: []
}

const mutations = {
  SET_ACCESS_TOKEN: (state, token) => {
    state.accessToken = token
  },
  SET_REFRESH_TOKEN: (state, token) => {
    state.refreshToken = token
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_USERINFO: (state, userinfo) => {
    state.userinfo = userinfo
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  }
}

const actions = {
  // 登录
  login({ commit }, userInfo) {
    const { username, password, code } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, code: code }).then(response => {
        console.log('login response=' + JSON.stringify(response))

        if (response.success) {
          const { accessToken, refreshToken } = response.data

          // console.log('SET_ACCESS_TOKEN=' + accessToken)
          // console.log('SET_REFRESH_TOKEN=' + refreshToken)

          // 更新store中token
          commit('SET_ACCESS_TOKEN', accessToken.token)
          commit('SET_REFRESH_TOKEN', refreshToken.token)
          // 更新Cookie中token
          setAccessToken(accessToken.token)
          setRefreshToken(refreshToken.token)
          resolve()
        } else {
          Notification.error({
            title: '失败',
            type: 'danger',
            message: response.message,
            duration: 3000
          })
          reject(response.message)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 刷新token
  refreshToken({ commit }) {
    return new Promise((resolve, reject) => {
      // 刷新token时使用refreshToken进行请求
      console.log('state.refreshToken=' + state.refreshToken)
      commit('SET_ACCESS_TOKEN', state.refreshToken)
      setAccessToken(state.refreshToken)
      refreshToken().then((response) => {
        const { accessToken, refreshToken } = response.data

        // 更新store中token
        commit('SET_ACCESS_TOKEN', accessToken.token)
        commit('SET_REFRESH_TOKEN', refreshToken.token)
        // 更新Cookie中token
        setAccessToken(accessToken.token)
        setRefreshToken(refreshToken.token)

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取用户信息
  getUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, username, routes, permissions } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_USERINFO', data)

        commit('SET_USERNAME', username)
        commit('SET_ROLES', roles)
        commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')

        filterAsyncRouter(routes)

        commit('SET_ROUTES', routes)
        commit('SET_PERMISSIONS', permissions)

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  loadRoutes({ commit }, roles) {
    return new Promise(resolve => {
      // 自定义菜单
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)

      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_ACCESS_TOKEN', '')
        commit('SET_REFRESH_TOKEN', '')
        commit('SET_ROLES', [])
        removeAccessToken()
        removeRefreshToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

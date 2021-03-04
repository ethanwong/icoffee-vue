import axios from 'axios'
import { Notification, MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getAccessToken, setAccessToken, removeAccessToken, getRefreshToken, setRefreshToken, removeRefreshToken } from '@/utils/auth' // get token from cookie
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // if (store.getters.accessToken) {
    if (getAccessToken()) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + getAccessToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    // 兼容blob下载出错json提示
    if (error.response.data instanceof Blob && error.response.data.type.toLowerCase().indexOf('json') !== -1) {
      const reader = new FileReader()
      reader.readAsText(error.response.data, 'utf-8')
      reader.onload = function(e) {
        const errorMsg = JSON.parse(reader.result).message
        Notification.error({
          title: errorMsg,
          duration: 5000
        })
      }
      console.log('error blob')
    } else {
      const code = error.response.status
      const respData = error.response.data
      const tokenType = respData.tokenType
      console.log('interceptors.response=' + JSON.stringify(error.response))
      const sourcePath = router.currentRoute.path
      console.log('sourcePath=' + sourcePath)
      if (code) {
        if (code === 401) {
          if (tokenType) {
            if (tokenType === 'REFRESH') {
              setAccessToken('')
              setRefreshToken('')
              store.dispatch('security/logout').then((response) => {
                router.push({ path: '/redirect' + sourcePath })
              })
            } else {
              MessageBox.confirm(respData.message, '登录超时', {
                confirmButtonText: '刷新',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                store.dispatch('security/refreshToken').then((response) => {
                  router.push({ path: '/redirect' + router.currentRoute.path })
                })
              }).catch(() => {
                router.push({ path: '/redirect' + sourcePath })
              })
            }
          } else {
            router.push({ path: '/redirect' + sourcePath })
          }
        } else if (code === 403) {
          router.push({ path: '/403' })
        } else if (code === 404) {
          Notification.error({
            title: '接口不存在',
            message: error + ',path=' + error.response.data.path,
            duration: 5000
          })
        } else {
          Notification.error({
            title: '接口请求失败',
            message: error,
            duration: 5000
          })
        }
      } else {
        Notification.error({
          title: '接口请求失败',
          message: error,
          duration: 5000
        })
      }
    }
    return Promise.reject(error)
  }
)

//   // if the custom code is not 20000, it is judged as an error.
//   if (res.code !== 20000) {
//     Message({
//       message: res.message || 'Error',
//       type: 'error',
//       duration: 5 * 1000
//     })
//
//     // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
//     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//       // to re-security
//       MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
//         confirmButtonText: 'Re-Login',
//         cancelButtonText: 'Cancel',
//         type: 'warning'
//       }).then(() => {
//         store.dispatch('user/resetToken').then(() => {
//           location.reload()
//         })
//       })
//     }

export default service

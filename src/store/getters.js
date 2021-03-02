/*
 * @Description:
 * @Author: Ethan Wong
 * @Date: 2020-09-04 16:19:39
 * @FilePath: \src\store\getters.js
 * @LastEditTime: 2021-02-26 11:19:13
 * @LastEditors: your name
 */

const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.security.token,
  avatar: state => state.security.avatar,
  username: state => state.security.username,
  introduction: state => state.security.introduction,
  roles: state => state.security.roles,
  permissions: state => state.security.permissions,
  permission_routes: state => state.security.routes,
  errorLogs: state => state.errorLog.logs
}
export default getters

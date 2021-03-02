const Mock = require('mockjs')

const tokens = {
  admin: {
    token: 'admin-token',
    password: '111111'
  },
  editor: {
    token: 'editor-token',
    password: '111111'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    username: '@title(5, 2)',
    realname: '@title(3, 2)',
    phonenumber: '14958494898',
    email: 'helo@qq.com',
    createAt: +Mock.Random.date('T'),
  }))
}

module.exports = [
  // user security
  {
    url: '/vue-element-admin/user/login',
    type: 'post',
    response: config => {
      const { username, password } = config.body
      console.log('username=' + username + ' password=' + password)
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: '账号不存在。'
        }
      }else if(token.password != password){
        return {
          code: 60204,
          message: '密码不正确。'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/vue-element-admin/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/vue-element-admin/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/user/list',
    type: 'get',
    response: config => {
      const { name, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        // if (importance && item.importance !== +importance) return false
        // if (type && item.type !== type) return false
        if (name && item.name.indexOf(name) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },{
    url: '/vue-element-admin/user/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

<!--
 * @Description:
 * @Author: Ethan Wong
 * @Date: 2021-02-26 10:19:00
 * @FilePath: \src\views\profile\components\Password.vue
 * @LastEditTime: 2021-02-26 14:07:58
 * @LastEditors: your name
-->
<template>
  <el-form ref="dataForm" :rules="rules" :model="temp">
    <el-form-item label="输入密码" prop="password">
      <el-input v-model.trim="temp.password" show-password />
    </el-form-item>
    <el-form-item label="确认密码" prop="password2">
      <el-input v-model.trim="temp.password2" show-password />
    </el-form-item>
    <el-form-item>
      <el-button v-permission="permission.resetPassword" type="primary" @click="submit">修改</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import permission from '@/directive/permission/index.js' // 权限判断指令
import { resetPassword } from '@/api/system/user'
export default {
  directives: { permission },
  props: {
    user: {
      type: Object, default: () => {
        return {
          avatar: ''
        }
      }
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码不能小于6个字符'))
      } else {
        if (this.temp.password2 !== '') {
          this.$refs.dataForm.validateField('password2')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码不能小于6个字符'))
      } else if (value !== this.temp.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      temp: {
        username: this.user.username,
        password: '',
        password2: ''
      },
      permission: {
        resetPassword: ['user:resetPassword']
      },
      rules: {
        password: [{ validator: validatePass, trigger: 'blur' }],
        password2: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  methods: {
    submit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const query = {
            username: this.temp.username,
            password: this.temp.password
          }
          resetPassword(query).then((response) => {
            if (response.success) {
              this.$notify({
                title: '成功',
                message: response.message,
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: response.message,
                type: 'danger',
                duration: 2000
              })
            }
          })
        }
      })
    }
  }
}
</script>

<template>
  <el-form ref="dataForm" :rules="rules" :model="temp">
    <el-form-item label="姓名" prop="realname">
      <el-input v-model.trim="temp.realname" />
    </el-form-item>
    <el-form-item label="性别" prop="gender">
      <el-radio-group v-model="temp.gender">
        <el-radio :label="1">男</el-radio>
        <el-radio :label="2">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="Email" prop="email">
      <el-input v-model.trim="temp.email" />
    </el-form-item>
    <el-form-item label="手机号码" prop="phoneNumber">
      <el-input v-model.trim="temp.phoneNumber" />
    </el-form-item>
    <el-form-item>
      <el-button v-permission="permission.updateUser" type="primary" @click="submit">更新</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import permission from '@/directive/permission/index.js' // 权限判断指令
import { update } from '@/api/system/user'
export default {
  directives: { permission },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          avatar: ''
        }
      }
    }
  },
  data() {
    return {
      temp: {},
      rules: {
        realname: [{ required: true, message: '请输入姓名称', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        email: [{ required: true, type: 'email', message: "'请输入正确的邮箱地址", trigger: ['blur', 'change'] }],
        phoneNumber: [{ required: true, pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }]
      },
      permission: {
        updateUser: ['user:update']
      }
    }
  },
  created() {
    this.temp = Object.assign({}, this.user) // copy obj
  },
  methods: {
    submit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          update(tempData).then((response) => {
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

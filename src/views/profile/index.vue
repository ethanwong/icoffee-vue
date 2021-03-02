
<template>

  <div v-if="user">
    <el-row :gutter="20">

      <el-col :span="6" :xs="24">
        <user-card :user="user" />
      </el-col>

      <el-col :span="18" :xs="24">
        <el-card style="margin:20px 20px 20px 0px;">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="更新信息" name="account">
              <account :user="user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="password">
              <password :user="user" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>

    </el-row>
  </div>

</template>

<script>
import UserCard from './components/UserCard'
import Account from './components/Account'
import Password from './components/Password'

export default {
  name: 'Profile',
  components: { UserCard, Account, Password },
  data() {
    return {
      user: this.$store.state.security.userinfo,
      activeTab: 'account'
    }
  },
  created() {
  },
  methods: {

  }
}
</script>

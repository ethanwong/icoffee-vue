<template>
  <el-card style="margin:20px 0px 20px 20px;">
    <div slot="header" class="clearfix">
      <span>个人信息</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="avatar" :height="'100px'" :width="'100px'" :hoverable="false">
          {{ userinfo.username }}
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ userinfo.username }}</div>
        <div class="user-role text-center text-muted">{{ userinfo.roles[0] | uppercaseFirst }}</div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="user" /><span>基本信息</span></div>
        <div class="user-bio-section-body">
          <div class="item"><label>姓名:</label> {{ userinfo.realname }}</div>
          <div class="item"><label>性别:</label>
            <span v-if="userinfo.gender==1">男</span>
            <span v-else>女</span>
            <div class="item"><label>Email：</label> {{ userinfo.email }}</div>
            <div class="item"><label>手机号码：</label> {{ userinfo.phoneNumber }}</div>
          </div>
        </div>
      </div>
    </div></el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'
export default {
  components: { PanThumb },
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
      userinfo: this.$store.state.security.userinfo,
      avatar: this.$store.state.security.avatar
    }
  },
  created() {
    console.log('userinfo=' + JSON.stringify(this.userinfo))
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
  .item{
    line-height: 40px;
  }
}
</style>

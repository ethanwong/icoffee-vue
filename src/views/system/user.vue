<template>

  <div class="app-container">
    <!--检索-->
    <el-row>
      <el-form v-show="showSearch" ref="queryForm" :model="listQuery" :inline="true">
        <el-form-item label="用户名称" prop="search_LIKE_username">
          <el-input v-model="listQuery.search_LIKE_username" placeholder="请输入用户名称" size="small" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="状态" prop="search_EQ_locked">
          <el-select v-model="listQuery.search_EQ_locked" placeholder="请选择">
            <el-option
              v-for="options in lockedOptions"
              :key="options.value"
              :label="options.label"
              :value="options.value"
            />
          </el-select>
        </el-form-item>

        <el-button type="primary" icon="el-icon-search" size="small" @click="handleFilter">搜索</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetFilter">重置</el-button>
      </el-form>
    </el-row>
    <!--功能按钮-->
    <el-row>
      <el-button-group>
        <el-button v-permission="permission.add" size="small" type="primary" icon="el-icon-plus" @click="handleCreate">添加
        </el-button>
        <el-button v-permission="permission.del" size="small" type="danger" icon="el-icon-delete" @click="handleBatchDelete">删除</el-button>
      </el-button-group>
      <right-toolbar :show-search.sync="showSearch" :columns="columns" @queryTable="getList" />
    </el-row>

    <el-table ref="multipleTable" v-loading="listLoading" :row-class-name="tableRowClassName" :data="list" fit highlight-current-row stripe style="width: 100%" @row-click="onRowClick">
      <el-table-column type="selection" width="44" />
      <el-table-column v-if="columns[0].visible" align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.row_index+1 }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="columns[1].visible" width="120px" label="用户名" prop="username" />
      <el-table-column v-if="columns[2].visible" width="120px" label="真实姓名" prop="realname" />
      <el-table-column v-if="columns[3].visible" label="性别">
        <template slot-scope="scope">
          <span v-if="scope.row.gender==1">男</span>
          <span v-else>女</span>
        </template>
      </el-table-column>
      <el-table-column v-if="columns[4].visible" label="角色名称" prop="roleName" />
      <el-table-column v-if="columns[5].visible" label="手机号码" prop="phoneNumber" />
      <el-table-column v-if="columns[6].visible" label="邮箱地址" prop="email" />
      <el-table-column v-if="columns[7].visible" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.locked" effect="dark" type="danger">锁定</el-tag>
          <el-tag v-else type="success" effect="dark">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="columns[8].visible" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createAt | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="{row,$index}">
          <el-button v-permission="permission.edit" size="mini" type="success" icon="el-icon-edit" @click="handleUpdate(row)" />
          <el-button v-permission="permission.del" size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(row,$index)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" style="margin-top:0px;" @pagination="getList" />

    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%" append-to-body>
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="temp.username" />

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="真实姓名" prop="realname">
              <el-input v-model="temp.realname" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="temp.password" type="password" show-password />
              <div class="sub-title">不输入时默认为123456</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="确认密码" prop="password2">
              <el-input v-model="temp.password2" type="password" show-password />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phoneNumber">
              <el-input v-model="temp.phoneNumber" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱地址" prop="email">
              <el-input v-model="temp.email" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别">
              <el-radio-group v-model="temp.gender">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="temp.locked">
                <el-radio :label="false">正常</el-radio>
                <el-radio :label="true">锁定</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 0;" label="角色" prop="roleId">
              <el-select
                v-model="temp.roleId"
                style="width: 100%"
                placeholder="请选择角色"
              >
                <el-option
                  v-for="item in roles"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>

            </el-form-item>

          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          关闭
        </el-button>
        <el-button v-permission="permission.addOrEdit" type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import permission from '@/directive/permission/index.js' // 权限判断指令
import RightToolbar from '@/components/RightToolbar'
import { list, create, update, remove } from '@/api/system/user' // Secondary package based on el-pagination
import { getRolelist } from '@/api/system/role' // Secondary package based on el-pagination
export default {
  name: 'User',
  components: { Pagination, RightToolbar },
  directives: { permission, waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      console.log('value=' + value)
      if (value !== '' && value !== 'undefined') {
        if (value.length < 6) {
          callback(new Error('密码不能小于6个字符'))
        } else {
          if (this.temp.password2 !== '') {
            this.$refs.dataForm.validateField('password2')
          }
          callback()
        }
      }

      callback()
    }
    var validatePass2 = (rule, value, callback) => {
      console.log('value=' + value)
      if (value !== '' && typeof (value) !== 'undefined') {
        if (value.length < 6) {
          callback(new Error('密码不能小于6个字符'))
        } else if (value !== this.temp.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      callback()
    }
    return {
      showSearch: true,
      permission: {
        add: ['user:create'],
        edit: ['user:update'],
        addOrEdit: ['user:create', 'user:update'],
        del: ['user:delete']
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '添加'
      },
      lockedOptions: [{
        value: '1',
        label: '锁定'
      }, {
        value: '0',
        label: '正常'
      }],
      dialogPvVisible: false,
      temp: {
        username: '',
        realname: '',
        password: '',
        password2: '',
        phoneNumber: '',
        email: '',
        gender: 1,
        locked: false,
        roleId: ''
      },
      roles: [],
      // 列信息
      columns: [
        { key: 0, label: `编号`, visible: true },
        { key: 1, label: `用户名`, visible: true },
        { key: 2, label: `真实姓名`, visible: true },
        { key: 3, label: `性别`, visible: true },
        { key: 4, label: `角色名称`, visible: true },
        { key: 5, label: `手机号码`, visible: true },
        { key: 6, label: `邮箱地址`, visible: true },
        { key: 7, label: `状态`, visible: true },
        { key: 8, label: `创建时间`, visible: true }
      ],
      rules: {
        username: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
        roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
        email: [{ type: 'email', message: "'请输入正确的邮箱地址", trigger: ['blur', 'change'] }],
        phoneNumber: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }],
        password: [{ validator: validatePass, trigger: 'blur' }],
        password2: [{ validator: validatePass2, trigger: 'blur' }]
      },
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        search_LIKE_username: undefined,
        search_EQ_locked: undefined,
        sort: undefined
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      row.row_index = rowIndex
    },
    onRowClick(row, event, column) {
      this.currentRowIndex = row.row_index
    },
    handleView(row) {
      this.$alert('企业信息：' + JSON.stringify(row), '企业名称：' + row.name, {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: action => {
        }
      })
    },
    handleBatchDelete() {
      const selections = this.$refs.multipleTable.selection
      console.log('index=' + JSON.stringify(selections))

      const names = []
      const ids = []
      selections.forEach((item, index) => {
        names.push(item.username)
        ids.push(item.id)
      })

      this.$confirm('确定删除如下账号吗：' + names, '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove(ids).then(response => {
          if (response.success) {
            this.getList()
            this.$message({
              title: '成功',
              type: 'success',
              message: '删除成功!',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '失败',
              type: 'danger',
              message: response.message,
              duration: 2000
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true

      getRolelist().then(response => {
        this.roles = response.data
      })

      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true

      getRolelist().then(response => {
        this.roles = response.data
      })

      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          create(this.temp).then((response) => {
            if (response.success) {
              this.dialogFormVisible = false
              this.getList()
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
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          update(tempData).then((response) => {
            if (response.success) {
              this.dialogFormVisible = false
              this.getList()
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
    },
    handleDelete(row, index) {
      console.log('index=' + index + ' row=' + row)
      this.$confirm('确定删除吗？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove(row.id).then(response => {
          if (response.success) {
            this.getList()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$notify({
              title: '失败',
              type: 'warning',
              message: response.message,
              duration: 2000
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getList() {
      this.listLoading = true
      list(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    resetFilter() {
      this.resetForm('queryForm')
      this.getList()
    },
    changeRole(value) {
      this.temp.roleId = value
    },
    // 表单重置
    resetTemp() {
      this.temp = {
        username: '',
        realname: '',
        password: '',
        password2: '',
        phonenumber: '',
        email: '',
        gender: 1,
        locked: false,
        roleId: ''
      }
      this.resetForm('form')
    }
  }
}
</script>
<style>

</style>

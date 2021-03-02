<template>
  <el-row>
    <el-col :span="16">
      <div class="role-container-left">
        <!--检索-->
        <el-row>
          <el-form v-show="showSearch" ref="queryForm" :model="listQuery" :inline="true">
            <el-form-item label="用户名称" prop="search_LIKE_name">
              <el-input v-model="listQuery.search_LIKE_name" placeholder="角色名称" size="small" @keyup.enter.native="handleFilter" />
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" size="small" @click="handleFilter">搜索</el-button>
            <el-button icon="el-icon-refresh" size="small" @click="resetFilter">重置</el-button>
          </el-form>
        </el-row>
        <!--功能按钮-->
        <el-row>
          <el-button-group>
            <el-button v-permission="permission.add" size="small" type="primary" icon="el-icon-plus" @click="toCreate">添加
            </el-button>
            <el-button v-permission="permission.del" size="small" type="danger" icon="el-icon-delete" @click="toBatchDelete">删除</el-button>
          </el-button-group>
          <right-toolbar :show-search.sync="showSearch" :columns="columns" @queryTable="getList" />
        </el-row>
        <el-table
          ref="multipleTable"
          v-loading="listLoading"
          :row-class-name="tableRowClassName"
          :data="list"
          fit
          highlight-current-row
          stripe
          style="width: 100%"
          @row-click="onRowClick"
        >
          <el-table-column type="selection" width="44" />
          <el-table-column
            v-if="columns[0].visible"
            align="center"
            label="序号"
            width="80"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.row_index + 1 }}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="columns[1].visible"
            label="角色名称"
            prop="name"
          />
          <el-table-column
            v-if="columns[2].visible"
            label="角色描述"
            prop="description"
          />
          <el-table-column
            v-if="columns[3].visible"
            align="center"
            label="创建时间"
          >
            <template slot-scope="scope">
              <span>{{
                scope.row.createAt | parseTime("{y}-{m}-{d} {h}:{i}")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="columns[4].visible"
            align="center"
            label="更新时间"
          >
            <template slot-scope="scope">
              <span>{{
                scope.row.updateAt | parseTime("{y}-{m}-{d} {h}:{i}")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="{ row, $index }">
              <el-button
                v-permission="permission.edit"
                size="mini"
                type="success"
                icon="el-icon-edit"
                @click="toUpdate(row)"
              />
              <el-button
                v-permission="permission.del"
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="toDelete(row, $index)"
              />
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.pageNo"
          :limit.sync="listQuery.pageSize"
          style="margin-top: 0px"
          @pagination="getList"
        />

        <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%" append-to-body>
          <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="角色名称" prop="name">
                  <el-input v-model="temp.name" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="角色描述" prop="description">
                  <el-input v-model="temp.description" />
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
    </el-col>
    <el-col :span="8">
      <div class="role-container-right">

        <div style="margin-top:10px;display:inline;">菜单和授权</div>
        <el-button v-if="currentRoleId" size="small" type="primary" icon="el-icon-plus" style="float: right; " @click="saveAuth">保存</el-button>
        <div style="border-bottom:1px solid #e6ebf5;margin:20px 0px 20px 0px;" />
        <el-tree
          ref="tree"
          :data="menuTreeData"
          :props="defaultProps"
          node-key="id"
          show-checkbox
          accordion
          lazy
          :load="loadNode"
          @check-change="handleCheckChange"
          @node-click="handleNodeClick"
        />
      </div>
    </el-col>
  </el-row>

</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import permission from '@/directive/permission/index.js' // 权限判断指令
import RightToolbar from '@/components/RightToolbar'
import { page, create, update, remove, setRoleAuth, getById } from '@/api/system/role' // Secondary package based on el-pagination
import { getByModule } from '@/api/system/authority' // Secondary package based on el-pagination
import { menuTree } from '@/api/system/menu'

export default {
  name: 'User',
  components: { Pagination, RightToolbar },
  directives: { permission, waves },
  data() {
    return {
      showSearch: true,
      permission: {
        add: ['role:create'],
        edit: ['role:update'],
        addOrEdit: ['role:create', 'role:update'],
        del: ['role:delete'],
        setAuth: ['role:setRoleAuth']
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '添加'
      },
      menuTreeData: [{ id: '0', 'name': '默认根级菜单', 'module': '', children: [] }],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'isLeaf'
      },
      temp: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: ['blur', 'change'] }],
        description: [{ required: true, message: '请输入描述信息', trigger: ['blur', 'change'] }]
      },
      // 列信息
      columns: [
        { key: 0, label: `序号`, visible: true },
        { key: 1, label: `角色名称`, visible: true },
        { key: 2, label: `角色描述`, visible: true },
        { key: 3, label: `创建时间`, visible: true },
        { key: 4, label: `更新时间`, visible: true }
      ],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        search_LIKE_name: undefined,
        sort: undefined
      },
      currentRoleId: undefined,
      currentRoleMenu: [],
      currentRoleAuth: [],
      checkedMenuIds: []
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
      // console.log('onRowClick row=' + JSON.stringify(row))

      this.currentRoleId = row.id

      getById(this.currentRoleId).then((response) => {
        const roledata = response.data
        const menuIds = roledata.menuIds
        let checkedMenuIds = []
        if (menuIds) {
          checkedMenuIds = menuIds.split(',')
        }

        const authIds = roledata.authIds
        let checkedAuthIds = []
        if (authIds) {
          checkedAuthIds = authIds.split(',')
        }

        const checkedKeys = checkedMenuIds.concat(checkedAuthIds)

        console.log('checkedKeys=' + checkedKeys)

        this.$refs.tree.setCheckedKeys(checkedKeys)
      })

      // this.$refs.tree.setCheckedNodes([{ id: '5500273007004ae7ba24dc0b101c4ee5', name: '系统管理' }])
      // this.$refs.tree.setCheckedKeys(['6f02dc1d26be47e38122dabd3337ec7a', '19c49c7283bc4891b8205949cb4ea543'])
    },

    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 点击节点事件
    handleNodeClick(data) {
      console.log('handleNodeClick=' + JSON.stringify(data))

      // console.log(this.$refs.tree.getCheckedKeys())
      // console.log(this.$refs.tree.getCheckedNodes())
    },
    // 选中阶段复选框事件
    handleCheckChange(data, checked, indeterminate) {
      // console.log('handleCheckChange getCheckedKeys=' + this.$refs.tree.getCheckedKeys())
      // console.log('handleCheckChange getCheckedNodes=' + JSON.stringify(this.$refs.tree.getCheckedNodes()))

      const checkedNodes = this.$refs.tree.getCheckedNodes()
      console.log('handleCheckChange getCheckedKeys=' + JSON.stringify(checkedNodes))

      this.currentRoleAuth = []
      this.currentRoleMenu = []
      checkedNodes.forEach((item, index) => {
        // 选中菜单信息时进行处理
        if (item.tag === 'MENU') {
          if (!this.currentRoleMenu.includes(item.id)) {
            this.currentRoleMenu.push(item.id)
          }
        }
        // 选中授权信息时进行处理
        if (item.tag === 'AUTHORITY') {
          if (!this.currentRoleAuth.includes(item.id)) {
            this.currentRoleAuth.push(item.id)
          }
        }
      })
    },

    loadNode(node, resolve) {
      console.log('node=' + JSON.stringify(node.data))

      const nodeData = node.data
      let parentId = nodeData.id

      if (node.level === 0) {
        // return resolve([{ id: '0', 'name': '默认根级菜单', 'module': '', children: [], parentId: '0' }])
        parentId = 0
      }

      setTimeout(() => {
        // 判断如果是授权信息，则没有下级
        if (nodeData.tag === 'AUTHORITY') {
          resolve([])
        } else {
          // 判断是否是菜单叶子节点，如果是加载授权信息
          if (parentId !== 0 && nodeData.children.length === 0) {
            getByModule(nodeData.module).then((response) => {
              resolve(response.data)
            })
          } else {
            // 菜单加载
            menuTree(parentId).then((response) => {
              resolve(response.data)
            })
          }
        }
      }, 500)
    },
    getList() {
      this.listLoading = true
      page(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    toCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    toUpdate(row) {
      this.resetTemp()
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    toDelete(row, index) {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          remove(row.id).then(response => {
            if (response.success) {
              this.getList()
              this.$notify({
                title: '成功',
                type: 'success',
                message: '删除成功!',
                duration: 2000

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
        })
        .catch(() => {
          this.$notify({
            title: '取消',
            type: 'info',
            message: '已取消删除',
            duration: 2000
          })
        })
    },

    toBatchDelete() {
      const selections = this.$refs.multipleTable.selection
      console.log('index=' + JSON.stringify(selections))

      const names = []
      const ids = []
      selections.forEach((item, index) => {
        names.push(item.name)
        ids.push(item.id)
      })

      console.log('names=' + names)
      console.log('ids=' + ids)

      this.$confirm('确定删除角色：[' + names + '] ？', '提示', {
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
        this.$notify({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
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
          update(this.temp).then((response) => {
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
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.list.splice(index, 1)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    // 表单重置
    resetTemp() {
      this.temp = {
        name: '',
        description: ''
      }
      this.resetForm('form')
    },
    // 保存授权信息
    saveAuth() {
      console.log('currentRoleId=' + this.currentRoleId)
      console.log('currentRoleMenu=' + this.currentRoleMenu)
      console.log('currentRoleAuth=' + this.currentRoleAuth)
      const data = {
        roleId: this.currentRoleId,
        menuIds: this.currentRoleMenu,
        authIds: this.currentRoleAuth
      }
      setRoleAuth(data).then((response) => {
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
    },
    resetFilter() {
      this.resetForm('queryForm')
      this.getList()
    }
  }
}
</script>
<style>
.role-container-left {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 20px 10px 20px 20px;
}
.role-container-right {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 20px 20px 20px 10px;
}
 .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>

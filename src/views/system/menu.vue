<template>
  <div class="app-container">
    <!--检索-->
    <el-row>
      <el-form v-show="showSearch" ref="queryForm" :model="listQuery" :inline="true">
        <el-form-item label="菜单标题" prop="search_LIKE_title">
          <el-input
            v-model="listQuery.search_LIKE_title"
            placeholder="请输入菜单标题"
            size="small"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleFilter">搜索</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetFilter">重置</el-button>
      </el-form>

    </el-row>
    <!--功能按钮-->
    <el-row>
      <el-button-group>
        <el-button
          v-permission="permission.add"
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="toCreate"
        >添加
        </el-button>
        <el-button
          v-permission="permission.del"
          size="small"
          type="danger"
          icon="el-icon-delete"
          @click="toBatchDelete"
        >删除</el-button>
      </el-button-group>
      <right-toolbar
        :show-search.sync="showSearch"
        :columns="columns"
        @queryTable="getList"
      />

    </el-row>

    <!--表格   default-expand-all -->
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :row-class-name="tableRowClassName"
      :data="list"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      fit
      highlight-current-row
      stripe
      style="width: 100%"
      @row-click="onRowClick"
    >
      <el-table-column type="selection" width="44" />

      <el-table-column
        v-if="columns[0].visible"
        label="菜单标题"
        prop="title"
      />
      <el-table-column v-if="columns[1].visible" width="50px" label="图标">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column
        v-if="columns[2].visible"
        label="模块名称"
        prop="moduleName"
      />
      <el-table-column
        v-if="columns[3].visible"
        label="路由地址"
        prop="routePath"
      />
      <el-table-column
        v-if="columns[4].visible"
        label="组件路径"
        prop="componentPath"
      />
      <el-table-column
        v-if="columns[5].visible"
        width="50px"
        label="排序"
        prop="orderNo"
      />
      <el-table-column
        v-if="columns[6].visible"
        width="60px"
        label="隐藏"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.hidden" effect="dark" type="danger">是</el-tag>
          <el-tag v-else type="success" effect="dark">否</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        v-if="columns[7].visible"
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
        v-if="columns[8].visible"
        align="center"
        label="操作"
        width="300"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            v-permission="permission.add"
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="toCreate(row)"
          />
          <el-button
            v-permission="permission.view"
            size="mini"
            type="info"
            icon="el-icon-document"
            @click="toView(row)"
          />
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
    <!--分页条-->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      style="margin-top: 0px"
      @pagination="getList"
    />

    <!--添加弹窗-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      width="40%"
      append-to-body
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="inputTemp"
        label-position="right"
        label-width="80px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <treeselect
                v-model="inputTemp.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
                @input="resetComponentPath"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="菜单标题" prop="title">
              <el-input v-model="inputTemp.title" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单图标" prop="icon">
              <el-popover
                placement="bottom-start"
                width="600"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input
                  slot="reference"
                  v-model="inputTemp.icon"
                  placeholder="点击选择图标"
                  readonly
                >
                  <svg-icon
                    v-if="inputTemp.icon"
                    slot="prefix"
                    :icon-class="inputTemp.icon"
                    class="el-input__icon"
                    style="margin-left: 6px; color: black"
                  />
                  <i
                    v-else
                    slot="prefix"
                    class="el-icon-search el-input__icon"
                  />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number
                v-model="inputTemp.orderNo"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="模块名称" prop="moduleName">
              <el-input v-model="inputTemp.moduleName" @input="resetComponentPath" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否隐藏" prop="hidden">
              <el-radio-group v-model="inputTemp.hidden">
                <el-radio
                  v-for="dict in visibleOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="路由跳转">
              <el-radio-group v-model="inputTemp.redirect" :disabled="redirectDisabled">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="路由地址" prop="routePath">
              <el-input v-model="inputTemp.routePath" />
              <div class="sub-title">左斜杠'/'开头时路由认定为绝对路径，没有左斜杠则路由认定为相对路径</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row />
        <el-row>
          <el-col :span="24">
            <el-form-item label="组件路径" prop="componentPath">
              <el-input v-model="inputTemp.componentPath" :disabled="true" />
              <div class="sub-title">根级组件默认为Layout,自定义组件为自定义的路径,路径指的是在'src/views'下的相对路径</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >确认</el-button>
      </div>
    </el-dialog>

    <!--查看详情-->
    <el-dialog
      title="查看详情"
      :visible.sync="dialogViewVisible"
      :close-on-click-modal="false"
      width="40%"
      append-to-body
    >
      <row style="line-height:4.0;">
        <el-row>
          <el-col :span="12">
            <label>上级菜单：</label>
            <span v-if="viewRow.parent"> {{ viewRow.parent.title }}</span>
            <span v-else>跟级菜单</span>
          </el-col>
          <el-col :span="12">
            <label>菜单名称：</label> {{ viewRow.title }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <label>菜单图标：</label>  <svg-icon :icon-class="viewRow.icon" />
          </el-col>
          <el-col :span="12">
            <label>是否隐藏：</label>  <span v-if="viewRow.hidden"> 是</span>
            <span v-else>否</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <label>模块名称：</label>   {{ viewRow.moduleName }}
          </el-col>
          <el-col :span="12">
            <label>路由地址：</label>  {{ viewRow.routePath }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <label>组件路径：</label>   {{ viewRow.componentPath }}
          </el-col>
          <el-col :span="12">
            <label>排序：</label>   {{ viewRow.orderNo }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <label>创建时间：</label>   {{ viewRow.createAt | parseTime("{y}-{m}-{d} {h}:{i}") }}
          </el-col>
          <el-col :span="12">
            <label>更新时间：</label>   {{ viewRow.updateAt | parseTime("{y}-{m}-{d} {h}:{i}") }}
          </el-col>
        </el-row>
      </row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogViewVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination/index'
import RightToolbar from '@/components/RightToolbar/index'
import permission from '@/directive/permission'
import waves from '@/directive/waves'
import { create, remove, update, listMenu } from '@/api/system/menu'
import IconSelect from '@/components/IconSelect'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'Menu',
  components: { Pagination, RightToolbar, IconSelect, Treeselect },
  directives: { permission, waves },
  filters: {},
  data() {
    return {
      showSearch: true,
      permission: {
        add: ['menu:create'],
        edit: ['menu:update'],
        view: ['menu:getById'],
        del: ['menu:delete'],
        addOrEdit: ['menu:create', 'menu:update']
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改菜单',
        create: '添加菜单'
      },
      dialogViewVisible: false,
      viewRow: '',
      redirectDisabled: false,
      inputTemp: {
        id: '',
        parentId: 0,
        title: '',
        icon: '',
        orderNo: 1,
        hidden: false,
        redirect: false,
        moduleName: '',
        routePath: '',
        componentPath: ''
      },
      menuOptions: [],
      visibleOptions: [
        { dictLabel: '否', dictValue: false },
        { dictLabel: '是', dictValue: true }
      ],
      // 列信息
      columns: [
        { key: 0, label: `标题`, visible: true },
        { key: 1, label: `图标`, visible: true },
        { key: 2, label: `模块名称`, visible: true },
        { key: 3, label: `路由地址`, visible: true },
        { key: 4, label: `组件路径`, visible: true },
        { key: 5, label: `排序`, visible: true },
        { key: 6, label: `是否隐藏`, visible: true },
        { key: 7, label: `创建时间`, visible: true },
        { key: 8, label: `操作`, visible: true }
      ],
      rules: {
        title: [
          { required: true, message: 'title is required', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: 'icon is required', trigger: 'change' }
        ],
        moduleName: [
          {
            required: true,
            message: 'moduleName is required',
            trigger: 'blur'
          }
        ],
        routePath: [
          { required: true, message: 'routePath is required', trigger: 'blur' }
        ],
        componentPath: [
          {
            required: true,
            message: 'componentPath is required',
            trigger: 'blur'
          }
        ]
      },
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        search_LIKE_title: undefined,
        sort: undefined
      }
    }
  },
  watch: {

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
    getList() {
      this.listLoading = true
      listMenu(this.listQuery).then((response) => {
        this.list = this.handleTree(response.data, 'id')
        // this.list = response.data
        this.listLoading = false
      })
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      listMenu().then((response) => {
        this.menuOptions = []
        const menu = { id: 0, title: '默认跟级菜单', children: [] }
        menu.children = this.handleTree(response.data, 'id')
        this.menuOptions.push(menu)
      })
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.title,
        children: node.children
      }
    },
    // 选择父级别菜单联动组件名称
    resetComponentPath() {
      const id = this.inputTemp.parentId
      console.log('targetMenuId=' + id)
      if (this.inputTemp.parentId === 0) {
        this.inputTemp.componentPath = 'Layout'
        this.redirectDisabled = false
      } else {
        this.redirectDisabled = true

        var children = this.menuOptions[0].children
        console.log('children=' + JSON.stringify(children))
        var parentMenu = this.searchNode(id, children)
        console.log('targetMenu=' + parentMenu)
        if (parentMenu !== undefined && parentMenu && parentMenu.parentId === '0') {
          this.inputTemp.componentPath = parentMenu.moduleName + '/' + this.inputTemp.moduleName
        } else {
          this.inputTemp.componentPath = parentMenu.componentPath + '/' + this.inputTemp.moduleName
        }
      }
    },
    // 从菜单树列表中检索出目标菜单
    searchNode(targetMenuId, menuList) {
      let result
      if (menuList && menuList.length > 0) {
        for (var i = 0; i < menuList.length; i++) {
          const menu = menuList[i]

          if (Object.is(targetMenuId, menu.id)) {
            console.log('target menu=' + JSON.stringify(menu))
            result = menu
            break
          } else {
            if (menu.children && menu.children.length > 0) {
              const childMenu = this.searchNode(targetMenuId, menu.children)
              if (childMenu !== undefined) {
                result = childMenu
              }
            }
          }
        }
      }
      return result
    },
    // 表单重置
    resetInputTemp() {
      this.inputTemp = {
        id: '',
        parentId: 0,
        title: '',
        icon: '',
        orderNo: 1,
        hidden: false,
        moduleName: '',
        routePath: '',
        componentPath: ''
      }
      this.isRedirect = false
      this.resetForm('form')
    },
    hiddenFormat(row, column) {
      if (row.hidden) {
        return '<el-tag type="warning">是</el-tag>'
      } else {
        return '<el-tag type="success">否</el-tag>'
      }
    },
    // 选择图标
    selected(name) {
      this.inputTemp.icon = name
    },
    // 搜索
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    // 查看详情
    toView(row) {
      this.viewRow = row
      this.dialogViewVisible = true

      // this.$alert(row.title, '查看详情', {
      //   showCancelButton: true,
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   callback: (action) => {}
      // })
    },
    // 添加
    toCreate(row) {
      this.resetInputTemp()
      this.getTreeselect()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      if (row) {
        this.inputTemp.parentId = row.id
      } else {
        this.inputTemp.parentId = 0
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    toUpdate(row) {
      this.resetInputTemp()
      this.getTreeselect()
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.inputTemp = Object.assign({}, row) // copy obj

      if (this.inputTemp.parentId === '0') {
        this.redirectDisabled = false
      } else {
        this.redirectDisabled = true
      }

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
    toBatchDelete(row, index) {
      console.log('index=' + index + ' row=' + row)
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$notify({
            title: '成功',
            type: 'success',
            message: '删除成功!',
            duration: 2000
          })
          this.list.splice(index, 1)
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
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          create(this.inputTemp).then(response => {
            if (response.success) {
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: response.message,
                type: 'warning',
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
          const tempData = Object.assign({}, this.inputTemp)
          update(tempData).then(response => {
            if (response.success) {
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: response.message,
                type: 'warning',
                duration: 2000
              })
            }
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

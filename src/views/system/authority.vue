<template>

  <el-row>

    <el-col :span="6">
      <div class="authority-container-left">
        <el-input
          v-model="filterText"
          placeholder="输入菜单名称查询"
        />
        <el-tree ref="tree" :expand-on-click-node="false" :highlight-current="true" :data="menuTreeData" :props="defaultProps" default-expand-all :filter-node-method="filterNode" @node-click="handleNodeClick" />
      </div>
    </el-col>
    <el-col :span="18">
      <div class="authority-container-right">
        <el-alert
          title="授权信息为服务端根据对外开放的RestFul接口信息自动生成，此处仅供前端开发查看，使用授权信息“Permission”进行功能权限配置"
          type="success"
          style="margin:10px 0px 10px 0px;"
        />
        <!--检索-->
        <el-row>
          <el-form v-show="showSearch" ref="queryForm" :model="listQuery" :inline="true">
            <el-form-item label="授权名称" prop="search_LIKE_name">
              <el-input
                v-show="showSearch"
                v-model="listQuery.search_LIKE_name"
                placeholder="请输入授权名称"
                size="small"
                @keyup.enter.native="handleFilter"
              />
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" size="small" @click="handleFilter">搜索</el-button>
            <el-button icon="el-icon-refresh" size="small" @click="resetFilter">重置</el-button>
          </el-form>
        </el-row>

        <!--功能按钮-->

        <right-toolbar :show-search.sync="showSearch" :columns="columns" @queryTable="getList" />
        <el-table ref="multipleTable" v-loading="listLoading" :row-class-name="tableRowClassName" :data="list" fit highlight-current-row stripe style="width: 100%" @row-click="onRowClick">
          <el-table-column v-if="columns[0].visible" align="center" label="序号" width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.row_index+1 }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="columns[1].visible" label="授权名称" prop="name" />
          <el-table-column v-if="columns[2].visible" label="URI" prop="uri" />
          <el-table-column v-if="columns[3].visible" label="Method">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.method==='GET'" effect="dark" type="success">{{ scope.row.method }}</el-tag>
              <el-tag v-if="scope.row.method==='DELETE'" effect="dark" type="danger">{{ scope.row.method }}</el-tag>
              <el-tag v-if="scope.row.method==='PUT'" effect="dark" type="warning">{{ scope.row.method }}</el-tag>
              <el-tag v-if="scope.row.method==='POST'" effect="dark">{{ scope.row.method }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="columns[4].visible" label="Permission">
            <template slot-scope="scope">
              <el-tag type="info" effect="dark">{{ scope.row.permission }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="columns[5].visible" label="模块名称" prop="module" />
          <el-table-column v-if="columns[6].visible" align="center" label="创建时间">
            <template slot-scope="scope">
              <span>{{ scope.row.createAt | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="columns[7].visible" align="center" label="更新时间">
            <template slot-scope="scope">
              <span>{{ scope.row.updateAt | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" style="margin-top:0px;" @pagination="getList" />
      </div>
    </el-col>
  </el-row>

</template>
<script>
import RightToolbar from '@/components/RightToolbar'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { menuTree } from '@/api/system/menu'
import { page } from '@/api/system/authority'
import permission from '@/directive/permission/index.js' // 权限判断指令

export default {
  name: 'Authority',
  components: { Pagination, RightToolbar },
  directives: { permission, waves },
  filters: {},
  data() {
    return {
      showSearch: true,
      filterText: '',
      menuTreeData: [{ id: '0', 'name': '默认根级菜单', 'module': '', children: [] }],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      columns: [
        { key: 0, label: `序号`, visible: true },
        { key: 1, label: `授权名称`, visible: true },
        { key: 2, label: `URI`, visible: true },
        { key: 3, label: `Method`, visible: true },
        { key: 4, label: `Permission`, visible: true },
        { key: 5, label: `模块名称`, visible: true },
        { key: 6, label: `创建时间`, visible: true },
        { key: 7, label: `更新时间`, visible: true }
      ],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        search_EQ_module: undefined,
        search_LIKE_name: undefined,
        sort: undefined
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.loadTreeDate()
    this.getList()
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      row.row_index = rowIndex
    },
    onRowClick(row, event, column) {
      this.currentRowIndex = row.row_index
    },
    handleNodeClick(data) {
      this.listQuery.search_EQ_module = data.module
      this.getList()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    loadTreeDate() {
      menuTree('0').then((response) => {
        this.menuTreeData[0].children = response.data
      })
    },
    getList() {
      this.listLoading = true
      page(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // 搜索
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    resetFilter() {
      this.resetForm('queryForm')
      this.getList()
    }
  }
}
</script>
<style>
.authority-container-left{
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin:20px 10px 20px 20px;
}
.authority-container-right{
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin:20px 20px 20px 10px;
}
</style>


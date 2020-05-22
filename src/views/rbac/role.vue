<template>
  <div class="fillcontain rbac-page">
    <div v-if="$route.path == '/rbac/role'" class="table_container">
      <el-row :gutter="20">
        <el-col :span="4" style="width:auto;margin: 0; text-align: left">
          <el-button type="primary" @click="addRole">添加角色</el-button>
        </el-col>
      </el-row>
      <!--展示-用户列表信息-->
      <el-table
        :data="userList"
        align="center"
        style="overflow: auto;"
        border>
        <el-table-column
          v-for="(item,index) in thead"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          align="center">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="200"
          align="center">
          <template slot-scope="scope">
            <el-dropdown>
              <span style="cursor: pointer;">
                管理<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-edit" @click.native.prevent="upDateRole(scope.row)" >修改角色</el-dropdown-item>
                <el-dropdown-item icon="el-icon-warning" @click.native.prevent="deleteRole(scope.row)" >删除角色</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <!--展示-分页-->
      <el-row class="wd-1">
        <el-col>
          <div class="block paging">
            <el-pagination
              :hide-on-single-page="total<pageSize"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="pageSize"
              layout="total, prev, pager, next"
              :total="total">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    <router-view v-else />
  </div>
</template>

<script>
  import {
    Table, TableColumn, Pagination, Col, Row, Button, Input, Select, Option, MessageBox,
  } from 'element-ui';
  // 导入 role 单独维护的 mixin
  import {RoleMixins} from "../../mixins/rbac/role";
  import RBACAPI from "@/api/rbac/index"
  export default {
    name: "orderList",
    mixins:[RoleMixins],
    components: {
      elButton: Button,
      elTable: Table,
      elTableColumn: TableColumn,
      elPagination: Pagination,
      elCol: Col,
      elRow: Row,
    },
  }
</script>

<style lang="less" scoped>
  .el-select .el-input {
    width: 100px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
  .typeStyle {
    margin-top: 3px;
  }
  .fillcontain.rbac-page {
    position: relative;
  }
</style>

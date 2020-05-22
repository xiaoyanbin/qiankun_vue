<template>
  <div class="fillcontain rbac-page">
    <!--弹窗-添加/修改用户信息-->
    <div v-if="$route.path == '/rbac/account'" class="table_container" >
      <!--展示-用户搜索条件-->
      <el-row :gutter="20" class="wd-1">
          <el-col :span="6">
            <el-input placeholder="请输入内容" v-model="searchInput" class="input-with-select">
              <el-select
                v-model="selectType"
                slot="prepend"
                placeholder="请选择"
                style="width: 100px;">
                <el-option label="手机号" :value="'tel'"></el-option>
                <el-option label="邮箱" :value="'email'"></el-option>
                <el-option label="姓名" :value="'nameLike'"></el-option>
<!--                <el-option label="全部" :value="'all'"></el-option>-->
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click="accountSearch(searchInput,selectType)"></el-button>
            </el-input>
          </el-col>
        <el-col :span="6" style="width: auto">
          <el-button @click="addAccount(selectType)">添加管理员</el-button>
        </el-col>
      </el-row>
      <!--展示-用户列表信息-->
      <el-table
        :data="userList"
        style="overflow: auto;"
        align="center"
        border>
        <el-table-column
          v-for="(item,index) in thead"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          align="center">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="170px">
          <template slot-scope="scope">
            <el-dropdown>
              <span style="cursor: pointer;">
                管理<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-edit" @click.native.prevent="updateAccount(scope.row)" >修改账户</el-dropdown-item>
                <el-dropdown-item icon="el-icon-warning" @click.native.prevent="resetPassword(scope.row)" >重置密码</el-dropdown-item>
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
              :current-page.sync="currentPage"
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
  import RBACAPI from "@/api/rbac/index"
  import {
    Table, TableColumn, Pagination, Col, Row, Button, Input, Select, Option,
  } from 'element-ui';
  // 导入维护的 account 的 mixin
  import {AccountMixins} from "../../mixins/rbac/account";

  export default {
    name: "orderList",
    mixins:[AccountMixins],
    components: {
      elButton: Button,
      elTable: Table,
      elTableColumn: TableColumn,
      elPagination: Pagination,
      elCol: Col,
      elRow: Row,
      elInput: Input,
      elSelect: Select,
      elOption: Option,
    },
  }
</script>

<style lang="less" scoped>
  .el-select .el-input {
    width: 100%;
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

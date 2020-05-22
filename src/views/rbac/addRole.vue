<template>
  <div style="width: 100%;position: relative;text-align: left">
    <el-button
            icon="el-icon-back"
            circle @click="goBack"
            style="position: absolute;top: 0;left: 20px;"></el-button>
    <el-form
            ref="form"
            :model="form"
            :rules="rules"
            label-width="80px"
            style="width: 300px;margin: 20px auto 0 ;">
      <el-form-item label="角色名字" prop="name">
        <el-input
                style="width: 150px;"
                v-model="form.name"></el-input>
      </el-form-item>
<!--      <el-form-item label="角色类型" prop="type">-->
<!--        <el-select-->
<!--                v-model="form.type"-->
<!--                style="width: 150px;"-->
<!--                placeholder="选择角色类型"-->
<!--                @change="roleTreeShow(form.type)">-->
<!--          <el-option label="管理员" :value="1" :key="1" ></el-option>-->
<!--          <el-option label="普通用户" :value="2" :key="2" ></el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item label="状态">
        <el-select v-model="form.state " style="width: 150px;" placeholder="请选择">
          <el-option :value="0" label="有效"></el-option>
          <el-option :value="1" label="禁用"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色权限" v-if="showTree">
        <!-- 树展示 -->
        <el-tree
            class="filter-tree"
            :data="data"
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
            show-checkbox
            @check-change="isCheck"
            node-key="id"
            ref="tree">
          <span class="custom-tree-node" slot-scope="{ node , data }">
            <span>{{ data.name }}</span>
          </span>
        </el-tree>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <!--          <el-button>取消</el-button>-->
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import RBACAPI from "@/api/rbac/index"
  import tree from "./menuTree"
  import {
    Button,
    Input,
    Select,
    Option,
    FormItem,
    Form,
    Tree,
  } from 'element-ui';

  // 导入 role 单独维护的 mixin
  import {addRoleMixins} from "../../mixins/rbac/role";
  export default {
    name: "addRole",
    mixins:[addRoleMixins],
    components: {
      elButton: Button,
      elInput: Input,
      elSelect: Select,
      elOption: Option,
      elFormItem: FormItem,
      elForm: Form,
      elTree: Tree,
    },
  }
</script>

<style scoped>

</style>

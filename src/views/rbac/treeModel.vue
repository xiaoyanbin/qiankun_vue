<template>
    <el-form :model="tree" :rules="rules" ref="tree" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="tree.name" ></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sequence">
        <el-input v-model.number="tree.sequence"></el-input>
      </el-form-item>
      <el-form-item label="页面路径" prop="url">
        <el-input v-model="tree.url"></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input v-model="tree.icon"></el-input>
      </el-form-item>
      <el-form-item label="状态" style="text-align: left">
        <el-select v-model="tree.state" placeholder="请选菜单状态">
          <el-option label="开启" :value="0"></el-option>
          <el-option label="删除" :value="-1"></el-option>
          <el-option label="隐藏" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-button @click="cancel('tree')">取 消</el-button>
        <el-button type="primary" @click="determine('tree')">确 定</el-button>
      </el-form-item>
    </el-form>
</template>

<script>
  import {
    Button, Input, Select, Table, Option, FormItem, Form,
  } from 'element-ui';

  // 导入 role 单独维护的 mixin
  import {treeModelMixins} from "../../mixins/rbac/treeModel";
  export default {
    name: "treeModel",
    mixins:[treeModelMixins],
    components: {
      elButton: Button,
      elInput: Input,
      elSelect: Select,
      elOption: Option,
      elFormItem: FormItem,
      elForm: Form,
    },
  }
</script>

<style lang="less" scoped>
  #app {
    .el-form-item__label {
      text-align: center;
    }
  }
</style>

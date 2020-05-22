<template>
  <div class="table_container rbac-page">
    <!-- 筛选内容 -->
    <el-input
      placeholder="输入关键字进行过滤"
      v-model="filterText">
    </el-input>
    <!-- 树展示 -->
    <el-tree
      class="filter-tree"
      :data="data"
      :props="defaultProps"
      default-expand-all
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      ref="tree">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            v-if="nodeShowOrHide(data,'directory')"
            @click="() => append(data,'1')">
            新增目录
          </el-button>
          <el-button
            type="text"
            size="mini"
            v-if="nodeShowOrHide(data,'menu')"
            @click="() => append(data,'1')">
            新增菜单
          </el-button>
          <el-button
            type="text"
            size="mini"
            v-if="nodeShowOrHide(data,'button')"
            @click="() => append(data,'3')">
            新增按钮
          </el-button>
          <el-button
            type="text"
            size="mini"
            v-if="nodeShowOrHide(data,'element')"
            @click="() => append(data,'buttonResource')">
            新增元素
          </el-button>
          <el-button
            type="text"
            size="mini"
            v-if="!data.noRole"
            @click="() => update(data)">
            修改
          </el-button>
          <el-button
            type="text"
            size="mini"
            v-if="!data.noRole"
            @click="() => deleteTree(data)">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>
    <!-- 新增修改模板 -->
    <el-dialog
      :title="openPopupData.title"
      :visible.sync="openPopupData.status"
      :before-close="treeModelClose">
      <!-- 目录资源控制 -->
      <directoryResource
              v-if="(openPopupData.type == '1' || openPopupData.type == '2') && openPopupData.status"
              :treeData="treeData" @update="getTreeData" ></directoryResource>
      <!-- 按钮资源控制 -->
      <buttonResource
              v-if="(openPopupData.type == '3' || openPopupData.type == '4') && openPopupData.status"
              :treeData="treeData" @update="getTreeData" ></buttonResource>
      <!-- 元素资源控制 -->
      <elementResource
              v-if="openPopupData.type == 'buttonResource' && openPopupData.status"
              :treeData="treeData" @update="getTreeData" ></elementResource>
    </el-dialog>
  </div>
</template>

<script>
  import {
    Button, Col, Input, Option, Row, Select, Dialog, Tree, Message, MessageBox,
  } from 'element-ui';
  // 导入树 mixin
  import {TreeMixins} from "../../mixins/rbac/tree";
  import tree from "@/api/rbac/menuTree"
  import directoryResource from "./resourceModel/directoryResource"
  import buttonResource from "./resourceModel/buttonResource"
  import elementResource from "./resourceModel/elementResource"
  export default {
    name: "menuTree",
    mixins:[TreeMixins],
    components: {
      buttonResource,
      directoryResource,
      elementResource,
      elButton: Button,
      elInput: Input,
      elDialog: Dialog,
      elTree: Tree,
    },
  };
</script>

<style scoped>

</style>

<template lang="pug">
  el-form( :model="tree" :rules="rules" ref="tree" label-width="80px")
    el-form-item( label="名称" prop="name")
      el-input( v-model="tree.name")
    el-form-item( label="排序" prop="sequence")
      el-input( v-model="tree.sequence")
    el-form-item( label="唯一标识" prop="uniquelyIdentifies")
      el-input( v-model="tree.uniquelyIdentifies")
    el-form-item( label="资源样式" prop="style")
      el-input( v-model="tree.style")
    el-form-item( label="资源类名" prop="class")
      el-input( v-model="tree.class")
    el-form-item(style="text-align: center;")
      el-button(@click="cancel('tree')") 取 消
      el-button(type="primary" @click="determine('tree')") 确 定
</template>

<script>
  import {
    Button, Input, Select, Table, Option, FormItem, Form,
  } from 'element-ui';

  export default {
    name: "treeModel",
    components: {
      elButton: Button,
      elInput: Input,
      elSelect: Select,
      elOption: Option,
      elFormItem: FormItem,
      elForm: Form,
    },
    data(){
          var isNotNull = (rule, value, callback) => {
            if (!value) {
              return callback(new Error('该字段不能为空'));
            }else {
              callback();
            }
          };
            return {
              form: {
                name: '',
                sequence:'',
                url:'',
                icon:'',
                state: 1
              },
              tree:{
                name: '',
                sequence:'',
                url:'',
                icon:'',
                state:''
              },
              rules: {
                name:[
                  { validator: isNotNull, trigger: 'blur' }
                  ],
                uniquelyIdentifies:[
                  { validator: isNotNull, trigger: 'blur' }
                  ],
                  sequence:[
                  { validator: isNotNull, trigger: 'blur' }
                  ],
              }
            }
        },
        created(){
          this.tree = this.mergeObject(this.treeData)
          // 转换为 number 类型的数据
        },
        props:{
          treeData : {
            type : Object
          }
        },
        methods : {
          cancel(formName){
            this.$emit('update','close',()=>{
              this.tree = this.form;
            });
          },
          determine(formName){
            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.$emit('update',this.tree,res=>{
                  // 父组件 回传子组件 恢复出厂
                  if(res === 'clear'){
                    this.tree = this.form;
                  }
                });
              } else {
                return false;
              }
            });
          },
          mergeObject(treeData){
            let finallyTree = {};
            Object.assign(finallyTree, this.form, treeData);
            return finallyTree;
          }
        },
        watch: {
          treeData: function (val) {
            // 重置事件
            this.$refs['tree'].resetFields();
            this.tree = this.mergeObject(val);
          },
        }
  }
</script>

<style lang="less" scoped>
  #app {
    .el-form-item__label {
      text-align: center;
    }
  }
</style>

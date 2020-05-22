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
      <el-form-item style="text-align: center;">
        <el-button @click="cancel('tree')">取 消</el-button>
        <el-button type="primary" @click="determine('tree')">确 定</el-button>
      </el-form-item>
    </el-form>
</template>

<script>
  import {
    Button, Input, FormItem, Form,
  } from 'element-ui';

  export default {
    name: "treeModel",
    components: {
      elButton: Button,
      elInput: Input,
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
              tree: {
                name: '',
                sequence:'',
                url:'',
                icon:'',
                type:'1',
                state: 0
              },
              rules: {
                name:[
                  { validator: isNotNull, trigger: 'blur' }
                  ],
                sequence:[
                  { validator: isNotNull, trigger: 'blur' }
                  ],
                url: [
                  { validator: isNotNull, trigger: 'blur' }
                  ],
                icon: [
                  { validator: isNotNull, trigger: 'blur' }
                  ],
                state: [
                  { validator: isNotNull, trigger: 'change' }
                  ]
              }
            }
        },
        created(){
          console.log('创建了');
          this.mergeObject(this.treeData)
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
              this.$refs['tree'].resetFields();
            });
          },
          determine(formName){
            this.$refs[formName].validate((valid) => {
              if (valid) {
                // 有 pid 新增菜单 type = 2
                if(this.tree.pid){
                  this.tree.type = '2';
                }
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
            for (let i in treeData) {
              this.tree[i] = treeData[i]
            }
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

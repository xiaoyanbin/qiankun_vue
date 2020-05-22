<template lang="pug">
    el-form( :model="tree" :rules="rules" ref="tree" label-width="80px")
        el-form-item( label="名称" prop="name")
            el-input( v-model="tree.name")
        el-form-item( label="排序" prop="sequence")
            el-input( v-model="tree.sequence")
        el-form-item( label="唯一标识" prop="uniquelyIdentifies")
            el-input( v-model="tree.uniquelyIdentifies")
        el-form-item( label="菜单链接" prop="url")
            el-input( v-model="tree.url")
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
        Button, Input, Select, Table, Option, FormItem, Form, Message,
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
        data() {
            var isNotNull = (rule, value, callback) => {
                if (!value) {
                    //Message.warning('该字段不能为空');
                    return callback(new Error('该字段不能为空'));
                } else {
                    callback();
                }
            };
            return {
                tree: {
                    name: '',
                    uniquelyIdentifies: '',
                    sequence: '',
                    url: '',
                    icon: '',
                    state: '0',
                    type: '3'
                },
                rules: {
                    name: [
                        {validator: isNotNull, trigger: 'blur'}
                    ],
                    uniquelyIdentifies: [
                        {validator: isNotNull, trigger: 'blur'}
                    ],
                    url: [
                        {validator: isNotNull, trigger: 'blur'}
                    ],
                    sequence: [
                        {validator: isNotNull, trigger: 'blur'}
                    ],
                }
            }
        },
        created() {
            console.log('创造了');
            this.mergeObject(this.treeData)
            // 转换为 number 类型的数据
        },
        updated() {
            console.log(this.tree);
        },
        props: {
            treeData: {
                type: Object
            }
        },
        methods: {
            cancel(formName) {
                this.$emit('update', 'close', () => {
                    this.$refs['tree'].resetFields();
                });
            },
            determine(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        /**
                         * 如果 添加按钮时也添加了 url 代表 菜单按钮(如:'添加账户')
                         * */
                        if (this.tree.url != "") {
                            this.tree.type = '4';
                        }
                        this.$emit('update', this.tree, res => {
                            // 父组件 回传子组件 恢复出厂
                            if (res === 'clear') {
                                this.tree = this.form;
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            mergeObject(treeData) {
                console.log(this.tree);
                console.log(treeData);
                for (let i in treeData) {
                    this.tree[i] = treeData[i]
                }
            }
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

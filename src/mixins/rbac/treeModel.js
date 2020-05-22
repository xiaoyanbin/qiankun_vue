import {Message,Loading} from "element-ui";

// 角色权限 mixins
export const treeModelMixins = {
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
};

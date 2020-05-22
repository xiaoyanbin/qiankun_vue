import {Message, Loading, MessageBox} from "element-ui";
/** 导入 rbac 专用的 接口 */
import RBACAPI from "@/api/rbac/index"
// 角色权限 mixins
export const RoleMixins = {
    data () {
        return {
            form: {
                name: '',
                type: ''
            },
            thead: [{ //表格头部信息
                prop: "name",
                label: "名称",
                width: ""
            },{
                prop: "typeName",
                label: "角色类型",
                width: ""
            },{
                prop: "createTime",
                label: "创建时间",
                width: ""
            }],
            userList: [],
            currentPage: 1,
            total:0,
            pageSize:10
        }
    },
    methods: {
        getOrderList (currentPage) {
            if(currentPage) this.currentPage = currentPage;
            let params = {currentPage:this.currentPage,pageSize:this.pageSize};
            RBACAPI.role.getRoleList(params).then(res=>{
                this.userList = res.data.records;
                this.total = res.data.total;
            },rej=>{
                //console.log(rej);
            })
        },
        handleSizeChange(val) {
            //window.console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.getOrderList(val);
        },
        handleClose(done) {
            MessageBox('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => {});
        },
        addRole(){
            this.$router.push({path:'/rbac/addRole'});
        },
        upDateRole(data){
            //window.console.log(data);
            let roleUser = {
                id:data.id,
                name:data.name,
                type:data.type
            };
            this.$router.push({path:'/rbac/addRole',query:roleUser})
        },
        deleteRole(data){
            MessageBox(`是否删除 ${data.name} 该角色`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                RBACAPI.role.delRole({id:data.id}).then(res=>{
                    if(!res){
                        this.$message({
                            type: 'success',
                            message: `删除 ${data.name} 角色,失败!`
                        });
                    }else {
                        this.getOrderList(1);
                        this.$message({
                            type: 'success',
                            message: res.message
                        });
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消删除'
                });
            });
        }
    },
    mounted() {
        this.getOrderList(1)
    }
};
// 角色权限 mixins
export const addRoleMixins = {
    data() {
        var isNotNull = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('该字段不能为空'));
            }else {
                callback();
            }
        };
        return {
            showTree:true,
            form: {
                name: '',
                type: '2',
                state: 0,
                menuIds: [],
                defaultMenu:[]
            },
            rules: {
                name:[
                    { validator: isNotNull, trigger: 'blur' }
                ],
                type:[
                    { validator: isNotNull, trigger: 'blur' }
                ],
                url: [
                    { validator: isNotNull, trigger: 'blur' }
                ],
                state: [
                    { validator: isNotNull, trigger: 'change' }
                ]
            },
            data:[],
            checkNode:[],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
        }
    },
    methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        onSubmit() {
            // 如果不选择权限
            if(this.form.type!==3){
                this.form.menuIds = this.$refs.tree.getCheckedKeys();
                this.form.menuIds.push(this.$refs.tree.getHalfCheckedKeys());
                if(this.form.menuIds.length>0){
                    let score = {};
                    // 深度拷贝一份 对象出来
                    score = Object.assign({},score,this.form);
                    score.resourceIds = score.menuIds.join(',');
                    RBACAPI.role.addRole(score).then(res=>{
                        if(!res.code){
                            // 弹出相关的操作
                            this.$message({type:"success",message:res.message});
                            console.log(this)
                            this.$parent.getOrderList()
                            // 返回当前的操作页面
                            this.$router.go(-1);
                        }else {
                            this.$message({type:"error",message:res.message});
                        }
                    });
                }else{
                    this.$message({
                        type: 'error',
                        message: '请选择权限'
                    });
                }
            }else{
                if(this.form.name!==""){
                    let score = {};
                    // 深度拷贝一份 对象出来
                    score = Object.assign({},score,this.form);
                    score.menuIds = score.menuIds.join(',');
                    RBACAPI.role.addRole(score).then(res=>{
                        if(res){
                            // 弹出相关的操作
                            this.$message({type:"success",message:res.message});
                            // 返回当前的操作页面
                            this.$router.go(-1);
                        }
                    });
                }
            }

        },
        async setCheckedKeys(id) {
            // 设置节点被选中 - 数组中的对象是 默认应该被选中的 id 元素
            this.$refs.tree.setCheckedKeys(id);
        },
        async getTree(type,roleId,isManager){
            RBACAPI.tree.getRbac(type,roleId).then(res=>{
                let isCheck = 'user';
                // 查看是否选中角色权限,默认为不选中，如果 roleId 为 1 就为管理员
                if(isManager==1){
                    isCheck = 'manager'
                }
                this.filterTree(res.data,isCheck,true);
                if(roleId){
                    this.setCheckedKeys(this.form.menuIds);
                }
            })
        },
        filterTree(data){
            // 建立新的 权限分配 数组
            var assignablePermissions = [];
            for(var i = 0 ; i < data.length ; i ++){
                if(data[i].level == 1){
                    for(var j = 0 ; j < data[i].children.length ; j ++){
                        assignablePermissions.push(data[i].children[j]);
                    }
                }
            }
            console.log(assignablePermissions);
            this.data = assignablePermissions;
        },
        isCheck(data, checked, indeterminate){
            // checked 来判断当前点击的节点是否被选中
            // if(checked){
            //   // 选中将 当前的节点新增
            //   this.form.menuIds.push(data.id)
            //
            // }else {
            //   // 否则删除
            //   this.form.menuIds.remove(data.id);
            // }
        },
        goBack(){
            this.$router.go(-1);
        },
        roleTreeShow(type){
            // 选择的身份为 管理员 否则为 普通用户

            if(type !== 3){
                if(type == 1){
                    this.form.defaultMenu = this.checkNode;
                    this.filterTree(this.data,'manager',false)
                }else if(type == 2){
                    this.form.defaultMenu = [];
                    this.filterTree(this.data,'user',false)
                }
                this.setCheckedKeys(this.form.defaultMenu);
                this.showTree = true;
            }else{
                this.showTree = false;
            }
        }
    },
    created() {
        // 将 this.form.type 转换为 number 类型的数据
        this.form.type = Number(this.form.type);
        if(JSON.stringify(this.$route.query) !== '{}'){
            setTimeout(res=>{
                // window.console.log(typeof this.$route.query.type);
                this.form = Object.assign({},this.form,this.$route.query)//this.$route.query //Object.assign({},this.form,this.$route.query);
                this.form.type = Number(this.form.type);
            },100);
            this.getTree(3,this.$route.query.id,this.$route.query.type)
        }else {
            this.getTree(2)
        }
    }
};

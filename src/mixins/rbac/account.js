import {Message,Loading} from "element-ui";
import {formVer} from "../../plugins/formValidator"
/** 导入 rbac 专用的 接口 */
import RBACAPI from "@/api/rbac/index"
/** 导入数据类型校验 */
import dataType from "../../plugins/VerificationDataType"
/** 账户 mixins */
export const AccountMixins = {
    data () {
        return {
            type: 1,
            searchInput: '',
            selectType: 'tel',
            value1: '',
            thead: [
                { //表格头部信息
                    prop: "loginName",
                    label: "用户名",
                    width: "100"
                },{
                    prop: "name",
                    label: "姓名",
                    width: "120"
                },
                //   {
                //   prop: "email",
                //   label: "邮箱",
                //   width: "200"
                // },
                {
                    prop: "stateName",
                    label: "状态",
                    width: "100"
                },{
                    prop: "tel",
                    label: "手机号",
                    width: "130"
                },{
                    prop: "roleName",
                    label: "角色名称",
                    width: "100"
                },
                //   {
                //   prop: "companyName",
                //   label: "公司名称",
                //   width: "100"
                // },
                //   {
                //   prop: "createTime",
                //   label: "创建时间",
                //   width: "180"
                // },{
                //   prop: "updateTime",
                //   label: "最后一次更新时间",
                //   width: "180"
                // }
            ],
            userList: [],
            currentPage: 1,
            total:0,
            pageSize:10
        }
    },
    methods: {
        getAccountList (currentPage) {
            if(currentPage) this.currentPage = currentPage;
            let params = {currentPage:this.currentPage,pageSize:this.pageSize};
            RBACAPI.account.getUserList(params).then(res=>{
                this.userList = res.data.records;
                this.total = res.data.total;
            }).catch(e=>{
                console.log(e);
            })
        },
        handleSizeChange(val) {
            //window.console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.getAccountList({currentPage:val,pageSize:this.pageSize})
        },
        addAccount() {
            localStorage.removeItem('account');
            this.$router.push({path: '/rbac/addAccount'});
        },
        resetPassword(data){
            this.$alert('重置密码 为默认密码', `是否重置该用户 ${data.name} 密码`, {
                confirmButtonText: '确定',
                callback: action => {
                    //window.console.log(action);
                    RBACAPI.account.resetPassword({id:data.id}).then(res=>{
                        //window.console.log(res);
                    })
                }
            });
        },
        accountSearch(value,name){
            let res = {};
            if(this.selectType != 'all'){
                res[name] = value;
            }
            // let rule = {
            //   tel : 13
            // }
            // if(Number(value) != '0'){
            // if(value.length!=rule[name]){
            //     return false;
            // }

            this.getAccountList(res)
            // }
        },
        updateAccount(data){
            localStorage.setItem('account',JSON.stringify(data));
            this.$router.push({path:'/rbac/addAccount',params:data});
        }
    },
    mounted() {
        this.getAccountList(1)
    }
};
/** 角色权限 mixins */
export const addAccountMixins = {
    data() {
        return {
            form: {
                loginName: '',
                site: '',
                name: '',
                birthday: '',
                sex: '',
                state: 0,
                identityNum: '',
                email: '',
                tel: '',
                roleIds: '',
                companyId: ''
            },
            rules: {
                loginName: [
                    {validator: formVer.loginName, trigger: 'blur'}
                ],
                name: [
                    {validator: formVer.text, trigger: 'blur'}
                ],
                birthday: [
                    {
                        validator: (rule, value, callback) => {
                            formVer.isCheck(rule, value, callback, 'text')
                        }, trigger: 'blur'
                    }
                ],
                sex: [
                    {
                        validator: (rule, value, callback) => {
                            formVer.isCheck(rule, value, callback, 'text')
                        }, trigger: 'change'
                    }
                ],
                state: [
                    {validator: formVer.text, trigger: 'blur'}
                ],
                identityNum: [
                    {
                        validator: (rule, value, callback) => {
                            formVer.isCheck(rule, value, callback, 'IDCard')
                        }, trigger: 'blur'
                    }
                ],
                email: [
                    {
                        validator: (rule, value, callback) => {
                            formVer.isCheck(rule, value, callback, 'email')
                        }, trigger: 'blur'
                    }
                ],
                tel: [
                    {validator: formVer.phone, trigger: 'change'}
                ],
                roleIds: [
                    {validator: formVer.text, trigger: 'change'}
                ],
                companyId: [
                    {
                        validator: (rule, value, callback) => {
                            formVer.isCheck(rule, value, callback, 'text')
                        }, trigger: 'change'
                    }
                ],
            },
            roleList: [],
            siteIds: {
                total: 0,
                list: 0,
                pageSize: 6,
                name: [],
            },
            isSiteIdManagers: false,
            companyList: []
        }
    },
    methods: {
        onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 名字使用 登陆名字
                    // this.form.name = this.form.loginName;
                    //window.console.log(valid);
                    let param = {};
                    for(let i in this.form) {
                        param[i] = this.form[i];
                    }
                    console.log(param.roleIds);
                    param.roleIds = dataType.isString(param.roleIds) ? param.roleIds : param.roleIds.join(',');
                    RBACAPI.account.updateUserInformation(param).then(res => {
                        if (!res.code) {
                            Message.success(res.message)
                            // 删除本地 账户内容
                            localStorage.removeItem('account');
                            // 更新父级列表
                            this.$parent.getAccountList()
                            this.$router.go(-1)
                        } else {
                            Message.error(res.message)
                        }
                    })
                }
            })
        },
    },
    mounted() {
        RBACAPI.role.getRoleList({currentPage: 1, pageSize: 100}).then(res => {
            this.roleList = res.data.records
            // this.$api.account.getCompanyList().then(res=>{
            //   this.companyList = res.data;
            //window.console.log(this.$route.params);
            let data = this.$route.params;
            if (JSON.stringify(this.$route.params) === '{}') {
                if (localStorage.getItem('account')) {
                    // 获取保存的数据
                    data = JSON.parse(localStorage.getItem('account'));
                    for (let i in this.form) {
                        console.log(data[i]);
                        this.form[i] = data[i];
                        if (typeof data[i] === 'undefined') {
                            this.form[i] = '';
                        }
                    }
                    // 保存 roleIds
                    this.form.roleIds = []
                    for(let i = 0 ; i < data.roleVoList.length ; i ++){
                        this.form.roleIds.push(data.roleVoList[i].id)
                    }
                    // 新增 id
                    this.form.id = data.id;
                }
            }
            // });
        });
    }
};

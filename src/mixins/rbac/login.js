/** 导入 rbac 专用的 接口 */
import RBACAPI from "@/api/rbac/index"

import {Message, Loading, MessageBox } from "element-ui";

import {getAppIdByDomain} from "../../service/service";
import {isValidIP} from "../../config/project.config";

/** 登陆 mixins */
export const LoginMixins = (project,isValidIP) => {
    return {
        data() {
            return {
                init: {},
                loginForm: {
                    loginName: '',
                    password: '',
                    platform: null
                },
                sysName: "",
                rules: {
                    loginName: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                },
            }
        },
        methods: {
            async submitForm(formName) {
                // element-ui 校验是否正确
                this.$refs[formName].validate(async (valid) => {
                    console.log(valid);
                    if (valid) {
                        // 调用登录接口
                        RBACAPI.login.goToLogin(this.loginForm).then(res => {
                            // 存储 token
                            if (res.code === 0) {
                                console.log(res);
                                this.setToken(res.data);
                                // 请求成功后 获取动态路由
                                // 向父组件( app.vue ) 发送登录成功的信息 来改改变 登录的状态
                                let loading = this.showLoading('正在登录');
                                // 如果 是 token 过期 所导致的 回退到 登录页面 那么登录后 会到 刚刚的页面
                                setTimeout(() => {
                                    //登录接口
                                    Message({
                                        type: 'success',
                                        message: '登录成功'
                                    });
                                    loading.close();
                                    // 是否有回跳地址，无回到首页
                                    let bounceAddress = this.$route.query.redirect;
                                    if (bounceAddress) {
                                        this.$router.push(bounceAddress)
                                    } else {
                                        this.$router.push('/')
                                    }
                                }, 1000);
                            } else {
                                Message({
                                    type: 'warning',
                                    message: res.message
                                });
                            }
                        })
                    } else {
                        Message.error({
                            title: '错误',
                            message: '请输入正确的用户名密码',
                            offset: 100
                        });
                        return false;
                    }
                });
            },
            async setToken(token) {
                localStorage.setItem('token', token);
            },
            async checkToken() {
                return await RBACAPI.login.checkToken();
            },
            showLoading(text) {
                return Loading.service({
                    lock: true,
                    text: text,
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
            },
            async getDomain(){
                var params = {};
                // saas 模块 没有域名前可以用作开发
                if(location.host == 'dev-saas.ambow.com' || isValidIP(location.host)) {
                    params.domain = 'study-admin.ambow.com'
                }else {
                    params.domain = location.hostname.replace(/dev-|uat-|pre-|fix-/g, "")
                }
                const res = await getAppIdByDomain(params)
                if (res.code == 0) {
                    localStorage.setItem('appInfo', JSON.stringify(res.data));
                    this.sysName = JSON.parse(localStorage.getItem('appInfo'))[0].appName + '管理后台';
                    // 保存appid
                    localStorage.setItem('appId', res.data[0].appId)

                    // 动态配置favicon
                    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
                    link.type = 'image/x-icon';
                    link.rel = 'shortcut icon';
                    link.href = JSON.parse(localStorage.getItem('appInfo'))[0].browserIcon;
                    document.getElementsByTagName('head')[0].appendChild(link);
                    // 网页title
                    document.title = this.sysName;
                }
                // 将配置 页面的 sysName 进行赋值
            }
        },
        async created() {
            // 加载页面时 清除 token
            localStorage.clear();
            // 加载 默认 appId 内容
            this.getDomain()

            this.init.isModel = project.isModel;
            this.loginForm.platform = project.platform;
        }
    }
};

/** 导入 rbac 专用的 接口 */
import RBACAPI from "@/api/rbac/index"

/** 导入一个 本地 / 生产 环境的引入 vue 的方法 */
const _import = require('./importRoute/_import_' + process.env.NODE_ENV);
/** rbac 左侧树的 公共 mixin 合集 */
export const LeftMenuMixin = (leftSkin,)=>{
    return {
        data() {
            return {
                active:'',
                theme2: 'light',
                collapsed: false,
                routerList: [],
                breadcrumb: [1, 2],
                leftSkin: leftSkin,
                defaultSkin: {
                    backgroundColor: "rgba(70, 76, 91, 1)",
                    textColor: "rgba(241, 241, 241, 1)",
                    activeTextColor: "rgb(20, 92, 205)",
                    collapseTransition: true,
                    boxBackgroundColor: "rgba(70, 76, 91, 1)",
                    itemClass: ""
                }
            }
        },
        methods: {
            handleopen(next) {
                console.log(next);
            },
            handleclose(next) {
                console.log(next);
            },
            handleselect: function (path, indexPath, Vue) {
                console.log(Vue);
                if (this.$route.path !== path) {
                    // 如果当前路由 不等于即将跳转的路由 就跳转相关的内容 否则不跳转
                    this.$router.push(path);
                }
            },
            handleClose() {
            },
            //用来获取后台拿到的路由
            filterAsyncRouter(asyncRouterMap) {
                let breadcrumbBox = {};
                let breadcrumbList = {};
                let nowRouteList = [];
                function getRole(data){
                    // 查看是否拥有权限
                    if(data.children){
                        data['role'] = [];
                        for(let i = 0 ; i < data.children.length ; i ++){
                            // 抽取是权限的子集 为当前父级赋值
                            if(data.children[i].type >= 3){
                                // 增加权限内容
                                data.role.push(data.children[i]);
                            }
                        }
                    }
                }
                function RouterList(routerMap){
                    //遍历后台传来的路由字符串，转换为组件对象
                    const accessedRouters = routerMap.filter(route => {
                        /**
                         * 重新梳理逻辑 根具 rbac 新逻辑定义
                         * 目录 1
                         * 菜单 2
                         * 按钮 3 (刨除)
                         * 按钮菜单 4
                         * */
                        route.path = '/' + route.url;
                        route.tagName = route.name;
                        try {
                            // 加载到当前的项目中
                            route.component = _import(route.url);
                        } catch (e) {
                            // 路由显示的问题
                            route.tagName = '本地无页面';
                        }
                        // 如果为 按钮菜单
                        if (route.type == 4) {
                            route.treeState = false;
                        }
                        // 当前节点 为 菜单 默认没有 按钮操作
                        if(route.type < 3) {
                            route.treeState = true;
                        }
                        // 当前节点 为 按钮 默认没有菜单的显示
                        if(route.type >= 3){
                            route.treeState = false;
                            route.isButton = true;
                        }
                        // 当前节点 添加到 公共容器中
                        breadcrumbBox[route.level - 1] = route;
                        // 如果容器长度 大于 当前节点等级 执行 除当前节点之后的全部删除
                        if(Object.keys(breadcrumbBox).length > route.level - 1) {
                            for(let i in breadcrumbBox){
                                if(i > route.level - 1){
                                    delete breadcrumbBox[i]
                                }
                            }
                        }
                        let allButton = [];
                        let buttonOperating = [];
                        // 子节点中包含 route.type 为 3|4 表明是权限
                        for(let i = 0 ; i < (route.children || []).length ; i ++){
                            // 判断有多少个 按钮
                            if(route.children[i].type >= 3){
                                allButton.push(route.children[i]);
                            }
                            // 判断有多少个 菜单那妞
                            if(route.children[i].type == 4){
                                buttonOperating.push(route.children[i]);
                            }
                        }
                        // 是否含有 按钮操作
                        if(allButton.length){
                            // 获取当前节点的权限并赋值父级
                            getRole(route);
                            // 判断当前节点下的 子节点是否全部是 按钮类型
                            if(allButton.length == route.children.length){
                                route.treeState = false;
                            }
                        }
                        // 有子集
                        if(route.children){
                            // 循环子集
                            route.children = RouterList(route.children)
                        }
                        // 没有子集是最后一级 或者类型为按钮菜单类型 获取 有按钮
                        if(!route.children || route.type == 4 || (allButton.length && allButton.length == route.children.length)){
                            let breadcrumbInner = [];
                            for(let i in breadcrumbBox){
                                if(i <= route.level - 1){
                                    breadcrumbInner.push(breadcrumbBox[i]);
                                }
                            }
                            breadcrumbList[breadcrumbInner[breadcrumbInner.length - 1].path] = breadcrumbInner;
                            if(!route.children) route.treeState = false;
                        }
                        return true
                    });
                    return accessedRouters
                }
                let accessedRouters = RouterList(asyncRouterMap)
                return {accessedRouters,breadcrumbList};
            },
            getMenu(isUpdate=undefined) {
                // 通过后台获取 路由
                if (!undefined) {//不加这个判断，路由会陷入死循环
                    RBACAPI.login.getMenu().then(async res => {
                        // 如果拿到的 路由的 长度不大于 0 那么有错误
                        if (!res.data || res.data.length <= 0) {
                            this.$router.replace({
                                path: '/login'
                            });
                            return false;
                        }
                        // 判断 当前跳转路由是否存在于面包屑的目录中
                        let {accessedRouters,breadcrumbList} = this.filterAsyncRouter(res.data);
                        this.routerList = (()=>{
                            this.$router.addRoutes(accessedRouters);
                            return accessedRouters
                        })();
                        if(isUpdate == 'update') {
                            return false;
                        }
                        this.$emit("isUpdateBreadcrumb", breadcrumbList);
                        // 获取对应路由的 path
                        let routeLine = (() => {
                            let redirected = this.$route.query.redirect;
                            if (redirected) {
                                if(redirected.indexOf('?') > -1 ) {
                                    return redirected.substr(0,redirected.indexOf('?'))
                                }
                                return redirected;
                            }
                            return '/';
                        })();
                        // 获得当前默认在的导航位置
                        this.active = routeLine;
                        if (!breadcrumbList.hasOwnProperty(routeLine)) {
                            this.$router.replace({
                                path: '/'
                            });
                            return false;
                        } else {
                            // 如果 redirect 不为空就跳转至当前的页面
                            if (this.$route.query.redirect) {
                                this.$router.replace({
                                    path: this.$route.query.redirect
                                });
                            }
                        }
                    }, rej => {
                        this.$router.replace({
                            path: '/login'
                        })
                    })
                }
            },
        },
        created() {
            // 获取左侧侧边栏
            this.getMenu();

        }
    }
};

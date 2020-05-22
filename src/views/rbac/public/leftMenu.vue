<template lang="pug">
    Col.left-menu-box( :span="3" :style="{backgroundColor:leftSkin.boxBackgroundColor||defaultSkin.boxBackgroundColor}")
        div( :class="' logo-img-box'")
            img( :src="appInfo.logoUrl" :alt="appInfo.appName")
        Menu( :default-active="active"
            :background-color="leftSkin.backgroundColor||defaultSkin.backgroundColor"
            :text-color="leftSkin.textColor||defaultSkin.textColor"
            :active-text-color="leftSkin.activeTextColor||defaultSkin.activeTextColor"
            :collapse-transition="leftSkin.collapseTransition||defaultSkin.collapseTransition"
            @open="handleopen"
            @close="handleclose"
            @select="handleselect"
            class="el-menu-vertical-demo left-menu none-scroll"
            unique-opened v-show="!collapsed")
            // 当前节点状态为 菜单显示 按钮不显示并没有子集
            template(v-for="(item,index) in routerList" v-if="!item.isButton")
                MenuItem(:index="item.path" style="min-width: auto" :key="index" v-if="!item.treeState")
                    i(:class="item.icon")
                    div {{ item.tagName }}
                Submenu( :index="item.path + index" v-else)
                    template(slot="title" )
                        i(:class="item.icon")
                        div {{item.tagName}}
                    template(v-for="(item1,index1) in item.children" v-if="!item1.isButton")
                        MenuItem(:index="item1.path" style="min-width: auto" :key="index1" v-if="!item1.treeState")
                            i(:class="item1.icon")
                            div {{ item1.tagName }}
                        Submenu( :index="item1.path + index1" v-else)
                            template(slot="title")
                                i(:class="item1.icon")
                                div {{item1.tagName}}
                            template(v-for="(item2,index2) in item1.children" v-if="!item2.isButton")
                                MenuItem(:index="item2.path" style="min-width: auto" :key="index2" v-if="!item2.treeState")
                                    i(:class="item2.icon")
                                    div {{ item2.tagName }}
                                Submenu( :index="item2.path + index2" v-else)
                                    template(slot="title")
                                        i(:class="item2.icon")
                                        div {{item2.tagName}}

</template>

<script lang="js">
    import {
        BreadcrumbItem,
        Breadcrumb,
        Dropdown,
        DropdownMenu,
        DropdownItem,
        Menu,
        MenuItem,
        Col,
        Submenu,
    } from "element-ui"
    import {leftSkin} from "@/config/project.config";
    import RBACAPI from "@/api/rbac/index"
    /*
    * 导入路由又两种方式
    * 1. 开发
    * file => require('@/views/' + file + '.vue').default;
    * 2. 生产
    * file => () => import('@/views/' + file + '.vue');
    * */
    // 导入一个 本地 / 生产 环境的引入 vue 的方法
    const _import = require('./importRoute/_import_' + process.env.NODE_ENV);
    // const _import = {
    //     development:file => require('@/views/' + file + '.vue').default,
    //     production:(() => import('@/views/' + file + '.vue'))(file),
    // };
    // console.log(_import[process.env.NODE_ENV]);
    export default {
        name: "leftMenu",
        components: {
            BreadcrumbItem,
            Breadcrumb,
            Dropdown,
            DropdownMenu,
            DropdownItem,
            Menu,
            MenuItem,
            Col,
            Submenu,
        },
        data() {
            return {
                active:'',
                theme2: 'light',
                collapsed: false,
                routerList: [],
                breadcrumb: [1, 2],
                leftSkin: leftSkin,
                appInfo: '',
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
                this.$emit('goView',path)
                // 保存每一次连接 等待下一次使用
                localStorage.setItem('currentUrl', path);
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
                        route.path = route.url;
                        route.tagName = route.name;
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
                        if(Object.keys(breadcrumbBox).length - 1 > route.level - 1) {
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
                        // 没有子集是最后一级 或者类型为按钮菜单类型
                        if(!route.children || route.type == 4){
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
            getMenu() {
                // 通过后台获取 路由
                if (!undefined) {//不加这个判断，路由会陷入死循环
                    RBACAPI.login.getMenu().then(async res => {
                        // 如果拿到的 路由的 长度不大于 0 那么有错误
                        if (!res.data || res.data.length <= 0) {
                            // this.$message.error('暂无分配权限');
                            this.$router.replace({
                                path: '/login'
                            });
                            return false;
                        }
                        // 判断 当前跳转路由是否存在于面包屑的目录中
                        let {accessedRouters,breadcrumbList} = this.filterAsyncRouter(res.data);
                        // 共享左侧树内容
                        this.$emit('isUpdateBreadcrumb',breadcrumbList)
                        this.routerList = (()=>{
                            let routeList = [];
                            // 过滤等级为 1 的路由
                            for(let i = 0 ; i < accessedRouters.length ; i ++){
                                if(accessedRouters[i].level){
                                    let child = accessedRouters[i].children;
                                    for(let j = 0 ; j < child.length ; j ++){
                                        routeList.push(child[j]);
                                    }
                                }
                            }
                            return routeList
                        })();
                        console.log(this.routerList);
                        // 获取对应路由的 path
                        let routeLine = (() => {
                            let redirected = localStorage.getItem('currentUrl');
                            if (redirected) {
                                // 触发 main.vue 更新视图
                                this.handleselect(redirected);
                                return localStorage.getItem('currentUrl');
                            }
                            return '/';
                        })();
                        this.active = routeLine;
                    }, rej => {
                    })
                }
            },
        },
        created() {
            // 获取左侧侧边栏
            this.getMenu();
            window.setBreadcrumb = function (text) {
                console.log(text);
            }
            this.appInfo = JSON.parse(localStorage.getItem('appInfo'))[0]
        }
    }
</script>

<style scoped>
    .left-menu {
        background-color: rgb(50, 65, 87);
        width: 100%;
        text-align: left;
        overflow-y: scroll;
        height: 100%;
        display: block;
    }

    .left-menu-box {
        min-height: 100%;
        padding-top: 60px;
        position: relative
    }

    .logo-img-box  img {
        position: absolute;
        top: 0;
        left: 0;
        width: 170px;
        height: 60px;
    }
</style>

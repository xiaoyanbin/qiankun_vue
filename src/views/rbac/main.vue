<template>
    <div class="full-screen" id="public-main">
        <el-row class="full-height">
            <LeftMenu @goView="goView" @isUpdateBreadcrumb="updateBreadcrumb" class="full-height left-menu-box"
                      ref="leftMenu"></LeftMenu>
            <div>{{alertSign.length > 0 ? 'zIndex' : ''}}</div>
            <HeadTop class="content-header" :breadcrumb="breadcrumb"></HeadTop>
            <el-col :span="24" :class="'none-scroll content-class ' + (alertSign.length > 0 ? 'zIndex' : '')">
                <div class="full-screen inner-class none-scroll" id="iframe-box">
                     <router-view v-if="$route.path != '/'" class="content-right"></router-view>
                    <iframe v-else-if="src" :src="src" ref="iframe" style="border: none" onload="loadIframe()"></iframe>
                    <h1 v-else class="welcome">{{welcomeText}}</h1>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {Row, Col} from "element-ui"
    import HeadTop from './public/headTop'
    import LeftMenu from './public/leftMenu'
    import {checkDomain} from "../../config/project.config";

    export default {
        components: {
            HeadTop,
            LeftMenu,
            ElRow: Row,
            ElCol: Col,
        },
        data() {
            return {
                theme2: 'light',
                collapsed: false,
                routerList: null,
                breadcrumb: {},
                Time: false,
                // iframe标签
                src:null,
                alertSign: [],
                splitKey:require('@/config/project.config').axiosConfig.headers.splitKey(),
                welcomeText: ''
            }
        },
        methods: {
            updateBreadcrumb(breadcrumb) {
                // 将 左侧 列表传回来的值 进行放置到 顶部面包屑中
                this.breadcrumb = breadcrumb;
            },
            goView(path) {
                console.log(this.breadcrumb);
                // 校验域名规格
                if(checkDomain(path).type){
                    this.$router.replace(path);
                    return false;
                }
                // 将当前节点重置为 更节点
                if(this.$route.path != '/'){
                    this.$router.replace('/');
                }
                this.src = null;
                if (this.src != path) {
                    // 如果本地存在开发者工具 只在 dev-sass.ambow.com 环境下生效 方便调试
                    if(localStorage.getItem('developerTools') && location.host.indexOf('dev-') > -1){
                        path = localStorage.getItem('developerTools');
                    }
                    // 校验域名规格
                    this.src = checkDomain(path);
                }
                // this.src = 'https://dev-sass-goods.ambow.com/#/product/cate/chooseClassType'
            },
            loadIframe() {
                // 保存携带权限一级的 内容
                let roleList = {};
                for (let i in this.breadcrumb) {
                    let nowRouter = this.breadcrumb[i][this.breadcrumb[i].length - 1];
                    // 保存当前应该存在的内容
                    roleList[i] = nowRouter;
                    if (nowRouter.role) {
                        roleList[i] = nowRouter.role
                    }
                }
                // 向子 iframe 发送信息 向对应的与下发消息
                this.sendChildrenMessage({
                    token: localStorage.getItem('token'),
                    userRole: JSON.stringify(roleList),
                    type: 'role',
                    appId: localStorage.getItem('appId'),
                    splitKey: this.splitKey,
                }, this.src)
            },
            updateLeftMenu(path){
                this.$refs.leftMenu.active = path;
            }
        },
        created() {
            // 开启父级遮罩层
            let alertSing = this.addMessageQueue('openAlert', (event,allEvent) => {
                this.alertSign.push(event.type)
            });
            // 关闭父级遮罩层
            let deleteAlertSing = this.addMessageQueue('deleteAlert', (event) => {
                if(this.alertSign.length > 0) this.alertSign.splice(this.alertSign.length - 1 , 1);
                console.log(event);
            });
            // 更新父级 左侧路由
            let routeListSing = this.addMessageQueue('changeParentRoute', (event) => {
                this.updateLeftMenu(event.route.url);
            });
            // 加载全局 loadIframe
            window.loadIframe = this.loadIframe;
            this.welcomeText = '欢迎登录' + JSON.parse(localStorage.getItem('appInfo'))[0].appName + '管理后台';
        }
    }
</script>
<style scoped>
    #iframe-box {
        padding-left: 10px;
    }
    .content-right {
        padding-left: 12.5%;
        padding-top: 60px;
    }
    iframe {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
    }

    .content-header {
        position: absolute;
        top: 0;
        z-index: 3;
    }

    .zIndex {
        z-index: 4;
    }

    .inner-class {
        width: 100%;
        height: 100%;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        overflow-y: scroll;
        position: absolute;
        top: 0;
        left: 0;
        position: relative;
    }

    .content-class {
        height: 100%;
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: 0;
    }

    .left-menu-box {
        z-index: 1;
    }
    .welcome {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
  }
</style>

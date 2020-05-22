<template lang="pug">
    div.common-header-box
        div.el-col.el-col-12.el-left(v-if="false")
            Breadcrumb(separator-class="el-icon-arrow-right" style="line-height: 60px;")
                BreadcrumbItem( :to="{ path: '/' }") 首页
                BreadcrumbItem(v-for="(item, index) in breadcrumb[$route.name]" :key="index" ) {{item.tagName}}
        div( class="el-col el-col-12 user-box" v-if="false")
        Dropdown.user-img.sass-user-box(@command="handleCommand")
            div.el-dropdown-link
                img.avator.fl(:src="baseImgPath")
                div.user-identity.fl 管理员
            DropdownMenu(slot="dropdown" class="public-dropdown-box")
                DropdownItem( command="signOut") 退出

</template>

<script>
    import {
        BreadcrumbItem, Breadcrumb, Message, Dropdown, DropdownMenu, DropdownItem,
    } from 'element-ui';
    import login from "../../../api/rbac/login";
    import {project} from "@/config/project.config";

    export default {
        name: 'headTop',
        components: {
            BreadcrumbItem,
            Breadcrumb,
            Dropdown,
            DropdownMenu,
            DropdownItem,
        },
        data() {
            return {
                platform: '',
                baseImgPath: "https://www.gravatar.com/avatar/d55b69132ed1924636076ec72fffdb1d?s=46&d=identicon",
            }
        },
        props: {
            breadcrumb: Object
        },
        methods: {
            personalCenter() {

            },
            signOut() {
                login.logout().finally(e=>{
                        Message({
                            type: 'success',
                            message: '退出成功'});
                        console.log(e);
                        localStorage.clear();
                        this.$router.replace('/login')
                })
            },
            handleCommand(command) {
                switch (command) {
                    case 'signOut':
                        this.signOut()
                        break;
                    case 'personalCenter':
                        this.personalCenter()
                        break;
                }
            },
        },
        mounted() {
        }
    }
</script>

<style lang="less" scoped>
    .sass-user-box {
        position: absolute;
        top: 3px;
        height: 39px !important;
    }
    .common-header-box {
        width: 100%;

    }

    .avator {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        margin-right: 10px;
    }

    .user-identity {
        display: inline-block;
        width: auto;
        height: 36px;
        line-height: 36px;
        vertical-align: top;
    }

    .el-dropdown-menu__item {
        text-align: center;
    }

    .user-img {
        display: inline-block;
        color: #606266;
        font-size: 14px;
        right: 0;
        height: 100%;
        padding: 7px 15px 0;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

    .user-box {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 100%;
    }
</style>
<style lang="less">
    .public-dropdown-box {
        right: 2px;
        width: 95px;

        .popper__arrow {
            left: 16% !important;
        }
    }
</style>

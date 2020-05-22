<template lang="pug">
    div#login-model.login_page.fillcontain
        transition( name="form-fade" mode="in-out")
            section.form_contianer
                div.manage_tip
                    p(v-if="init.isModel") {{sysName}}
                    p(v-else) {{sysName}}  管理系统
                Form(:model="loginForm" :rules="rules" ref="loginForm")
                    FormItem(prop="loginName")
                        Input(v-model="loginForm.loginName" placeholder="用户名" @keyup.enter.native="submitForm('loginForm')")
                    FormItem(prop="password")
                        Input(type="password" placeholder="密码" v-model="loginForm.password" @keyup.enter.native="submitForm('loginForm')")
                    div
                        Button(type="primary" @click="submitForm('loginForm')" class="submit_btn") 登录

</template>

<script lang="js">
    import {
        Form, FormItem, Input, Button, Loading, Message,
    } from 'element-ui';
    // 导入项目的 入口及基本的配置
    import {project,isValidIP} from "@/config/project.config"
    // 导入登陆 mixin 组件
    import {LoginMixins} from "../../mixins/rbac/login";
    // 导入 element-ui 组件
    // import  from 'element-ui'
    export default {
        name: 'login',
        mixins:[LoginMixins(project,isValidIP)],
        components: {
            Form,
            FormItem,
            Input,
            Button,
        },
    }
</script>

<style lang="less" scoped>
    #login-model.login_page {
        width: 100%;
        height: 100%;
        background-color: #324057;
        position: absolute;
        left: 0;
        top: 0;

        .manage_tip {
            position: absolute;
            width: 100%;
            top: -100px;
            left: 0;

            p {
                font-size: 34px;
                color: #fff;
            }
        }

        .form_contianer {
            width: 320px;
            height: auto;
            padding: 25px;
            border-radius: 5px;
            text-align: center;
            background-color: #fff;
            position: absolute;
            top: 50%;
            left: 50%;
            -webkit-transform: translate(-50%, -50%);
            -moz-transform: translate(-50%, -50%);
            -ms-transform: translate(-50%, -50%);
            -o-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);

            .submit_btn {
                width: 100%;
                font-size: 16px;
            }
        }

        .tip {
            font-size: 12px;
            color: red;
        }

        .form-fade-enter-active, .form-fade-leave-active {
            transition: all 1s;
        }

        .form-fade-enter, .form-fade-leave-active {
            transform: translate3d(0, -50px, 0);
            opacity: 0;
        }
    }

</style>

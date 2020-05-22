<template>
    <div class="contain">
        <el-button icon="el-icon-back" circle size="mini" @click="$router.go(-1)"></el-button>
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
            <el-form-item label="登录账号" prop="loginName">
                <el-input v-model.trim="form.loginName" class="innerStyle"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" class="innerStyle"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" class="innerStyle"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="tel">
                <el-input v-model="form.tel" class="innerStyle"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="form.state" placeholder="请选择">
                    <el-option :value="0" label="有效"></el-option>
                    <el-option :value="1" label="禁用"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="角色" prop="roleId">
                <el-select v-model="form.roleIds" :multiple="false" placeholder="请选择">
                    <el-option
                            v-for="item in roleList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">保存</el-button>
                <!--        <el-button>取消</el-button>-->
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {
        Button,
        Input,
        Select,
        Option,
        FormItem,
        Form,
        Message,
    } from 'element-ui';
    import RBACAPI from "@/api/rbac/index"
    // 导入维护的 account 的 mixin
    import {addAccountMixins} from "../../mixins/rbac/account";
    export default {
        name: "addAccount",
        components: {
            elButton: Button,
            elInput: Input,
            elSelect: Select,
            elOption: Option,
            elFormItem: FormItem,
            elForm: Form,
        },
        mixins:[addAccountMixins],
    }
</script>

<style scoped>
    .contain {
        width: 80%;
        margin: 20px 0 0 20px;
        text-align: left;
    }

    .innerStyle {
        width: 200px;
    }
</style>

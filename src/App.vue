<template lang="pug">
    div#app
        router-view
</template>

<script>
    import {OssUploadMixins} from "./mixins/ossUpload"
    import {Upload,Button} from "element-ui"

    export default {
        name: 'app',
        async created() {
            if(localStorage.getItem('appInfo')){
                 // 动态配置favicon
                let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
                link.type = 'image/x-icon';
                link.rel = 'shortcut icon';
                link.href = JSON.parse(localStorage.getItem('appInfo'))[0].browserIcon;
                document.getElementsByTagName('head')[0].appendChild(link);
                // 网页title
                document.title = JSON.parse(localStorage.getItem('appInfo'))[0].appName + '管理后台';
            }
            // 获取
            let hash = window.location.hash;
            console.log(hash);
            if(hash != '#/login'){
            //  不是登陆页面 并且 token 存在
                if(!hash.indexOf('/login') > -1 && localStorage.getItem('token')){
                    // 获取 # 后面的路径内容
                    if(hash.indexOf('?redirect') > -1){
                        this.$router.replace({path:'/',query:{redirect:hash.substr(1)}});
                        return false;
                    }
                    this.$router.replace({path:'/'});
                }else {
                    this.$router.replace({path:'/login'})
                }
            }
        }
    }
</script>

<style lang="less">
    @import "assets/common";

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
</style>

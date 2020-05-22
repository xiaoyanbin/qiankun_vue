import login from "../../api/rbac/login";
import {Message} from "element-ui";

/** rbac 左侧树的 公共 mixin 合集 */
export const headTopMixin = {
    data() {
        return {
            platform: '',
            baseImgPath: "https://www.gravatar.com/avatar/d55b69132ed1924636076ec72fffdb1d?s=46&d=identicon",
        }
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
};

import {Message,Loading} from "element-ui";
import request from "../../api/request"
/**
 * 公共的权限内容的 控制的请求
 * 通过路由来获取当前的页面操作者是否拥有 该 api 权限
 */
export const ElementsMixins = {
    data(){
        return {
            userRole:{},
        }
    },
    methods: {
        elements(elementsId,className=''){
            if(this.getUserRole().hasOwnProperty(elementsId)){
                return this.getUserRole()
            }
            if(className){
                return 'element-hide';
            }else {
                return false
            }

        },
        buttons(){},
        getUserRole(){
            return localStorage.getItem('userRole')
        }
    }
};

/** 是否是 ip 地址访问  */
export function isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]):(\d*)$/
    return reg.test(ip);
}
/** 请求 api 的判断  所有项目的通用*/
const getRequestAddress = ()=>{
    let host = location.host;
    let apiUrl = 'https://open-api.ambow.com/';
    // uat 环境
    if(host.indexOf('uat-') > -1){
        apiUrl = 'https://uat-open-api.ambow.com/';
    }
    // fix 环境
    if(host.indexOf('fix-') > -1){
        apiUrl = 'https://fix-open-api.ambow.com/';
    }
    // dev 环境  | 本地环境
    if(host.indexOf('dev-') > -1 || host.indexOf('localhost:') > -1 || isValidIP(host)){
        apiUrl = 'https://dev-open-api.ambow.com/';
    }
    // pre 环境
    if(host.indexOf('pre-') > -1){
        apiUrl = 'https://pre-open-api.ambow.com/';
    }
    return apiUrl;
};
/**
 * 判断 是域名还是 本地路由
 * */
export const checkDomain = (href)=>{
    if(href.indexOf('https://') > -1 || href.indexOf('http://') > -1){
        return href
    }
    return {href,type:'route-view'}
};
/**
 * axios
 *  url 请求地址
 *  timeout 过期时间
 *  filterStatus 请求过滤后台请求code
 *  passCode 正常通过 的 code 唯一的 (暂时不开启)
 *  errorCode 致命 并强制回到 login (暂时不开启)
 *  headers 自定义需要添加的请求头
 */
export const axiosConfig  = {
    requestAddress:getRequestAddress(),
    /* https://devapi.iqcspace.com/iotp*/
    timeOut:5000,
    filterStatus:[100,200],
    passCode:0,
    errorCode:-1,
    headers:{
        // saas的登录splitKey 只适用于saas平台
        splitKey:()=>{return '1233452345742423412'},
        appId:()=>{return localStorage.getItem('appId')},
        Authorization:()=>{return localStorage.getItem('token')},
    }
};

/** 相关的项目名称及平台信息 也可以拥有自定义配置 */
export const project  = {
    projectName:'',
    isModel: true,
    platform:4,
    spli:4,
    rbacPlatform:403
};
/** 配置 左侧菜单的颜色 及相关的选中的颜色 */
export const leftSkin = {
    backgroundColor:"rgba(70, 76, 91, 1)",
    textColor:"rgba(241, 241, 241, 1)",
    activeTextColor:"rgb(20, 92, 205)",
    collapseTransition:true,
    boxBackgroundColor:"rgba(255, 255, 255, 1)",
    itemClass:"public-left-item",
    logoImage:require('@/assets/logo.png'),
    logoAlt:'iotp',
    logoClass:'logo-img',
    modelName:'iot 模版'
};

/** 列表每一页做大请求数 */
export const page = {
    pageSize:10
};

/** ossConfig 配置内容 */
export const ossConfig = {
    baseURL: 'https://uat-open-api.ambow.com',
    fileHost: 'https://oss-cn-beijing.aliyuncs.com',
    timeout: 80000,
    pictureResources:'',
    videoResources:'',
};

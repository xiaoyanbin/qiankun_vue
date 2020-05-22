import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入 element 单独的 样式内容
import 'element-ui/lib/theme-chalk/index.css'
import './plugins/axios'
// 导入消息队列的 插件
import './plugins/postMessage'
// 导入 element 插件
import './plugins/element'
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

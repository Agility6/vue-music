import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入样式
import '@/common/stylus/index.styl'
// fastclick消除移动端浏览器上的点击事件的300ms 的延迟的作用
import fastclick from 'fastclick'

Vue.config.productionTip = false

fastclick.attach(document.body)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

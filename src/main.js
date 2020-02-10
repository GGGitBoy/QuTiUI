import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import VueValidator from 'vue-validator'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
// import Mock from './mock'
// Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'

Vue.use(VueValidator)
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

Vue.validator('latin', function (val) {
  return !val.match(/[^a-zA-Z0-9_]/)
})
Vue.validator('email', function (val) {
  let pattern = /^([\w-_]+(?:\.[\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/i
  return pattern.test(val)
})
Vue.filter('camelCaseToDash', function (value) {
  return value.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
})


const router = new VueRouter({
  routes
})

// router.beforeEach((to, from, next) => {
//   //NProgress.start();
//   let user = JSON.parse(localStorage.getItem('user'));
//   if(user){ //如果有就直接到首页咯
//       next();
//   } else {
//       if(to.path=='/login'){ //如果是登录页面路径，就直接next()
//           next();
          
//       } else { //不然就跳转到登录；
//           next('/login');
//       }
//   }
// })

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')


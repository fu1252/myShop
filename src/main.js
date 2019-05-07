import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

import MyPlugin from './minxins/index'
Vue.use(MyPlugin)

import store from './store/index'
Vue.prototype.$store=store


const app = new Vue(App)
app.$mount()

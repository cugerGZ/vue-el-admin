import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import './plugins/element.js'
import router from "./router.js"
import store from "./store"

import {
    Message,
} from 'element-ui'

let loading = null
let requestCount = 0

function showLoading() {
    if (requestCount === 0) {
        loading = Message({
            message: '加载中...',
            duration: 0
        })
    }
    requestCount++
}

function hideLoading() {
    if (requestCount > 0) {
        requestCount--
    }
    if (loading && requestCount === 0) {
        loading.close()
    }
}
// 添加全局自定义指令
Vue.directive('auth', {
    inserted(el, binding) {
        let user = window.sessionStorage.getItem('user')
        user = user ? JSON.parse(user) : {}
        if (!user.super) {
            let rules = user.ruleNames ? user.ruleNames : []
            let v = rules.find(item => item === binding.value)
            if (!v) {
                el.remove()
            }
        }
    }
})

// 添加请求拦截器
axios.interceptors.request.use((config) => {
    // 添加header头的token
    let token = window.sessionStorage.getItem('token')
    if (config.token === true) {
        config.headers['token'] = token
    }
    if (config.loading === true) {
        showLoading()
    }
    // 在发送请求之前做些什么
    return config;
}, (error) => {
    hideLoading()
        // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use((response) => {
    hideLoading()
        // 对响应数据做点什么
    return response;
}, (err) => {
    // 全局错误提示
    if (err.response && err.response.data && err.response.data.errorCode) {
        Message.error(err.response.data.msg)
    }
    hideLoading()
        // 对响应错误做点什么
    return Promise.reject(err);
});

// 引入拖拽排序
import VueDND from 'awe-dnd'
Vue.use(VueDND)

// 引入全局配置文件
import $conf from "./common/config/config.js"
Vue.prototype.$conf = $conf

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
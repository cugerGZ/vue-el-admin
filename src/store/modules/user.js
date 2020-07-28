export default {
    state: {
        user: {},
        token: false
    },
    getters: {

    },
    mutations: {
        //登录
        login(state, user) {
            // 保存登录状态
            state.user = user
            state.token = user.token
                //保存到本地
            window.sessionStorage.setItem('user', JSON.stringify(state.user))
            window.sessionStorage.setItem('token', state.token)
        },
        // 用户初始化
        initUser(state) {
            let user = window.sessionStorage.getItem('user')
            if (user) {
                state.user = JSON.parse(user)
                state.token = state.user.token
            }
        },
        //退出
        logout(state) {
            state.user = {}
            state.token = false
            window.sessionStorage.clear()
        }
    },
    actions: {

    }
}
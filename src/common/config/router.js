let routes = [{
        path: '/',
        name: 'layout',
        redirect: { name: 'index' },
        component: 'layout',
        children: [{
                meta: { title: '后台首页' },
                component: 'index/index'
            },
            {
                meta: { title: '商品列表' },
                component: 'shop/goods/list'
            },
            {
                meta: { title: '创建商品' },
                component: 'shop/goods/create'
            },
            {
                meta: { title: '相册管理' },
                component: 'image/index'
            },
            {
                meta: { title: '分类管理' },
                component: 'shop/category/list'
            },
            {
                meta: { title: '商品规格' },
                component: 'shop/sku/list'
            },
            {
                meta: { title: '商品类型' },
                component: 'shop/type/list'
            }

        ]
    },
    {
        meta: { title: '登录页' },
        component: 'login/index'
    },
    {
        path: '*',
        redirect: { name: 'index' },
    }
]

// 获取路由信息的方法
let getRoutes = function() {
    createRoute(routes)
    return routes
}

// 自动生成路由
function createRoute(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (!arr[i].component) return
            // 去除index
        let val = getValue(arr[i].component)
        arr[i].name = arr[i].name || val.replace(/\//g, '_')
        arr[i].path = arr[i].path || `/${val}`
            // 自动生成component
        let componentFun =
            import (`../../views/${arr[i].component}.vue`)
        arr[i].component = () => componentFun
        if (arr[i].children && arr[i].children.length > 0) {
            createRoute(arr[i].children)
        }
    }
}

function getValue(str) {
    let index = str.lastIndexOf('/')
    let val = str.substring(index + 1, str.length)
    if (val === 'index') {
        return str.substring(index, -1)
    }
    return str
}

export default getRoutes()
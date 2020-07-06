let routes = [
  {
    // path: '/',
    // name: 'layout',
    // component: () => import('../../views/layout.vue'),
    component: 'layout',
    redirect: {name: 'index'},
    children:[
      {
        // path: '/index',
        // name: 'index',
        // component: () => import('../../views/index/index.vue')
        component: 'index/index'
      },
      {
        component: 'shop/goods/list'
      }
    ]
  },
  {
    // path: '/login',
    // name: 'login',
    // component: () => import('../../views/login/index.vue')
    component: ('login/index')

  },
  {
    path:'*',
    redirect: {name: 'index'}
  }
]

// 获取路由信息的方法
let getRoutes = function(){
  createRoute(routes)
  return routes
}

// 自动生成路由
function createRoute(arr){
  for(let i=0;i<arr.length;i++){
    if(!arr[i].component) return
    // 去除index
    let val = getValue(arr[i].component)
    arr[i].name = arr[i].name || val.replace(/\//g, '_')
    arr[i].path = arr[i].path || `/${val}`
    // 自动生成component
    let componentFun  = import(`../../views/${arr[i].component}.vue`)
    arr[i].component = () => componentFun
    if(arr[i].children&&arr[i].children.length>0){
      createRoute(arr[i].children)
    }
  }
}
function getValue(str){
  let index = str.lastIndexOf('/')
  let val = str.substring(index+1,str.length)
  if(val === 'index'){
    return str.substring(index,-1)
  }
  return str
}

export default getRoutes()


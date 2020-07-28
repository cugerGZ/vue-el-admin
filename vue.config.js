module.exports = {
    lintOnSave: false,
    devServer: {
        host: "localhost",
        port: 8080, // 端口号
        https: false, // https:{type:Boolean}
        open: true, //配置自动启动浏览器
        proxy: {
            '/admin': { //代理api
                target: 'http://ceshi3.dishait.cn/admin', //服务器api地址
                ws: true, // proxy websockets
                changeOrigin: true, //是否跨域
                pathRewrite: { //重写路径
                    '^/admin': ''
                }
            }
        }
    }
}
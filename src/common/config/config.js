export default {
    logo: 'UNI-ADMIN',
    navBar: {
        active: '0',
        list: [{
                name: "首页",
                subActive: '0',
                submenu: [{
                        icon: "el-icon-s-home",
                        name: "后台首页",
                        pathname: "index"
                    },
                    {
                        icon: "el-icon-picture",
                        name: "相册管理",
                        pathname: "image"
                    },
                    {
                        icon: "el-icon-s-claim",
                        name: "商品列表",
                        pathname: "shop_goods_list"
                    }
                ]
            },
            {
                name: "商品",
                subActive: '0',
                submenu: [{
                        icon: "el-icon-s-claim",
                        name: "商品列表",
                        pathname: "shop_goods_list"
                    },
                    {
                        icon: "el-icon-s-help",
                        name: "分类管理",
                        pathname: "shop_category_list"
                    },
                    {
                        icon: "el-icon-s-finance",
                        name: "商品规格",
                        pathname: "shop_sku_list"
                    },
                    {
                        icon: "el-icon-menu",
                        name: "商品类型",
                        pathname: "shop_type_list"
                    },
                    {
                        icon: "el-icon-chat-line-square",
                        name: "商品评论",
                        pathname: "shop_comment_list"
                    }
                ]
            },
            {
                name: "订单",
                subActive: '0',
                submenu: [{
                    icon: "el-icon-suitcase",
                    name: "订单管理",
                    pathname: "order_order_list"
                }, {
                    icon: "el-icon-tickets",
                    name: "发票管理",
                    pathname: "order_invoice_list"
                }, {
                    icon: "el-icon-sell",
                    name: "售后服务",
                    pathname: "order_after-sale_list"
                }]
            },
            {
                name: "会员"
            },
            {
                name: "设置"
            },
        ]
    }
}
export default {
  state:{
    skus_type:0, //选中规格：0单规格，1多规格
    title: "",   // 商品名称
    category: [], // 商品分类
    desc:"",  // 商品描述
    unit:"",  // 商品单位
    stock:0, //  总库存
    min_stock:0,  //  库存预警
    display_stock:1,  // 库存显示：0隐藏，1显示
    status:0,  //  是否上架：0仓库，1上架
    express:"",  // 运费模板

    oprice:0,  // 市场价格
    pprice:0,  // 销售价格
    cprice:0,  // 成本价格
    weight:0,  // 重量
    volume:0,  // 体积
  },
  getters:{

  },
  mutations:{
    vModelState(state, {key, value}){
      state[key] = value
    }
  },
  actions:{

  }
}
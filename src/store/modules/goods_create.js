import $Util from '@/common/util.js';
export default {
    state: {
        skus_type: 0,
        title: "", // 商品名称
        category: [],
        desc: "",
        unit: "",
        stock: 0,
        min_stock: 0,
        display_stock: 0,
        status: 0,
        express: "",

        banners: [], // 商品大图

        oprice: 0, // 市场价格
        pprice: 0, // 销售价格
        cprice: 0, // 成本价格
        weight: 0, // 重量
        volume: 0, // 体积
        // 规格卡片
        sku_card: [],
        // 商品类型
        goods_type_id: "",
        // 商品属性
        goods_attrs: {
            phone_model: ""
        },
        // 折扣
        discount: 0,
        // 表头
        ths: [
            { name: "商品规格", rowspan: 1, colspan: 1, width: "" },
            { name: "sku图片", rowspan: 2, width: "60" },
            { name: "销售价", rowspan: 2, width: "100" },
            { name: "市场价", rowspan: 2, width: "100" },
            { name: "成本价", rowspan: 2, width: "100" },
            { name: "库存", rowspan: 2, width: "100" },
            { name: "体积", rowspan: 2, width: "100" },
            { name: "重量", rowspan: 2, width: "100" },
            { name: "编码", rowspan: 2, width: "100" },
        ],
    },
    getters: {
        skuLabels(state) {
            return state.sku_card.filter(v => {
                return v.list.length > 0
            })
        },
        // 获取表头
        tableThs(state, getters) {
            let length = getters.skuLabels.length
            state.ths[0].colspan = length
            state.ths[0].rowspan = length > 0 ? 1 : 2
            return state.ths
        },
        // 获取规格表格数据
        tableData(state) {
            // 当前是否有规格卡片
            if (state.sku_card.length === 0) {
                return [];
            }
            let sku_list = []
            for (var i = 0; i < state.sku_card.length; i++) {
                if (state.sku_card[i].list.length > 0) {
                    sku_list.push(state.sku_card[i].list)
                }
            }
            if (sku_list.length === 0) {
                return []
            }
            let arr = $Util.cartesianProductOf(...sku_list)
            return arr.map(v => {
                let obj = {
                    skus: [],
                    image: "", // sku图片
                    pprice: 0, // 销售价格
                    oprice: 0, // 市场价格
                    cprice: 0, // 成本价格
                    stock: 0,
                    volume: 0,
                    weight: 0,
                    code: ''
                }
                obj.skus = v
                return obj
            })
        }
    },
    mutations: {
        // 修改state
        vModelState(state, { key, value }) {
            state[key] = value
        },
        // 增加规格卡片
        addSkuCard(state, data) {
            state.sku_card.push(data)
        },
        // 删除规格卡片
        delSkuCard(state, index) {
            state.sku_card.splice(index, 1)
        },
        // 修改规格卡片
        vModelSkuCard(state, { key, index, value }) {
            state.sku_card[index][key] = value
        },
        // 规格卡片排序
        sortSkuCard(state, { action, index }) {
            // 上移
            $Util[action](state.sku_card, index)
        },
        // 增加指定规格卡片的规格属性
        addSkuValue(state, { index, data }) {
            state.sku_card[index].list.push(data)
        },
        // 删除指定规格卡片的规格属性
        delSkuValue(state, { cardIndex, valueIndex }) {
            state.sku_card[cardIndex].list.splice(valueIndex, 1)
        },
        // 修改指定规格卡片的规格属性
        updateSkuValue(state, { cardIndex, valueIndex, key, value }) {
            state.sku_card[cardIndex].list[valueIndex][key] = value
        },
        // 排序规格卡片的规格属性列表
        sortSkuValue(state, { index, value }) {
            state.sku_card[index].list = value
        },
        // 修改商品属性
        vModelGoodsAttrs(state, { key, value }) {
            state.goods_attrs[key] = value
        },
    },
    actions: {

    }
}
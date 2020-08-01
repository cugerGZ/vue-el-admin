<template>
  <div class="bg-white px-3 py-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
    <router-link :to="{name:'shop_goods_list'}" style="position:absolute; top:13px; left:180px">
      <el-button size="mini">返回商品列表</el-button>
    </router-link>
    <el-form ref="form" label-width="80px">
      <el-form-item label="商品类型">
        <el-select placeholder="请选择商品类型" v-model="goods_type_id" @change="change">
          <el-option :label="item.name" :value="item.id" v-for="(item, index) in typeOptions" :key="index"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-card class="box-card">
      <div class="clearfix" slot="header">
        <span>商品属性</span>
      </div>
      <el-form ref="form" label-width="80px">
        <el-form-item :label="item.name" v-for="(item, index) in goods_type_values" :key="index">
          <el-input style="width:300px" v-model="item.value" v-if="item.type === 'input'"></el-input>
          <el-radio-group v-model="item.value" v-else-if="item.type === 'radio'">
            <el-radio :label="item2 " v-for="(item2, index2) in item.default" :key="index2">{{item2}}</el-radio>
          </el-radio-group>
          <el-checkbox-group v-model="item.value" v-else-if="item.type === 'checkbox'">
            <el-checkbox :label="item3" v-for="(item3, index3) in item.default" :key="index3"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="d-flex">
      <el-button type="primary" class="ml-auto mr-3 mt-3" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>
export default {
  inject:['app','layout'],
  data(){
    return {
      goods_type_id:"",
      typeOptions:[],
      id:0,
      goods_type_values:[]
    } 
  },
  created(){
    this.id = this.$route.params.id
    if(!this.id){
      this.$message({
        type:"error",
        message: "非法参数"
      })
      return this.$router.push({
        name:'shop_goods_list'
      })
    }
    // 获取商品属性
    this.layout.showLoading()
    this.axios.get('/admin/goods/read/'+this.id,{
      token:true
    }).then((res) => {
      let data =res.data.data
      this.typeOptions = data.types
      this.goods_type_values = data.goodsAttrs.map( item =>{
        if(item.type !== 'input') {
          item.default = item.default.split(',')
        }
        return item
      })
      this.layout.hideLoading()
    }).catch(() =>{
      this.layout.hideLoading()
    })
  },
  methods:{
    change(id){
      let index = this.typeOptions.findIndex(item => item.id === id)
      if(index === -1){
        return this.goods_type_values = []
      }
      let options = this.typeOptions[index].goods_type_values
      this.goods_type_values = options.map(item => {
        let defaultValue = []
        if(item.type !== 'input'){
          defaultValue = item.default ? item.default.split(',') :[]
        }
        return {
          goods_id: this.id,
          name:item.name,
          default:defaultValue,
          type:item.type,
          value:""
        }
      })
    },
    // 提交
    submit(){
      this.layout.showLoading()
      this.axios.post('/admin/goods/attrs/'+this.id,{
        goods_attrs:this.goods_type_values.map(item => {
          if(item.type !== 'input'){
            item.default = item.default.join(',')
          }
          return item
        })
      },{
        token: true
      }).then(() => {
        this.$message({
            message: '提交成功',
            type: 'success'
        });
        this.layout.hideLoading()
        this.$router.push({
          name:'shop_goods_list'
        })
      }).catch(() => {
        this.layout.hideLoading()
      })
    }
  }
}
</script>
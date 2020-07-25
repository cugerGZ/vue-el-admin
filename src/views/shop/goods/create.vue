<template>
  <div class="bg-white px-3 good_create" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
    <router-link :to="{name:'shop_goods_list'}" style="position:absolute; top:13px; left:180px">
      <el-button size="mini">返回商品列表</el-button>
    </router-link>
    <el-tabs v-model="tabIndex" @tab-click="handleClick">
      <!-- 基础设置 -->
      <el-tab-pane label="基础设置">
          <base-create></base-create>
      </el-tab-pane>
      <!-- 商品规格 -->
      <el-tab-pane label="商品规格">
        <el-form label-width="80px">
          <el-form-item label="商品规格">
            <el-radio-group :value="skus_type" size="medium" @input="vModel('skus_type', $event )">
              <el-radio-button :label="0" border>单规格</el-radio-button>
              <el-radio-button :label="1" border>多规格</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <!-- 单规格 -->
        <template v-if="skus_type===0">
          <single-attrs></single-attrs>
        </template>
        <!-- 多规格 -->
        <template v-if="skus_type===1">
          <el-form ref="form" label-width="80px">
            <el-form-item label="添加规格">
              <sku-card v-for="(item,index) in sku_card" :key="index" :item="item" :index="index" :total="skuCardTotal"></sku-card>
              <el-button size="mini" type="success" @click="addSkuCard">添加规格</el-button>
            </el-form-item>
          </el-form>
          <el-form ref="form" label-width="80px">
            <el-form-item label="批量设置">
              <template v-if="!updataAllStatus">
                <el-button type="text" v-for="(btn, index) in updateList" :key="index" @click="openUpdataAllStatus(btn)">{{btn.name}}</el-button>
              </template>

              <!-- 批量修改输入框 -->
              <div class="d-flex align-items-center" v-else>
                <el-input size="samll" style="width:150px" class="mr-2" type="number" :placeholder="updataAllplaceholder" v-model="updataAllValue"></el-input>
                <el-button type="primary" size="small" @click="updataAllSubmit">设置</el-button>
                <el-button size="small" @click="colseUpdataAllStatus">取消</el-button>
              </div>

            </el-form-item>
            <el-form-item label="规格设置">
              <sku-table ref="table"></sku-table>
            </el-form-item>
          </el-form>
        </template>
      </el-tab-pane>
      <!-- 商品属性 -->
      <el-tab-pane label="商品属性">
        <el-form ref="form" label-width="80px">
          <el-form-item label="商品类型">
            <el-select placeholder="请选择商品类型" :value="goods_type_id" @change="vModel('goods_type_id', $event)">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-card class="box-card">
          <div class="clearfix" slot="header">
            <span>商品属性</span>
          </div>
          <el-form ref="form" label-width="80px">
            <el-form-item label="手机型号">
              <el-input style="width:300px" :value="goods_attrs.phone_model" placeholder="请输入手机型号" @input="vModelGoodsAttrs({key:'phone_model', value:$event})"></el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      <!-- 媒体设置 -->
      <el-tab-pane label="媒体设置">
        <el-form label-width="80px">
          <el-form-item label="商品图片">
            <div class="d-flex flex-wrap">
              <div style="width:150px;height:150px; cursor:pointer; position: relative" class="border rounded d-flex align-items-center justify-content-center mr-3 mb-3" @click="chooseImage(index)" v-for="(item, index) in banners" :key="index">
                <img :src="item.url" style="width:100%;height:100%" v-if="item.url">
                <i class="el-icon-plus text-black-50" style="font-size:30px" v-else></i>
                <i class="el-icon-delete p-2 text-white" style="position: absolute; top:0;right:0; background-color:rgba(0,0,0,0.4)" @click.stop="deleteImage(index)"></i>
              </div>
              <div style="width:150px;height:150px; cursor:pointer" class="border rounded d-flex align-items-center justify-content-center mr-3 mb-3" @click="chooseImage(-1)" v-if="banners.length < 9">
                <i class="el-icon-plus text-black-50" style="font-size:30px"></i>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <!-- 商品详情 -->
      <el-tab-pane label="商品详情">
        <!-- 富文本编辑器 -->
        <tinymce ref="editor" v-model="msg" @onClick="onClick"/>
      </el-tab-pane>
      <!-- 折扣设置 -->
      <el-tab-pane label="折扣设置">
        <el-form ref="form" label-width="80px">
          <el-form-item label="会员价">
            <el-input style="width:300px" :value="discount" @input="vModel('discount', $event)">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>

        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import baseCreate from '../../../components/shop/create/base-create.vue'
import singleAttrs from '../../../components/shop/create/single-attrs.vue'
import skuCard from '../../../components/shop/create/sku/sku-card.vue'
import skuTable from '../../../components/shop/create/sku/sku-table'
import tinymce from '../../../components/common/tinymce'
export default {
  inject:['app'],
  data(){
    return {
      tabIndex: 0,
      msg: 'Welcome to Use Tinymce Editor',
      updataAllStatus: false, //批量修改
      updataAllplaceholder: "",  // 批量设置的
      updataAllValue:"",   // 批量设置的值
      updateList:[{
          name:"销售价",
          key:'pprice'
				},{
          name:"市场价",
          key:'oprice'
				},{
          name:"成本价",
          key:'cprice'
				},{
          name:"库存",
          key:'stock'
				},{
          name:"体积",
          key:'volumn'
				},{
          name:"重量",
          key:'weight'
				}],
    } 
  },
  components:{
    baseCreate,
    singleAttrs,
    skuCard,
    skuTable,
    tinymce
  },
  computed:{
    ...mapState({
      skus_type:state => state.goods_create.skus_type,
      sku_card:state=>state.goods_create.sku_card,
      banners: state=>state.goods_create.banners,
      goods_type_id: state => state.goods_create.goods_type_id,
      goods_attrs: state =>state.goods_create.goods_attrs,
      discount: state => state.goods_create.discount
    }),
    skuCardTotal(){
      return this.sku_card.length
    }
  },
  methods:{
    ...mapMutations(['vModelState','addSkuCard','vModelGoodsAttrs']),
    // 修改表单的值
    vModel(key, value){
      this.vModelState({key, value})
    },
    handleClick(){

    },
    // 鼠标单击的事件
    onClick (e, editor) {
        console.log('Element clicked')
        console.log(e)
        console.log(editor)
    },
    // 修改批量设置的状态
    openUpdataAllStatus(item){
      this.updataAllStatus = item.key
      this.updataAllplaceholder = '请输入'+item.name
    },
    // 取消批量设置状态
    colseUpdataAllStatus(){
      this.updataAllStatus = false
      this.updataAllValue = ""
    },
    // 提交批量设置数据
    updataAllSubmit(){
      this.$refs.table.list.forEach(item => {
        item[this.updataAllStatus] = this.updataAllValue
      })
      this.colseUpdataAllStatus()
    },
    // 选择商品图片
    chooseImage(index){
      const max = 9
      let count = max - this.banners.length
      this.app.chooseImage((res) => {
        let list = []
        if(index === -1){
          list = [...this.banners,...res]
        }else{
          list = [...this.banners]
          list[index] = res[0]
        }
        this.vModel('banners', list)
      },index === -1 ? count : 1)
    },
    // 删除商品图片
    deleteImage(index){
      this.$confirm('是否删除该图片?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let list = [...this.banners]
        list.splice(index,1)
        this.vModel('banners', list)
      })
    }
  }
}
</script>

<style>
  .good_create .el-form-item{
    margin-bottom: 15px;
  }
</style>
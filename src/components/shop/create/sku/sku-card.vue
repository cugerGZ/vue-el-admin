<template>
  <div class="card mb-3" style="line-height:1.2">
    <div class="card-header d-flex align-items-center" >
      规格项：
      <el-input size="mini" style="width:200px" :value="item.name" @input="vModel('name', index, $event)">
        <el-button slot="append" icon="el-icon-more" @click="chooseSkus"></el-button>
      </el-input>
      <el-radio-group size="mini" style="margin-bottom:-10px" class="ml-2" :value="item.type"  @input="vModel('type',index,$event)">
        <el-radio :label="0">无</el-radio>
        <el-radio :label="1">颜色</el-radio>
        <el-radio :label="2">图片</el-radio>
      </el-radio-group>
      <el-button icon="el-icon-top" size="mini" class="ml-auto" @click="sortCard('moveUp',index)" :disabled="index === 0"></el-button>
      <el-button icon="el-icon-bottom" size="mini" @click="sortCard('moveDown',index)" :disabled="total === (index+1)"></el-button>
      <el-button size="mini" type="text" @click="delSkuCard(index)">删除</el-button>
    </div>
    <div class="card-body">
      <div class="d-flex align-items-center flex-wrap">
        <sku-card-children :type="item.type" v-for="(item2,index2) in list" :key="index2" :item="item2" :index="index2" :cardIndex="index" v-dragging="{item:item2, list:list, group:`skuItem${index}`}"></sku-card-children>
      </div>
      <div class="mt-2">
        <el-button size="mini" type="text" icon="el-icon-plus" @click="addSkuValue(index)">增加规格值</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
import skuCardChildren from './sku-card-children.vue'
export default {
  inject:['app'],
  data(){
    return {
      list: this.item.list
    }
  },
  components:{
    skuCardChildren
  },
  props:{
    item:Object,
    index:Number,
    total:Number
  },
  methods:{
    ...mapMutations(['delSkuCard','vModelSkuCard','sortSkuCard','addSkuValue','sortSkuValue']),
    vModel(key,index,value){
      this.vModelSkuCard({key,index,value})
    },
    // 排序规格卡片
    sortCard(action,index){
      this.sortSkuCard({action,index})
    },
    // 选择规格
    chooseSkus(){
      this.app.chooseSkus((res) => {
        this.vModel('name',this.index,res.name)
        this.vModel('type',this.index,res.type)
        this.vModel('list',this.index,res.list)
        this.list = res.list
      })
    }
  },
  mounted(){
    // 监听list的改变，如果发生变化就赋值给list（解决了交换卡片时，规格值不交换的情况）
    this.$watch('item.list', (newValue) => {
      this.list = newValue
    })
    // 监听拖拽排序结束
    this.$dragging.$on('dragend', (e) => {
      if(e.group === 'skuItem'+ this.index){
        this.sortSkuValue({
          index: this.index,
          value: this.list
        })
      }
    })
  }
}
</script>
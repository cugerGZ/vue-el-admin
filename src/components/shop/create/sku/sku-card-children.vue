<template>
  <div>
    <div class="d-flex align-items-center flex-wrap">
      <div class="border py-1 px-2 rounded mr-2 position-relative d-flex align-items-center">
        <div v-if="type !== 0">
          <!-- 颜色选择 -->
          <el-color-picker size="mini" v-if="type === 1"></el-color-picker>
          <!-- 图片选择 -->
          <template v-else>
            <span class="btn btn-light" @click="chooseImage" v-if="!item.image">
              <i class="el-icon-plus"></i>
            </span>
            <img :src="item.image" v-else style="width:40px;height:40px;cursor:pointer" class="rounded" @click="chooseImage">
          </template>
        </div>
        <input type="text" :value="item.name" @input="inputChange" class="form-control text-center border-0" style="width:80px;font-size:13px">
        <span class="btn btn-light p-0 position-absolute" style="line-height:1;right:-10px;top:-10px" @click="delSkuValue({cardIndex: cardIndex, valueIndex:index})"><i class="el-icon-circle-close"></i></span>
      </div>
    </div>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
export default {
  // 接收依赖注入
  inject:['app'],
  props:{
    type:{
      type:Number,
      default:0
    },
    item:Object,
    index:Number,
    cardIndex:Number
  },
  methods:{
    ...mapMutations(['delSkuValue','updateSkuValue']),
    inputChange(e){
      this.vModel('name',e.target.value)
    },
    vModel(key,value){
      this.updateSkuValue({
        cardIndex: this.cardIndex,
        valueIndex: this.index,
        key,
        value
      })
    },
    chooseImage(){
      this.app.chooseImage((res) => {
        this.vModel('image',res[0].url)
      },1)
    }
  }
}
</script>
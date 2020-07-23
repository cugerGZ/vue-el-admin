<template>
  <div>
    <div class="d-flex align-items-center flex-wrap">
      <div class="border py-1 px-2 rounded mr-2 position-relative d-flex align-items-center">
        <div v-if="type !== 0">
          <el-color-picker size="mini" v-if="type === 1"></el-color-picker>
          <span class="btn btn-light" v-else>
            <i class="el-icon-plus"></i>
          </span>
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
    }
  }
}
</script>
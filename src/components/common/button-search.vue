<template>
  <div>
    <div class="d-flex align-items-cneter">
      <slot name="left"></slot>
      <div class="ml-auto" v-show="!superSearch">
        <slot name="right">
          <el-input v-model="keyword" :placeholder="placeholder" size="mini" style="width:150px" class="mr-2"></el-input>
          <el-button size="mini" type="info" @click="$emit('search', keyword)">搜索</el-button>
          <el-button size="mini" @click="superSearch = true">高级搜索</el-button>
        </slot>
      </div>
    </div>
    <el-card class="box-card bg-light my-3" v-show="superSearch">
      <div class="clearfix" slot="header" style="margin:-10px">
        <span>高级搜索</span>
        <el-button style="float:right;padding:3px 0;" type="text"  @click="closeSuperSearch">收起</el-button>
      </div>
      <slot name="form"></slot>
    </el-card>
  </div>
</template>

<script>
export default {
  props:{
    placeholder:{
      type:String,
      default:""
    }
  },
  data(){
    return {
      keyword:'',
      superSearch: false
    }
  },
  methods:{
    closeSuperSearch(){
      this.superSearch = false
    }
  }
}
</script>
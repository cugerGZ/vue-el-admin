<template>
  <div class="bg-white px-3 py-3 good_create" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
    <router-link :to="{name:'shop_goods_list'}" style="position:absolute; top:13px; left:180px">
      <el-button size="mini">返回商品列表</el-button>
    </router-link>
    
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
      banners:[],
      id:0
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
    // 获取媒体详情
    this.layout.showLoading()
    this.axios.get('/admin/goods/read/'+this.id,{
      token:true
    }).then((res) => {
      let data =res.data.data
      this.banners = data.goodsBanner
      this.layout.hideLoading()
    }).catch(() =>{
      this.layout.hideLoading()
    })
  },
  methods:{
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
        this.banners = list
      },index === -1 ? count : 1)
    },
    // 删除商品图片
    deleteImage(index){
      this.$confirm('是否删除该图片?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.banners.splice(index,1)
      })
    },
    // 提交
    submit(){
      this.layout.showLoading()
      this.axios.post('/admin/goods/banners/'+this.id,{
        banners:this.banners.map(item => item.url)
      },{
        token:true
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

<style>
  .good_create .el-form-item{
    margin-bottom: 15px;
  }
</style>
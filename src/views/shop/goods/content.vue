<template>
  <div class="bg-white px-3 py-3 good_create" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
    <router-link :to="{name:'shop_goods_list'}" style="position:absolute; top:13px; left:180px">
      <el-button size="mini">返回商品列表</el-button>
    </router-link>
    <!-- 富文本编辑器 -->
    <div>
      <tinymce ref="editor" v-model="content" toolbar = "undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists  table | removeformat | imageUpload"/>
    </div>

    <div class="d-flex">
      <el-button type="primary" class="ml-auto mr-3 mt-3" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>
import tinymce from '../../../components/common/tinymce'
export default {
  inject:['app','layout'],
  data(){
    return {     
      content: "",
      id:0
    } 
  },
  components:{
    tinymce
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
    // 获取商品详情
    this.layout.showLoading()
    this.axios.get('/admin/goods/read/'+this.id,{
      token:true
    }).then((res) => {
      let data =res.data.data
      this.content = data.content
      this.layout.hideLoading()
    }).catch(() =>{
      this.layout.hideLoading()
    })
  },
  methods:{
    // 提交数据
    submit(){
      this.layout.showLoading()
      this.axios.post('/admin/goods/'+this.id,{
        content:this.content
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
      }).catch(() =>{
        this.layout.hideLoading()
      })
    }
  }
}
</script>
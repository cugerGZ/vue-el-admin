<template>
    <!-- 图片弹窗 -->
    <el-dialog title="图片管理" :visible.sync="imageModal" width="80%" top="6vh">
      <el-container style="height:70vh; position:relative;margin:-30px -20px">
        <el-header class="d-flex align-items-center border-bottom">
          <div class="d-flex mr-auto" >
            <el-select placeholder="请选择图片排序方式" size="mini" style="width:150px" class="mr-2" v-model="searchForm.order">
              <el-option label="降序" value="desc"></el-option>
              <el-option label="升序" value="asc"></el-option>
            </el-select>
            <el-input size="mini" style="width:250px" class="mr-2" placeholder="输入相册名称" v-model="searchForm.keyword"></el-input>
            <el-button type="success" size="mini" @click="getImageList">搜索</el-button>
          </div>
        </el-header>
        <el-container>
          <!-- 侧边栏 相册列表-->
          <el-aside width="200px" style="position:absolute; top:60px;left:0;bottom:60px" class="bg-white border-right" v-loading="asideLoading">
            <ul class="list-group list-group-flush">
              <album-item v-for="(item, index) in albums" :key="index" :item="item" :index="index" :active="albumIndex === index" @change="albumChange" :showOptions = 'false'></album-item>
            </ul>
          </el-aside>
          <!-- 主内容 -->
          <el-container>
            <el-main style="position:absolute;top:60px;left:200px;bottom:60px;right:0" v-loading="mainLoading">
              <el-row :gutter="10">
                <el-col :span="24" :lg="4" :md="6" :sm="8" v-for="(item, index) in imageList" :key="index">
                  <el-card class="box-card mb-3 position-relative" :body-style="{padding:0}" shadow="hover" style="cursor:pointer">
                    <div class="border" :class="{'border-danger':item.ischeck}">
                      <span class="badge badge-danger" style="position:absolute; top:0;right:0;" v-if="item.ischeck">{{item.checkOrder}}</span>
                      <img :src="item.url" alt="" class="w-100" style="height:100px" @click="choose(item)">
                      <div style="background:rgba(0,0,0,0.5); margin-top:-20px;position:absolute;" class="w-100 text-white px-1">
                        <span class="small">{{item.name}}</span>
                      </div>
                      <div class="p-2 text-center">
                        <el-button-group>
                          <el-button  icon="el-icon-edit" size="mini" class="p-2" @click="imageEdit(item)"></el-button>
                          <el-button  icon="el-icon-delete" size="mini" class="p-2" @click="imageDel({index})"></el-button>
                        </el-button-group>
                      </div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </el-main>
          </el-container>
        </el-container>
        <el-footer class="border-top d-flex align-items-center px-0">
          <div style="width:200px;flex-shrink:0" class="h-100 d-flex justify-content-center align-items-center border-right">
            <el-button-group>
              <el-button size="mini" :disabled="albumPage === 1" @click="changeAlbumPage('pre')">上一页</el-button>
              <el-button size="mini" @click="changeAlbumPage('next')" :disabled="albumPage === Math.ceil(albumTotal / 10)">下一页</el-button>
            </el-button-group>
          </div>
          <div class="px-2" style="flex:1">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
				</el-pagination>
          </div>
        </el-footer>
      </el-container>
      <span slot="footer" class="dialog-footer">
        <el-button @click="imageModal = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
</template>

<script>
import albumItem from './album-item.vue'
export default {
  props:{
    max:{
      type: Number,
      default:9
    }
  },
  components:{
    albumItem
  },
  data(){
    return {
      imageModal: false,
      callback: false,
      searchForm:{
        order:"",
        keyword:""
      },
      albums:[],
      albumIndex: 0,
      albumPage:1,
			albumTotal:0,
      imageList:[],
      chooseList:[],
      currentPage:1,
      pageSize:10,
      pageSizes:[10,20,50,100],
      total:10,
      asideLoading:false,
      mainLoading:false
    }
  },
  computed: {
    // 选中相册id
    image_class_id(){
      let item = this.albums[this.albumIndex]
      if(item){
        return item.id
      }
      return 0
    },
    // 当前选中相册的图片列表URL
    getImageListUrl(){
      let other = ''
      if(this.searchForm.keyword != ''){
        other = `&keyword=${this.searchForm.keyword}`
      }
      return `/admin/imageclass/${this.image_class_id}/image/${this.currentPage}?limit=${this.pageSize}&order=${this.searchForm.order}${other}`
    }
  },
  methods:{
    // 相册分页功能
    changeAlbumPage(type){
      if(type === 'pre'){
        this.albumPage--
      } else {
        this.albumPage++
      }
      this.__init()
    },
    // 弹出确认
    confirm(){
      if(typeof this.callback === 'function'){
        this.callback(this.chooseList)
      }
      this.hide()
    },
    // 弹出隐藏（关闭）
    hide(){
      this.imageModal = false
      this.callback = false
    },
    // 选择照片
    chooseImage(callback){
      this.callback = callback
      this.imageModal = true
      this.__init()
      this.unChoose()
    },
    // 初始化相册内容
    __init(){
      this.asideLoading = true
      this.axios.get("/admin/imageclass/"+this.albumPage, {
        token:true
      }).then((res) => {
        let result = res.data.data
        this.albums = result.list
        this.albumTotal = result.totalCount
        // 获取第一个分类下的图片
        this.getImageList()
        this.asideLoading = false 
      }).catch(() => {
        this.asideLoading = false
      })
    },
    // 获取对应相册下的图片列表
    getImageList(){
      this.mainLoading = true
      this.axios.get(this.getImageListUrl,{
        token:true
      }).then(res=>{
        let result = res.data.data
        this.imageList = result.list.map(item=>{
          return { 
            id:item.id,
            url:item.url,
            name:item.name,
            ischeck:false,
            checkOrder:0
          }
        })
        this.total = result.totalCount
        this.mainLoading = false
      }).catch(() => {
        this.mainLoading =false
      })
    },
    // 切换相册
    albumChange(index){
      this.albumIndex = index
      this.getImageList()
    },
    // 修改图片名称
    imageEdit(item){
      this.$prompt('请输入新名称', '提示', {
        confirmButtonText: '修改',
        cancelButtonText: '取消',
        inputValue: item.name,
        inputValidator(val){
          if(val === ''){
            return "图片名称不能为空!"
          }
        }
      }).then(({ value }) => {
        item.name = value
        this.$message({
          type: 'success',
          message: '修改成功！'
        });
      })
    },
    // 删除图片
    imageDel(obj){
      this.$confirm(obj.all?'是否删除选中图片':'是否删除该图片?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if(obj.all){
          let list = this.imageList.filter(img => {
            return !this.chooseList.some(c => {
              return c.id === img.id
            })
          })
          this.imageList = list
          this.chooseList = []
        }else{
          this.imageList.splice(obj.index,1)
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      })
    },
    // 选中图片
    choose(item){
      // 选中
      if(!item.ischeck){
        if(this.chooseList.length >= this.max){
          return this.$message({
            message: '最多选择'+this.max+'张图片',
            type: 'warning'
          })
        }
        this.chooseList.push({
        id:item.id,
        url:item.url
        })
        item.checkOrder = this.chooseList.length
        item.ischeck = true
        return
      }
      // 取消
      item.ischeck = false
      item.checkOrder = 0
      let i = this.chooseList.findIndex(v =>v.id === item.id)
      if(i===-1) return
      let len = this.chooseList.length
      if(i+1<len){
        for(let j = i; j<len;j++){
          let no = this.imageList.findIndex(v => v.id === this.chooseList[j].id)
          if(no>-1){
            this.imageList[no].checkOrder--
          }
        }
      }
      this.chooseList.splice(i,1)
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    // 取消选中
    unChoose(){
      this.imageList.forEach(img => {
        let i = this.chooseList.findIndex(item => {
          return item.id === img.id
        })
        if(i>-1){
          img.ischeck = false
          img.checkOrder = 0
          this.chooseList.splice(i,1)
        }
      })
    }
  }
}
</script>
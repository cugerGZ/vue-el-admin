<template>
    <!-- 商品规格 -->
    <el-dialog title="商品规格" :visible.sync="createModal" width="80%" top="6vh">
      <el-container style="height:70vh; position:relative;margin:-30px -20px">
        <el-container>
          <!-- 侧边栏-->
          <el-aside width="200px" style="position:absolute; top:0px;left:0;bottom:50px" class="bg-white border-right">
            <!-- 规格卡片标题 -->
            <ul class="list-group list-group-flush">
              <li class="list-group-item list-group-item-action" v-for="(item,index) in skusList" :key="index" :class="skuIndex === index ? 'sum-active': ''" @click="changeSku(index)">{{item.name}}</li>
            </ul>
          </el-aside>
          <el-footer style="position:absolute; left:0;bottom:0;height:50px;width:200px;display:flex; align-items:center;justify-content:center" class="border">
            <el-pagination
              :current-page="page.current"
              :page-sizes="page.sizes"
              :page-size="page.size"
              layout=" prev, next"
              :total="page.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange">
            </el-pagination>
          </el-footer>
          <!-- 主内容 -->
          <el-container>
            <el-header style="position:absolute;top:0;left:200px;right:0; height:60px;line-height:50px" class="border-top border-bottom">
              <el-button type="primary" size="mini" @click="chooseAll">{{isChooseAll ? '取消全选' : '全选'}}</el-button>
            </el-header>
            <el-main style="position:absolute;top:60px;left:200px;bottom:0px;right:0">
              <div class="d-flex flex-wrap">
                <span class="border rounded py-1 px-2 m-2" style="cursor:pointer" v-for="(item, index) in skuItems" :key="index" :class="item.ischeck ? 'sum-active' : ''" @click="choose(item)">{{item.name}}</span>
              </div>
            </el-main>
          </el-container>
        </el-container>
      </el-container>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createModal = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
</template>

<script>
import common from '../../common/mixins/common.js'
export default {
  mixins:[common],
  data(){
    return {
      preUrl:"skus",
      createModal: false,
      callback: false,
      chooseList:[], // 选中的规格
      skuIndex:0, // 选中规格项的索引值
      skusList:[],
      loading:false
    }
  },
  methods:{
    // 处理数据结果
    getListResult(e){
      console.log(e)
      this.skusList = e.list.map(item => {
        let list = item.default.split(',')
        item.list = list.map( name => {
          return {
            name: name,
            image:"",
            color:"",
            ischeck: false
          }
        })
        return item 
      })
    },
    // 弹出确认
    confirm(){
      // 返回选中的规格
      if(typeof this.callback === 'function'){
        let item = this.skusList[this.skuIndex]
        this.callback({
          id: item.id,
          name: item.name,
          type: item.type,
          list:this.chooseList
        })
      }
      this.hide()
    },
    // 弹出隐藏（关闭）
    hide(){
      this.unChooseAll()
      this.createModal = false
      this.callback = false
    },
    // 选择规格
    chooseSkus(callback){
      this.callback = callback
      this.createModal = true
    },
    // 切换规格卡片
    changeSku(index){
      this.unChooseAll()
      this.skuIndex = index 
    },
    // 选中规格属性
    choose(item){
      if(!item.ischeck){
        this.chooseList.push(item)
        return item.ischeck = true
      }else{
        let index = this.chooseList.findIndex(v => {
          return v.id === item.id
        })
        if(index < 0){
          return
        }else{
          this.chooseList.splice(index,1)
          item.ischeck = false
        }
      }
      
    },
    // 选中或取消选中
    chooseAll(){
      let list = this.skusList[this.skuIndex].list
      // 取消选中
      if(this.isChooseAll){
        return this.unChooseAll()
      }
      // 全选
      this.chooseList = list.map(v => {
        v.ischeck = true
        return v
      })
    },
    // 取消选中
    unChooseAll(){
      let list = this.skusList[this.skuIndex].list
      list.forEach(v => {
          v.ischeck = false
        })
      return this.chooseList = []
    }
  },
  computed:{
    // 当前规格下的规格属性列表
    skuItems(){
      let item = this.skusList[this.skuIndex]
      return item ? item.list : []
    },
    // 是否全选
    isChooseAll(){
      return this.skuItems.length === this.chooseList.length
    }
  }
}
</script>

<style>
  .sum-active{
    background-color: teal;
    color: #ffffff;
  }
</style>
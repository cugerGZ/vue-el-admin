<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
    <el-tabs v-model="tabIndex" @tab-click="handleClick">
      <el-tab-pane :label="tab.name" v-for="(tab,index) in tabbars" :key="index">
        <button-search placeholder="要搜索的订单编号" @search="searchEvent" ref="buttonSearch">
          <template #left>
            <el-button type="success" size="mini">导出数据</el-button>
            <el-button type="danger" size="mini">批量删除</el-button>
          </template>
          <template #form>
            <el-form ref="form" :model="form" label-width="80px" inline="inline">
              <!-- 订单编号 -->
              <el-form-item label="订单编号" class="mb-0">
                <el-input v-model="form.code" size="mini" placeholder="请输入商品名称"></el-input>
              </el-form-item>
              <!-- 订单状态 -->
              <el-form-item label="订单状态" class="mb-0">
                <el-select placeholder="请选择订单状态" v-model="form.type" size="mini">
                  <el-option label="1" value="1"></el-option>
                  <el-option label="1" value="1"></el-option>
                  <el-option label="1" value="1"></el-option>
                </el-select>
              </el-form-item>
              <!-- 下单时间 -->
              <el-form-item label="下单时间" class="mb-0">
                <el-date-picker
                  size="mini"
                  v-model="form.time"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <!-- 收货人 -->
              <el-form-item label="收货人" class="mb-0">
                <el-input v-model="form.username" size="mini" placeholder="请输入收货人"></el-input>
              </el-form-item>
              <!-- 手机号 -->
              <el-form-item label="手机号" class="mb-0">
                <el-input v-model="form.phone" size="mini" placeholder="请输入手机号" type="number"></el-input>
              </el-form-item>
              <!-- 操作 -->
              <el-form-item >
                <el-button size="mini" type="info" @click="searchEvent">搜索</el-button>
                <el-button size="mini" @click="clearSearch">清空筛选条件</el-button>
              </el-form-item>
            </el-form>
          </template>
        </button-search>
        
        <!-- 订单列表 -->
        <el-table border class="mt-3" :data="tableData[index].list" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="45"
            align="center">
            <!-- 商品信息 -->
          </el-table-column>
          <el-table-column prop="title" label="商品信息" width="350px" >
            <template slot-scope="scope">
              <div class="d-flex">
                <div style="flex:1">
                  <p class="mb-1">订单编号</p>
                  <p class="mb-1">202088888888888</p>
                </div>
                <div style="flex:1">
                  <p class="mb-1">下单时间</p>
                  <p class="mb-1">2017-02-02 19:14:14</p>
                </div>
              </div>
              <div class="media">
                <img class="mr-3" style="width: 60px;height: 60px;" :src="scope.row.cover">
                <div class="media-body">
                  <p class="mt-0">
                    <a class="text-primary">{{scope.row.title}}</a>
                  </p>
                </div>
						</div>
            </template>
          </el-table-column>
          <!-- 实付款 -->
          <el-table-column align="center" prop="type" label="实付款" width="150">
            <template>
              <span>￥100</span>
              <p><small>（含运费：￥0.00）</small></p>
            </template>
          </el-table-column>
          <!-- 买家 -->
          <el-table-column align="center" prop="sale_count" label="买家">
            <template>
              <span>用户名</span>
              <p><small>（用户id：99）</small></p>
            </template>
          </el-table-column>
          <!-- 支付方式 -->
          <el-table-column align="center" prop="status" label="支付方式">
              <span class="badge badge-success">微信支付</span>
          </el-table-column>
          <!-- 配送方式 -->
          <el-table-column align="center" prop="stock" label="配送方式">
            顺丰快递
          </el-table-column>
          <!-- 交易状态 -->
          <el-table-column align="center" prop="pprice" label="交易状态">
            <template>
              <div>付款状态：<span class="badge badge-success">已付款</span></div>
              <div>发货状态：<span class="badge badge-success">待收货</span></div>
              <div>收货状态：<span class="badge badge-success">待收货</span></div>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column align="center" width="150" label="操作">
            <template>
              <el-button type="primary" size="mini" plain>订单详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="height: 60px;"></div>
				<el-footer class="border-top d-flex align-items-center px-0 position-fixed bg-white" style="bottom: 0;left: 200px;right: 0;z-index: 100;">
          <div style="flex: 1;" class="px-2">
            <el-pagination
            :current-page="tableData[index].currentPage"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400">
          </el-pagination>
          </div>
				</el-footer>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import buttonSearch from "../../../components/common/button-search.vue"
export default {
  components:{
    buttonSearch
  },
  data(){
    return {
      tabIndex: 0,
      tabbars:[
        { name:"全部"},
        { name:"待付款" },
        { name:"代发货" },
        { name:"已发货" },
        { name:"已完成" },
        { name:"已关闭" },
        { name:"退款中" },
      ],
      form:{
        type:"",
        code:"",
        time:"",
        username:"",
        phone:""
      },
      tableData: [],
      multipleSelection:[]
    }
  },
  created(){
    this.__getData()
  },
  methods:{
    // 生成数据
    __getData(){
      for (let i = 0; i < this.tabbars.length; i++) {
        this.tableData.push({
          currentPage:1,
          list:[]
        })
        for (let j = 0; j < 20; j++) {
          this.tableData[i].list.push({
            id:j,
            title: '荣耀 V10全网通 标配版'+i+'-'+j,
            cover: 'http://static.yoshop.xany6.com/2018071718294208f086786.jpg',
            create_time: '2019-07-17 18:34:14',
            category:"手机",
            type:"普通商品",
            sale_count:20,
            order:100,
            status:1, 
            stock:200,
            pprice:1000,
            ischeck:1
            // 0未审核，1通过，2不通过
          })
        }
      }
    },
    // 加载数据
    handleClick(tab, event){
      console.log(tab.index)
      console.loh(event)
    },
    // 选中
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 清空筛选条件
    clearSearch(){
      this.form= {
        type:"",
        code:"",
        time:"",
        username:"",
        phone:""
      }
      this.$refs.buttonSearch[this.tabIndex].closeSuperSearch()
    },
    // 搜索
    searchEvent(e){
      // 简单搜索
      if(typeof e === 'string'){
        return console.log("jiandan ")
      }
      // 高级搜索
      console.log("gaoji")
    },    
    // 删除商品
    deleteItem(index){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData[this.tabIndex].list.splice(index,1)
      })
    },
  }
}
</script>
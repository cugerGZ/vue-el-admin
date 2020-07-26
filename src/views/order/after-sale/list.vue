<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
		<button-search class="pt-3">
      <template #right>
        <div class="d-flex align-items-center">
          <el-date-picker
            style="width:400px"
            size="medium"
            v-model="search.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份">
          </el-date-picker>
          <el-input v-model="search.keyword" size="medium" placeholder="请输入订单号" style="width:200px" class="mx-2"></el-input>
          <el-button size="medium" type="">搜索</el-button>
        </div>
      </template>
		</button-search>
	
		<!-- 售后-->
    <el-table border class="mt-3" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="45" align="center">

      </el-table-column>
      <el-table-column prop="name" label="商品信息">
        
      </el-table-column>
      <el-table-column prop="username" label="商品清单">
        
      </el-table-column>
      <el-table-column prop="price" label="订单金额">
        
      </el-table-column>
      <el-table-column prop="price" label="收货信息">
        
      </el-table-column>
      <el-table-column prop="content" label="买家">
        
      </el-table-column>
      <el-table-column prop="code" label="交易状态">
        
      </el-table-column>
      <el-table-column align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" size="mini" plain @click="openModel(scope)">修改</el-button>
            <el-button type="danger" size="mini" plain @click="deleteItem(scope)">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <div style="height: 60px;"></div>
    <!-- 分页器 -->
    <el-footer class="border-top d-flex align-items-center px-0 position-fixed bg-white" style="bottom: 0;left: 200px;right: 0;z-index: 100;">
      <div style="flex: 1;" class="px-2">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400">
        </el-pagination>
      </div>
    </el-footer>


	</div>
</template>

<script>
	import buttonSearch from "@/components/common/button-search.vue"
	export default {
		components: {
			buttonSearch
		},
		data() {
			return {
        tableData:[],
				currentPage:1,
        multipleSelection: [],
        search:{
          time:"",
          keyword:"",
        }
			}
		},
		created() {

		},
		methods: {
			// 选中
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 删除单个
			deleteItem(scope){
				this.$confirm('是否要删除该规格?', '提示', {
					confirmButtonText: '删除',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.tableData.splice(scope.$index,1)
					this.$message({
						message: '删除成功',
						type: 'success'
					});
				})
			},  
		},
	}
</script>

<style>
body .el-table th.gutter {
    display: table-cell !important
}
</style>

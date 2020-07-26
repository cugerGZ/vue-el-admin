<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
		<button-search ref="buttonSearch" class="pt-3" placeholder="要搜索的商品名称" @search="searchEvent">
		<!-- 左边 -->
			<template #left>
				<el-button size="mini" type="danger" @click="deleteAll()">批量删除</el-button>
			</template>
			<template #form>
				<el-form inline ref="form" :model="form"
				label-width="80px">
					<el-form-item label="评价用户" class="mb-0">
						<el-input v-model="form.username" 
						placeholder="评价用户"
						size="mini"></el-input>
					</el-form-item>
					<el-form-item label="评价类型" class="mb-0">
						<el-select v-model="form.type" size="mini"
						placeholder="评价类型">
							<el-option label="区域一" 
							value="shanghai"></el-option>
							<el-option label="区域二" 
							value="beijing"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="发布时间" class="mb-0">
						<el-date-picker
              v-model="form.time"
              size="small"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item class="mb-0">
						<el-button type="info" size="mini"
						@click="searchEvent">
							搜索</el-button>
						<el-button size="mini"
						@click="clearSearch">清空筛选条件</el-button>
					</el-form-item>
				</el-form>
			</template>
		</button-search>
    <!-- 表格 -->
		<el-table border class="mt-3" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
      <!-- 多选 -->
      <el-table-column type="selection" width="45" align="center"></el-table-column>
      <!-- 展开 -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <div class="media">
            <img class="mr-3" src="http://static.yoshop.xany6.com/2018071718294208f086786.jpg" alt="Generic placeholder image" style="width:70px;width:70px;border-radius:100%">
            <div class="media-body">
              <h6 class="mt-0 d-flex">标题
                <small>2019-07-17 18:34:14</small>
                <el-button type="danger" size="mini" class="ml-auto">删除</el-button>
              </h6>
              Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.

              <div class="media mt-3">
                <a class="pr-3" href="#">
                  <img class="mr-3" src="http://static.yoshop.xany6.com/2018071718294208f086786.jpg" alt="Generic placeholder image" style="width:70px;width:70px;border-radius:100%">
                </a>
                <div class="media-body">
                  <h6 class="mt-0 d-flex">标题
                    <small>2019-07-17 18:34:14</small>
                    <div class="ml-auto">
                      <el-button type="success" size="mini" >修改</el-button>
                      <el-button type="danger" size="mini">删除</el-button>
                    </div>
                  </h6>
                  Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- id -->
      <el-table-column label="ID" prop="id" width="70" align="center"></el-table-column>
      <!-- 商品 -->
      <el-table-column label="商品" >
        <template slot-scope="scope">
          <div class="media">
            <img class="mr-3" style="width: 60px;height: 60px;" :src="scope.row.goods.cover">
            <div class="media-body">
              <p class="mt-0">{{scope.row.goods.title}}</p>
            </div>
        </div>
        </template>
      </el-table-column>
      <!-- 评论信息 -->
      <el-table-column label="评论信息" width="250">
        <template slot-scope="scope">
          <div class="d-flex flex-column">
            <p>用户名：{{scope.row.username}}</p>
            <p>评分：<el-rate v-model="scope.row.star" disabled show-score text-color="#ff9900"></el-rate></p>
          </div>
        </template>
      </el-table-column>
      <!-- 评论时间 -->
      <el-table-column prop="create_time" align="center" label="评论时间" width="200"></el-table-column>
      <!-- 是否显示 -->
      <el-table-column align="center" label="操作"	width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status"></el-switch>
        </template>
      </el-table-column>
		</el-table> 
		<div style="height: 60px;"></div>
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
				tableData: [{
          id:1,
          goods:{
            title:"商品标题",
            cover: 'http://static.yoshop.xany6.com/2018071718294208f086786.jpg',
          },
          username:"用户名",
          star:5,
          create_time:'2019-07-17 18:34:14',
					status:1
				},],
				currentPage:1,
				multipleSelection: [],
				form:{
					username:"",
					type:"",
					time:""
				}
			}
		},
		created() {

		},
		methods: {
			clearSearch(){
				
			},
			searchEvent(e){
				console.log(e);
			},
			// 批量删除
			deleteAll(){
				this.$confirm('是否要删除选中规格?', '提示', {
					confirmButtonText: '删除',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.multipleSelection.forEach(item=>{
						let index = this.tableData.findIndex(v=>v.id === item.id)
						if (index !== -1) {
							this.tableData.splice(index,1)
						}
					})
					this.multipleSelection = []
					this.$message({
						message: '删除成功',
						type: 'success'
					});
				})
			},
			// 选中
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
		},
	}
</script>

<style>
</style>

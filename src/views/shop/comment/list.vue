<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
		<button-search ref="buttonSearch" class="pt-3" placeholder="要搜索的商品名称" @search="searchEvent" :showSuperSearch="false"></button-search>
    <!-- 表格 -->
		<el-table border class="mt-3" :data="tableData" style="width: 100%">
      <!-- 展开 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <div class="media">
            <img class="mr-3" :src="scope.row.user.avatar" alt="Generic placeholder image" style="width:70px;width:70px;border-radius:100%">
            <div class="media-body">
              <h6 class="mt-0 d-flex">
								{{scope.row.user.usernmae}}
                <small>{{scope.row.review_time}}</small>
								<el-button type="success" size="mini" class="ml-auto" v-if="!scope.row.extra && !textareaEdit" @click="textareaEdit = true">回复</el-button>
              </h6>
              {{scope.row.review.data}}
							<div class="py-2">
								<img v-for="(item, index) in scope.row.review.image"  :key="index" :src="item" style="max-width:100px;max-height:100px" class="px-2">
							</div>
							<!-- 客户回复输入框 -->
							<div v-if="textareaEdit">
								<el-input type="textarea" :rows="2" placeholder="请输入评价内容" v-model="textarea"> </el-input>
								<div class="py-2">
									<el-button type="success" size="mini" class="ml-auto mr-2" @click="review(scope.row.id)">回复</el-button>
									<el-button type="error" size="mini" class="ml-auto" @click="closeTextarea">取消</el-button>
								</div>
							</div>
							<!-- 客服回复 -->
              <div v-if="scope.row.extra">
								<div class="media mt-3 bg-light p-2 rounded" v-for="(item, index) in scope.row.extra" :key="index">
									<div class="media-body">
										<h6 class="mt-0 d-flex">
											客服
											<el-button type="success" size="mini" class="ml-auto" @click="openTextarea(item.data)" v-if="
											!textareaEdit">修改</el-button>
										</h6>
										{{item.data}}
									</div>
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
            <img class="mr-3" style="width: 60px;height: 60px;" :src="scope.row.goods_item.cover">
            <div class="media-body">
              <p class="mt-0">{{scope.row.goods_item.title}}</p>
            </div>
        </div>
        </template>
      </el-table-column>
      <!-- 评论信息 -->
      <el-table-column label="评论信息" width="250">
        <template slot-scope="scope">
          <div class="d-flex flex-column">
            <p>用户名：{{scope.row.user.username}}</p>
            <p>评分：<el-rate v-model="scope.row.rating" disabled show-score text-color="#ff9900"></el-rate></p>
          </div>
        </template>
      </el-table-column>
      <!-- 评论时间 -->
      <el-table-column prop="review_time" align="center" label="评论时间" width="200"></el-table-column>
      <!-- 是否显示 -->
      <el-table-column align="center" label="操作"	width="100">
        <template slot-scope="scope">
          <el-button :type="scope.row.status ? 'success' : 'danger'" size="mini" plain @click="changeStatus(scope.row)">{{scope.row.status ? '启用': '禁用'}}</el-button>
        </template>
      </el-table-column>
		</el-table> 
		<div style="height: 60px;"></div>
		<el-footer class="border-top d-flex align-items-center px-0 position-fixed bg-white" style="bottom: 0;left: 200px;right: 0;z-index: 100;">
      <div style="flex: 1;" class="px-2">
        <el-pagination
          :current-page="page.current"
          :page-sizes="page.sizes"
          :page-size="page.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
		</el-footer>

	</div>
</template>

<script>
	import buttonSearch from "@/components/common/button-search.vue"
	import common from '../../../common/mixins/common.js'
	export default {
		components: {
			buttonSearch
		},
		inject:['layout'],
		mixins:[common],
		data() {
			return {
				preUrl:"goods_comment",
				tableData:[],
				textarea:"",
				textareaEdit:false,
				title:""
			}
		},
		methods: {
			getListResult(e){
				this.tableData = e.list
			},
			// 获取请求列表分页url
			getListUrl() {
					return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}&title=${this.title}`
			},
			searchEvent(e){
				this.title = e
				this.getList()
			},
			// 关闭评论输入框
			closeTextarea(){
				this.textareaEdit = false
				this.textarea  = ""
			},
			//回复
			review(id){
				if(this.textarea === ""){
					return this.$message({
						message:"回复内容给不能为空",
						type:"error"
					})
				}
				this.layout.showLoading()
				this.axios.post('/admin/goods_comment/review/'+id, {
					data:this.textarea
				},{
					token:true
				}).then(() => {
					this.closeTextarea()
					this.layout.hideLoading()
					this.getList()
					this.$message({
						message:"回复成功",
						type:"success"
					})
				}).catch(() => {
					this.layout.hideLoading()
				})
			},
			// 修改回复
			openTextarea(data){
				this.textarea = data
				this.textareaEdit = true
			}
		},
	}
</script>

<style>
</style>

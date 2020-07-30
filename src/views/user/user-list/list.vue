<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
		<button-search class="pt-3" placeholder="手机号/邮箱/会员昵称" @search="searchEvent">
			<template #left>
				<el-button size="mini" type="success"  @click="openModel(false)">添加会员</el-button>
			</template>
      <template #form>
        <el-form ref="search" :model="form" label-width="80px" inline="inline">
          <!-- 搜索内容 -->
          <el-form-item label="搜索内容" class="mb-0">
            <el-input v-model="search.keyword" size="mini" placeholder="手机号/邮箱/会员昵称"></el-input>
          </el-form-item>
          <!-- 会员等级 -->
          <el-form-item label="会员等级" class="mb-0">
            <el-select placeholder="请选择会员等级" v-model="search.user_level_id" size="mini">
              <el-option :label=item.name :value=item.id v-for="(item, index) in user_level" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <!-- 操作 -->
          <el-form-item >
            <el-button size="mini" type="info" @click="searchEvent">搜索</el-button>
            <el-button size="mini" @click="clearSearch">清空筛选条件</el-button>
          </el-form-item>
        </el-form>
      </template>
		</button-search>
    
    <!-- 会员列表 -->
    <el-table border class="mt-3" :data="tableData" style="width: 100%">
      <!-- 会员 -->
      <el-table-column label="会员"  width="200px">
        <template slot-scope="scope">
          <div class="media">
            <img class="mr-3 rounded-circle" :src="scope.row.avatar" style="width: 40px;height: 40px;">
            <div class="media-body">
              <h6 class="mt-0 d-flex align-items-center">
                {{scope.row.username }}
                <el-button class="ml-auto" type="text" size="mini">详情</el-button>
              </h6>
            用户id：{{scope.row.user_level_id}}
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- 会员等级 -->
      <el-table-column align="center" label="会员等级">
        <template slot-scope="scope">
          {{scope.row.user_level.name}}
        </template>
      </el-table-column>
      <!-- 登录注册 -->
      <el-table-column align="center" label="登录注册" width="250">
        <template slot-scope="scope">
          <div>注册时间：{{scope.row.create_time}}</div>
          <div>最后登录：{{scope.row.last_login_time}}</div>
        </template>
      </el-table-column>
      <!-- 状态 -->
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-button :type="scope.row.status ? 'success' : 'danger'" size="mini" plain @click="changeStatus(scope.row)">{{scope.row.status ? '启用': '禁用'}}</el-button>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column align="center" label="操作" width="180px">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="openModel(scope)">修改</el-button>
          <el-button size="mini" type="text" @click="deleteItem(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="height: 60px;"></div>
    <!-- 分页器 -->
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

    <!-- 新增/修改规格 -->
    <el-dialog title="添加会员" :visible.sync="createModel" width="50%" top="8vh">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" size="samll" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" size="samll" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入用户名" size="samll" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="头像" >
          <span class="btn btn-light" @click="chooseImage" v-if="!form.avatar">
            <i class="el-icon-plus"></i>
          </span>
          <img :src="form.avatar" v-else style="width:40px;height:40px;cursor:pointer" class="rounded" @click="chooseImage">
        </el-form-item>
        <el-form-item label="会员等级">
          <el-select v-model="form.user_level_id" placeholder="请选择会员等级" size="small">
            <el-option :label=item.name :value=item.id v-for="(item, index) in user_level" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机" size="small" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" size="small" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status" size="small">
            <el-radio :label="1" border>启用</el-radio>
            <el-radio :label="0" border>禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createModel= false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
	import buttonSearch from "@/components/common/button-search.vue"
	import common from '../../../common/mixins/common.js'
	export default {
		inject:['app','layout'],
		mixins:[common],
		components: {
			buttonSearch
		},
		data() {
			return {
				preUrl:"user",
				tableData: [],
				createModel:false,
				editIndex:-1,
				search:{
					keyword:"",
					user_level_id:""
				},
				
				form:{
					username:"",
					password:"",
					nickname:"",
					avatar:"",
					user_level_id:1,
					phone:"",
					email:"",
					status:1,
				},
				user_level:[]
			}
		},
		created() {

		},
		methods: {
			getListResult(e){
				this.tableData = e.list
				this.user_level = e.user_level
			},
			// 打开模态框
			openModel(e = false){

				// 增加
				if (!e) {
					// 初始化表单
					this.form = {
						username:"",
						password:"",
						nickname:"",
						avatar:"",
						user_level_id:3,
						phone:"",
						email:"",
						status:1,
					}
					this.editIndex = -1
				} else {
					// 修改
					this.form = {
						username:e.row.username,
						password:"",
						nickname:e.row.nickname,
						avatar:e.row.avatar,
						user_level_id:e.row.user_level_id,
						phone:e.row.phone,
						email:e.row.email,
						status:e.row.status,
					}
					this.editIndex = e.$index
				}
				// 打开dialog
				this.createModel = true
			},
			// 添加规格
			submit(){
				let id = 0
				if (this.editIndex !== -1) {
					id = this.tableData[this.editIndex].id
				}
				this.addOrEdit(this.form, id)
				// 关闭模态框
				this.createModel = false
			},
			// 清空筛选条件
			clearSearch(){
				this.search = {
					keyword:"",
					user_level_id:""
				}
			},
			// 获取请求列表分页url
			getListUrl() {
					return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}&keyword=${this.search.keyword}&user_level_id=${this.search.user_level_id}`
			},
			// 搜索事件
			searchEvent(e = false){
				// 简单搜索
				if (typeof e === 'string') {
					this.search.keyword = e
					this.getList()
				}
				// 高级搜索
				this.getList()
			},
			// 选择头像
			chooseImage(){
				this.app.chooseImage((res)=>{
					this.form.avatar = res[0].url
				},1)
			}
		},
	}
</script>
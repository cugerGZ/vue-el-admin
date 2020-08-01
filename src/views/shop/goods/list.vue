<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
    <el-tabs v-model="tabIndex" @tab-click="getList">
      <el-tab-pane :label="tab.name" v-for="(tab,index) in tabbars" :key="index"></el-tab-pane>
    </el-tabs>

    <button-search ref="buttonSearch"
		placeholder="要搜索的商品名称" 
		@search="searchEvent">
		<!-- 左边 -->
			<template #left>
				<router-link :to="{name:'shop_goods_create'}" class="mr-2">
          <el-button type="success" size="mini">发布商品</el-button>
				</router-link>
				<el-button type="warning" size="mini" v-if="tab === 'delete'" @click="doEvent('restore')">恢复商品</el-button>
        <el-button type="danger" size="mini" v-if="tab === 'delete'" @click="doEvent('destroy')">彻底删除</el-button>
				<el-button type="danger"  size="mini" v-if="tab !== 'delete'" @click="deleteAll">批量删除</el-button>
				<el-button size="mini" v-if="tab === 'all' || tab==='off'" @click="changeStatus(1)">上架</el-button>
				<el-button size="mini" v-if="tab === 'all' || tab==='sailing'" @click="changeStatus(0)">下架</el-button>
			</template>
			<!-- 高级搜索表单 --> 
			<template #form>
				<el-form inline ref="form" :model="form"
				label-width="80px">
					<el-form-item label="商品名称" class="mb-0">
						<el-input v-model="form.title"  placeholder="商品名称" size="mini"></el-input>
					</el-form-item>
					<el-form-item label="商品分类" class="mb-0">
						<el-select v-model="form.category_id" placeholder="请选择商品分类" size="mini">
                <el-option
                  v-for="item in cateOptions"
                  :key="item.id"
                  :label="item | tree"
                  :value="item.id">
                </el-option>
              </el-select>
					</el-form-item>
					<el-form-item class="mb-0">
						<el-button type="info" size="mini" @click="searchEvent">搜索</el-button>
						<el-button size="mini" @click="clearSearch">清空筛选条件</el-button>
					</el-form-item>
				</el-form>
			</template>
		</button-search>
        
        <!-- 商品列表 -->
        <el-table border class="mt-3" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="45"
            align="center">
          </el-table-column>
          <!-- 商品 -->
          <el-table-column prop="title" label="商品" width="300px" >
            <template slot-scope="scope">
              <div class="media">
                <img class="mr-3" style="width: 60px;height: 60px;" :src="scope.row.cover">
                <div class="media-body">
                  <p class="mt-0">{{scope.row.title}}</p>
                  <p class="mb-0">分类：{{scope.row.category.name}}</p>
                  <p class="mb-0">时间：{{scope.row.create_time}}</p>
                </div>
						</div>
            </template>
          </el-table-column>
          <!-- 实际销量 -->
          <el-table-column align="center" prop="sale_count" label="实际销量" width="80px"></el-table-column>
          <!-- 商品状态 -->
          <el-table-column align="center" prop="status" label="商品状态" width="80px">
            <template slot-scope="scope">
              <span class="badge" :class="scope.row.status ? 'badge-success' : 'badge-danger'">
                {{scope.row.status ? "上架":"仓库"}}
              </span>
            </template>
          </el-table-column>
          <!-- 审核状态 -->
          <el-table-column align="center" prop="status" label="审核状态" width="100px">
            <template slot-scope="scope">
              <div class="d-flex flex-column" v-if="!scope.row.ischeck">
                <el-button type="success" size="mini"  plain @click="checkGoods(scope.row, 1)">审核通过</el-button>
                <el-button class="ml-0 mt-2" type="danger" size="mini" plain  @click="checkGoods(scope.row, 1)">审核拒绝</el-button>
              </div>
              <span v-else>{{scope.row.ischeck === 1 ? '通过': '拒绝'}}</span>
            </template>
          </el-table-column>
          <!-- 总库存 -->
          <el-table-column align="center" prop="stock" label="总库存" width="80px"> </el-table-column>
          <!-- 价格 -->
          <el-table-column align="center" prop="pprice" label="价格" width="180px">
            <template slot-scope="scope">
              <span class="text-danger">￥{{scope.row.min_price}}</span>
              <span>/</span>
              <span class="text-muted">￥{{scope.row.min_oprice}}</span>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column align="center" label="操作">
            <template slot-scope="scope" class="d-flex" >
              <el-button type="text" size="mini" @click="navigate('shop_goods_create',scope.row.id)">基础设置</el-button>
              <el-button type="text" size="mini" @click="navigate('shop_goods_sku',scope.row.id)" :class="(scope.row.sku_type ==0 && !scope.row.sku_value)  || (scope.row.sku_type ==1 && !scope.row.goods_skus.length) ? 'text-danger' :''">商品规格</el-button>
              <el-button type="text" size="mini" @click="navigate('shop_goods_attr',scope.row.id)" :class="scope.row.goods_attrs.length == 0 ? 'text-danger' :''">商品属性</el-button>
              <el-button type="text" size="mini" @click="navigate('shop_goods_banner',scope.row.id)" :class="scope.row.goods_banner.length == 0 ? 'text-danger' :''">媒体设置</el-button>
              <el-button type="text" size="mini" @click="navigate('shop_goods_content',scope.row.id)" :class="!scope.row.content ? 'text-danger' :''">商品详情</el-button>
              <el-button type="text" size="mini" @click="discount(scope.row)">折扣设置</el-button>
              <el-button type="text" size="mini" @click="deleteItem(scope.row)">删除商品</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
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
	import common from '@/common/mixins/common.js';
	export default {
		mixins:[common],
		inject:['layout'],
		components: {
			buttonSearch
		},
		data() {
			return {
				preUrl:"goods",
				
				tabIndex: 0,
				tabbars:[
					{ name:"全部",key:"all"},
					{ name:"审核中",key:"checking"},
					{ name:"出售中",key:"saling"},
					{ name:"已下架",key:"off"},
					{ name:"库存预警" ,key:"min_stock"},
					{ name:"回收站" ,key:"delete"},
				],
				form:{
					title:"",
					category_id:""
				},
				tableData: [],
				cateOptions:[]
			}
    },
		filters: {
			tree(item) {
				if (item.level == 0) {
					return item.name
				}
				let str = ''
				for (let i = 0; i < item.level; i++) {
					str += i == 0 ? '|--' : '--'
				}
				return str + ' ' +item.name;
			}
		},
		computed: {
			tab() {
				return this.tabbars[this.tabIndex].key 
			},
			params(){
				let str = ''
				for (let key in this.form) {
					let val = this.form[key]
					if(val){
						str += `&${key}=${this.form[key]}`
					}
				}
				return str
			}
		},
		created() {
			
		},
		methods: {
			// 获取请求列表分页url
			getListUrl(){
				return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}&tab=${this.tab}${this.params}`
			},
			getListResult(e){
				this.tableData = e.list
				this.cateOptions = e.cates
			},
			// 清空筛选条件
			clearSearch(){
				this.form = {
					title:"",
					category_id:""
				}
			},
			// 搜索事件
			searchEvent(e = false){
				// 简单搜索
				if (typeof e === 'string') {
					this.form.title = e
				}
				// 高级搜索
				this.getList()
      },
      // 恢复商品、彻底删除
      doEvent(key){
        if(this.ids.length === 0){
          return this.$message({
              message: '请选择需要操作的商品',
              type: 'error'
          });
        }
        this.layout.showLoading()
        this.axios.post('/admin/goods/'+key, {
          ids:this.ids
        },{
          token:true
        }).then(() =>{
          this.layout.hideLoading()
          this.getList()
          this.$message({
              message: '操作成功',
              type: 'success'
          });
        }).catch(() => {
          this.layout.hideLoading()
        })
      },
      // 上下架
      changeStatus(status){
        if(this.ids.length === 0){
          return this.$message({
              message: '请选择需要操作的商品',
              type: 'error'
          });
        }
        this.layout.showLoading()
        this.axios.post('/admin/goods/changeStatus',{
          ids:this.ids,
          status :status
        },{
          token:true
        }).then(() =>{
          this.layout.hideLoading()
          this.getList()
          this.$message({
              message: '操作成功',
              type: 'success'
          });
        }).catch(() => {
          this.layout.hideLoading()
        })
      },
      // 商品详情
      navigate(name, id){
        this.$router.push({
          name:name,
          params:{ id }
        })
      },
      checkGoods(item,ischeck){
				this.layout.showLoading()
				this.axios.post('/admin/goods/'+item.id+'/check',{
					ischeck
				},{ token:true }).then(()=>{
					this.getList()
					this.$message({
						type:"success",
						message:"操作成功"
					})
					this.layout.hideLoading()
				}).catch(()=>{
					this.layout.hideLoading()
				})
      },
      // 折扣设置
      discount(item){

        this.$prompt('请输入折扣', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^([1-9]|10)$/,
          inputErrorMessage: '折扣范围为1~10',
          inputValue:item.discount
        }).then(({ value }) => {
          this.axios.post('/admin/goods/' + item.id,{
            discount : value
          },{
            token:true
          }).then(() => {
            this.getList()
            this.$message({
              type: 'success',
              message: '设置成功' 
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消设置'
          });       
        });
      }
		},
	}
</script>
<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
		<button-search class="pt-3" >
			<template #left>
				<el-button size="mini" type="primary" @click="openModel(false)">添加等级</el-button>
			</template>
      <template #right>
        <div>
          <small class="mr-2">选择升级标准:</small>
          <el-radio-group v-model="level" size="mini">
            <el-radio-button :label="0">累计消费</el-radio-button>
            <el-radio-button :label="1">累计次数</el-radio-button>
          </el-radio-group>
        </div>
      </template>
		</button-search>
    
    <!-- 会员等级 -->
    <el-table border class="mt-3" :data="tableData" style="width: 100%">
      <!-- 会员等级 -->
      <el-table-column align="center" label="会员等级" prop="name">
      </el-table-column>
      <!-- 升级条件 -->
      <el-table-column align="center" label="升级条件" width="250">
        <template slot-scope="scope">
          {{ getLevel.name + ':' + scope.row[getLevel.value] }}
        </template>
      </el-table-column>
      <!-- 折扣率 -->
      <el-table-column align="center" label="折扣率（%）" prop="discont"></el-table-column>
      <!-- 等级序号 -->
      <el-table-column align="center" label="等级序号" prop="level"> </el-table-column>
      <!-- 操作 -->
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="openModel(scope)">修改</el-button>
          <el-button size="mini" type="text" @click="deleteItem(scope)">删除</el-button>
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

    <!-- 新增/修改模态框 -->
    <el-dialog title="添加等级" :visible.sync="createModel" top="5vh">
      <!-- 表单内容 -->
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="等级名称" prop="name">
          <el-input v-model="form.name" placeholder="等级名称" size="small" style="width: 50%;"></el-input>
          <small class="text-secondary d-block">
            设置会员等级名称
          </small>
        </el-form-item>
        <el-form-item label="等级权重" prop="level">
          <el-input type="number" v-model="form.level" placeholder="等级权重" size="small" style="width: 50%;"></el-input>
          <small class="text-secondary d-block">
            设置会员等级排序(此参数决定等级的高低,排序越大等级越高,请谨慎选择)
          </small>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-radio-group v-model="form.status" size="mini">
            <el-radio :label="1" border>启用</el-radio>
            <el-radio :label="0" border>禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="升级条件">
          <div>
            <small class="mr-2">累计消费满</small>
            <el-input type="number" v-model="form.consume" placeholder="累计消费" size="small" style="width: 50%;">
              <template slot="append">元</template>
            </el-input>
            <small class="text-secondary d-block">
              设置会员等级所需要的累计消费必须大于等于0,单位：元
            </small>
          </div>
          <div>
            <small class="mr-2">累计次数满</small>
            <el-input type="number" v-model="form.times" placeholder="累计次数" size="small" style="width: 50%;">
              <template slot="append">次</template>
            </el-input>
            <small class="text-secondary d-block">
              设置会员等级所需要的购买量必须大于等于0,单位：笔
            </small>
          </div>
        </el-form-item>
        <el-form-item label="折扣率(%)">
          <el-input size='small' type="number" v-model="form.discont" placeholder="折扣率" style="width: 50%;">
            <template slot="append">%</template>
          </el-input>
          <small class="text-secondary d-block">
            折扣率单位为百分比，如输入90，表示该会员等级的用户可以以商品原价的90%购买
          </small>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createModel = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
	import buttonSearch from "@/components/common/button-search.vue"
	export default {
		inject:['app'],
		components: {
			buttonSearch
		},
		data() {
			return {
				level:0,
				tableData: [{
					name:"普通会员",
					consume:100,
					times:10,
					discont:10,
					level:1,
					status:1,//启用
					create_time:"",
				}],
				currentPage:1,
				createModel:false,
				editIndex:-1,
				search:{
					keyword:"",
					group_id:0,
					time:""
				},
				
				form:{
					name:"",
					consume:0,
					times:0,
					discont:0,
					level:0,
					status:1,//启用
				},
			}
		},
		created() {

		},
		computed: {
			getLevel() {
				let arr = [{
					name:"累计消费",
					value:"consume"
				},{
					name:"累计次数",
					value:"times"
				}]
				return arr[this.level]
			}
		},
		methods: {
			// 打开模态框
			openModel(e = false){
				// 增加
				if (!e) {
					// 初始化表单
					this.form = {
						name:"",
						consume:0,
						times:0,
						discont:0,
						level:0,
						status:1,//启用
					}
					this.editIndex = -1
				} else {
					// 修改
					this.form = {
						name:e.row.name,
						consume:e.row.consume,
						times:e.row.times,
						discont:e.row.discont,
						level:e.row.level,
						status:e.row.status,//启用
					}
					this.editIndex = e.$index
				}
				// 打开dialog
				this.createModel = true
			},
			// 添加规格
			submit(){
				var msg = "添加"
				if (this.editIndex === -1) {
					this.tableData.unshift(this.form)
				} else {
					let item = this.tableData[this.editIndex]
				
					item.name = this.form.name
					item.consume = this.form.consume
					item.times = this.form.times
					item.discont = this.form.discont
					item.level = this.form.level
					item.status = this.form.status
					msg = "修改"
				}
				// 关闭模态框
				this.createModel = false
				this.$message({
					message: msg + '成功',
					type: 'success'
				});
			},
			// 修改状态
			changeStatus(item){
				// 请求服务端修改状态
				item.status = !item.status
				this.$message({
					message: item.status ? '启用' : '禁用',
					type: 'success'
				});
			},
			// 删除单个
			deleteItem(scope){
				this.$confirm('是否要删除该等级?', '提示', {
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
			// 清空筛选条件
			clearSearch(){
				this.search = {
					keyword:"",
					group_id:"",
					time:"",
				}
				this.$refs.buttonSearch[this.tabIndex].closeSuperSearch()
			},
			// 搜索事件
			searchEvent(e = false){
				// 简单搜索
				if (typeof e === 'string') {
					return console.log('简单搜索',e);
				}
				// 高级搜索
				console.log('搜索事件');
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

<style>
</style>
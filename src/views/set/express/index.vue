  <template>
  <div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
    <el-tabs v-model="activeName">
        <el-tab-pane label="运费模板" name="second">
        <div>
          <el-button type="primary" size="mini" @click="openModal(false)">添加模板</el-button>
        </div>
        <el-table border class="mt-3"
          :data="tableData"
          style="width: 100%">
          <el-table-column
          align="center"
          label="模板名称"
          prop="name">
          </el-table-column>
          <el-table-column
          align="center"
          width="250"
          label="计费方式">
          <template slot-scope="scope">
            {{ scope.row.type | formatType }}
          </template>
          </el-table-column>
          <el-table-column
          prop="order"
          align="center"
          label="排序">
          </el-table-column>
          <el-table-column
          align="center"
          label="操作"
          width="250">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="openModal(scope.$index)">修改</el-button>
            <el-button type="text" size="mini" @click='openDrawer(scope.row)'>配置模板({{scope.row.express_values.length}})</el-button>
            <el-button type="text" size="mini" @click="deleteItem(scope.row)">删除</el-button>
          </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
        <el-tab-pane label="物流跟踪" name="third">
        <el-form ref="form" :model="form" label-width="160px">
          <el-form-item label="快递100 Customer">
						<el-input v-model="form.customer" size="mini" style="width: 50%;" placeholder="快递100 Customer"></el-input>
						<small class="text-secondary d-block">用于查询物流信息，<a href="#">快递100申请</a></small>
					</el-form-item>
					<el-form-item label="快递100 Key">
						<el-input v-model="form.key" size="mini" style="width: 50%;" placeholder="快递100 Key"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="mini">保存</el-button>
					</el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>
		
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
    
		
		<el-dialog title="添加模板" :visible.sync="createModal" top="5vh">
			<!-- 表单内容 -->
			<el-form ref="form" :model="modal" label-width="80px">
				<el-form-item label="模板名称" prop="name">
					<el-input v-model="modal.name" placeholder="模板名称" size="mini" style="width: 25%;"></el-input>
				</el-form-item>
				<el-form-item label="排序" prop="level">
					<el-input type="number" v-model="modal.order" placeholder="排序" size="mini" style="width: 25%;"></el-input>
				</el-form-item>
				<el-form-item label="是否启用">
					<el-radio-group v-model="modal.type" size="mini">
						<el-radio :label="1" border>按重量</el-radio>
						<el-radio :label="0" border>按件数</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			
			
			<div slot="footer" class="dialog-footer">
				<el-button @click="createModal = false">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</div>
		</el-dialog>
		
		
    <el-drawer size="70%"
      :visible.sync="drawer"
      :with-header="false">
      <div class="p-3">
        <el-table border class="mt-3"
          :data="express_values"
          style="width: 100%">
        <el-table-column
        align="center"
        label="ID"
        prop="id">
        </el-table-column>
          <el-table-column
          align="center"
          label="可配送区域"
          width="200">
				<template slot-scope="scope">
					<el-cascader size="mini"
              :options="options"
              :props="props"
              collapse-tags
              clearable
              v-model="scope.row.region"
              @change="change(scope.row)"></el-cascader>
        </template>
          </el-table-column>
          <el-table-column
          align="center"
          width="130"
          label="首件(个)/首重(Kg)">
          <template slot-scope="scope">
            <el-input type="number" size="mini" v-model="scope.row.first" @change="change(scope.row)"></el-input>
          </template>
          </el-table-column>
				<el-table-column
				align="center"
				width="130"
				label="运费(元)">
				<template slot-scope="scope">
					<el-input type="number" size="mini" v-model="scope.row.first_price" @change="change(scope.row)"></el-input>
				</template>
				</el-table-column>
				<el-table-column
				align="center"
				width="130"
				label="续件/续重">
				<template slot-scope="scope">
					<el-input type="number" size="mini" v-model="scope.row.add" @change="change(scope.row)"></el-input>
				</template>
				</el-table-column>
				<el-table-column
				align="center"
				width="150"
				label="续费(元)">
				<template slot-scope="scope">
					<el-input type="number" size="mini" v-model="scope.row.add_price" @change="change(scope.row)"></el-input>
				</template>
				</el-table-column>
          <el-table-column
          align="center"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="deleteValue(scope.row, scope.$index)">删除</el-button>
          </template>
          </el-table-column>
        </el-table>
        
        <el-button type="primary" class="mt-3" @click="addValue">添加策略</el-button>
      </div>
		</el-drawer>
		
	</div>
</template>

<script>
	import common from '@/common/mixins/common.js';
	export default {
		inject:['app','layout'],
		mixins:[common],
		data() {
			return {
				drawer:false,
				
				preUrl:"express",
				
				activeName:"second",
				tableData: [],
				form: {
					customer:"",
					key:""
				},
				
				createModal:false,
				modal:{
					name:"",
					order:50,
					type:0
				},
				modalIndex:-1,
				
				express_values:[],
				
				drawerId:0,
				props: { 
          multiple: true,
          label:"name",
          value:"name"
        },
        options: []// 地区选择
			}
		},
		filters: {
			formatType(value) {
				let arr = ['按件数','按重量']
				return arr[value];
			}
		},
		methods: {
			getListResult(e) {
        this.tableData = e.list
        this.options = e.area.map(item => {
          item.children = item.citys.map(v => {
            v.children = v.districts
            return v
          })
          return item
        })
			},
			openModal(index){
				// 新增
				if(index === false){
					this.modal = {
						name:"",
						order:50,
						type:0
					}
					this.modalIndex = -1
					return this.createModal = true
				}
				// 修改
				let item = this.tableData[index]
				this.modal = {
					name:item.name,
					order:item.order,
					type:item.type
				}
				this.modalIndex = index
				this.createModal = true
      },
      // 添加、修改模板
			submit(){
				let id = 0
				if(this.modalIndex !== -1){
					id = this.tableData[this.modalIndex].id
				}
				this.addOrEdit(this.modal,id)
				this.createModal = false
      },
      // 打开配置模板
			openDrawer(item){
				this.express_values = item.express_values
        this.drawer = true
        this.drawerId = item.id
      },
      // 添加运费模板策略
      addValue(){
        this.axios.post('/admin/express_value',{
          first:0,
          first_price:0,
          add:0,
          add_price:0,
          express_id:this.drawerId,
          region:[
            ['全国','所有']
          ]
        },{
          token:true
        }).then((res) => {
          let data = res.data.data
          this.express_values.push(data)
        })
      },
      deleteValue(item, index){
        this.axios.post('/admin/express_value/'+item.id+'/delete',{},{
          token:true
        }).then(() => {
          this.express_values.splice(index,1)
          this.$message({
            type:"success",
            message:"删除成功"
          })
        })
      },
      change(item){
        this.axios.post('/admin/express_value/'+item.id,item,{
          token:true
        }).then(() => {
          
        })
      }
		},
	}
</script>
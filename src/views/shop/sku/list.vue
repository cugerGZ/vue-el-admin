<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
    <!-- 搜索栏 -->
    <div class="pt-3">
      <el-button size="mini" type="success" @click="openModel(false)">添加规格</el-button>
      <el-button size="mini" type="danger" @click="deleteAll">批量删除</el-button>
    </div> 
    
    <!-- 商品列表 -->
    <el-table border class="mt-3" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="45" align="center">

      </el-table-column>
      <el-table-column prop="name" label="规格名称">
        
      </el-table-column>
      <el-table-column align="center" prop="value" label="规格值" width="380">

      </el-table-column>
      <el-table-column align="center" prop="order" label="排序">

      </el-table-column>
      <el-table-column align="center" prop="status" label="状态">
        <template slot-scope="scope">
          <el-button :type="scope.row.status ? 'success' : 'danger'" size="mini" plain @click="changeStatus(scope.row)">{{scope.row.status ? '启用': '禁用'}}</el-button>
        </template>
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

    <!-- 新增/修改规格 -->
    <el-dialog title="添加规格" :visible.sync="createModel" width="50%" top="8vh">
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入规格名称" size="mini" style="width:40%"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.order" placeholder="请输入序号" size="mini" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status" size="mini">
            <el-radio :label="1" border>启用</el-radio>
            <el-radio :label="0" border>禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="form.type" size="mini">
            <el-radio :label="0" border>文字</el-radio>
            <el-radio :label="1" border>颜色</el-radio>
            <el-radio :label="2" border>图片</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="规格值" prop="value">
          <el-input type="textarea" :rows="5" placeholder="一行为一个规格项，多个规格项用换行输入" v-model="form.value"></el-input>
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
export default {
  data(){
    return {
      currentPage:1,
      tableData: [{
        id:1,
        name:"颜色1",
        value: "棕色，蓝色",
        order:50,
        status:1, // 1为启用，2为禁用
        type:1
      },{
        id:2,
        name:"颜色2",
        value: "棕色，蓝色",
        order:50,
        status:1, // 1为启用，2为禁用
        type:1
      },{
        id:3,
        name:"颜色3",
        value: "棕色，蓝色",
        order:50,
        status:1, // 1为启用，2为禁用
        type:1
      },{
        id:4,
        name:"颜色4",
        value: "棕色，蓝色",
        order:50,
        status:1, // 1为启用，2为禁用
        type:1
      }],
      multipleSelection:[], // 选中的项
      createModel: false,
      form: {
        name:"",
        order: 50,
        status: 1,
        type: 0,
        value:""
      },
      //表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入规格名称', trigger: 'blur' },
        ],
        value: [
          { required: true, message: '请输入规格值', trigger: 'blur' },
        ],
      },
      //正在编辑的索引值
      editIndex:-1,
    }
  },
  mounted(){
    
  },
  methods:{
    // 修改状态
    changeStatus(item){
      item.status = !item.status
      this.$message({
        message: item.status ? '禁用成功':'启用成功',
        type: 'success' 
      })
    },
    // 选中
    handleSelectionChange(val){
      this.multipleSelection = val;
    },
    // 添加规格
    submit(){
      this.$refs.form.validate(res => {
        if(res){
          this.form.value = this.form.value.replace(/\n/g, '，')
          if(this.editIndex === -1){
            this.tableData.unshift(this.form)
            this.$message({
              message: '添加成功',
              type: 'success' 
            })
          }else{
            let item = this.tableData[this.editIndex]
            item.name = this.form.name
            item.order = this.form.order
            item.status= this.form.status
            item.type = this.form.type
            item.value = this.form.value
            this.$message({
              message: '修改成功',
              type: 'success' 
            })
          }
          this.createModel = false
        }
      })
    },
    // 打开添加弹窗
    openModel(e = false){
      // 增加
      if(!e){
        this.form = {
          name:"",
          order: 50,
          status: 1,
          type: 0,
          value:""
        }
        this.editIndex = -1 
      }else{
        //修改
        this.form = {
          name: e.row.name,
          order: e.row.order,
          status: e.row.status,
          type: e.row.type,
          value: e.row.value.replace(/，/g , '\n')
        }
        this.editIndex = e.$index
      }
      
      
      this.createModel = true
    },
    //删除单个规格
    deleteItem(scope){
      this.$confirm('是否删除该规格?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData.splice(scope.$index, 1)
        this.$message({
          message: '删除成功',
          type: 'success' 
        })
      })
    },
    // 批量删除
    deleteAll(){
      this.$confirm('是否删除选中规格?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.multipleSelection.forEach( item => {
          let index = this.tableData.findIndex(v => v.id === item.id)
          if(index !== -1){
            this.tableData.splice(index,1)
          }
        })
        this.multipleSelection = []
        this.$message({
          message: '删除成功',
          type: 'success' 
        })
      })
    },
  }
}
</script>
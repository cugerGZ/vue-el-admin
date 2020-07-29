<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
    <!-- 操作栏 -->
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
      <el-table-column align="center" prop="default" label="规格值" width="380">

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
            <el-button type="danger" size="mini" plain @click="deleteItem(scope.row)">删除</el-button>
          </el-button-group>
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
    <el-dialog :title="editIndex > -1 ? '修改规格':'添加规格'" :visible.sync="createModel" width="50%" top="8vh">
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
        <el-form-item label="规格值" prop="default">
          <el-input type="textarea" :rows="5" placeholder="一行为一个规格项，多个规格项用换行输入" v-model="form.default"></el-input>
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
import common from '../../../common/mixins/common.js'
export default {
  inject:['layout'],
  mixins:[common],
  data(){
    return {
      preUrl:'skus',
      tableData: [],
      createModel: false,
      form: {
        name:"",
        order: 50,
        status: 1,
        type: 0,
        default:""
      },
      //表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入规格名称', trigger: 'blur' },
        ],
        default: [
          { required: true, message: '请输入规格值', trigger: 'blur' },
        ],
      },
      //正在编辑的索引值
      editIndex:-1,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 处理列表结果
    getListResult(data) {
        this.tableData = data.list
    },
    
    // 添加、修改规格
    submit(){
      this.$refs.form.validate(res => {
        if(res){
          this.form.default = this.form.default.replace(/\n/g, ',')
          if(this.editIndex === -1){
            this.addOrEdit(this.form)
          }else{ // 修改规格
            let item = this.tableData[this.editIndex]
            this.addOrEdit(this.form, item.id)
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
          default:""
        }
        this.editIndex = -1 
      }else{
        //修改
        this.form = {
          name: e.row.name,
          order: e.row.order,
          status: e.row.status,
          type: e.row.type,
          default: e.row.default.replace(/,/g , '\n')
        }
        this.editIndex = e.$index
      }
      
      
      this.createModel = true
    }
  }
}
</script>
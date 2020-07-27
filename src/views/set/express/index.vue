<template>
  <div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
    <el-tabs v-model="activeName">
      
      <!-- 运费模板 -->
      <el-tab-pane label="运费模板" name="second">
        <div>
          <el-button size="mini" type="primary">添加模板</el-button>
        </div>
        <el-table border class="mt-3" :data="tableData" style="width: 100%">
          <!-- 模板名称-->
          <el-table-column align="center" label="模板名称" prop="name"></el-table-column>
          <!-- 计费方式 -->
          <el-table-column align="center" label="计费方式">
            <template slot-scope="scope">
              {{ scope.row.type | formatType }}
            </template>
          </el-table-column>
          <!-- 排序 -->
          <el-table-column align="center" label="排序" prop="order"></el-table-column>
          <!-- 添加时间 -->
          <el-table-column align="center" label="添加时间" prop="create_time"> </el-table-column>
          <!-- 状态 -->
          <el-table-column prop="status" align="center" label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column align="center" label="操作">
            <template>
              <el-button size="mini" type="text" >修改</el-button>
              <el-button size="mini" type="text" >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 物流跟踪 -->
      <el-tab-pane label="物流跟踪" name="third">
        <el-form ref="form" :model="form" label-width="150px"> 
          <el-form-item label="快递100 Customer">
            <el-input size="mini" style="width:50%" v-model="form.customer"></el-input>
						<small class="text-secondary d-block">用于查询物流信息，<a href="#">快递100申请</a></small>
          </el-form-item>
          <el-form-item label="快递100 Key">
            <el-input size="mini" style="width:50%" v-model="form.key"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>


<script>
export default {
  data(){
    return {
      form:{
        key:"",
        customer:""
      },
      activeName:"second",
      tableData: [{
        name:"全国统一邮费",
        type:1,
        create_time:"2019-07-17 16:29:32",
        status:1,
        order:100
      }],
    }
  },
  filters: {
    formatType(value) {
      let arr = ['按重量','按件数']
      return arr[value];
    }
  }
}
</script>
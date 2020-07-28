<template>
  <div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
    <el-tabs v-model="activeName">
      
      <!-- 管理员列表 -->
      <el-tab-pane label="管理员列表" name="first">
        <div class="d-flex align-items-center">
          <el-button size="mini" type="primary">添加管理员</el-button>
          <div class="ml-auto">
            <el-input v-model="keyword" style="width:200px" size="mini" placeholder="请输入用户名"></el-input>
            <el-button type="info" size="mini" class="ml-2">搜索</el-button>
          </div>
        </div>
        <el-table border class="mt-3" :data="managerList" style="width: 100%">
          <!-- 用户头像-->
          <el-table-column align="center" label="用户头像">
            <template slot-scope="scope">
              <el-avatar size="large" :src="scope.row.avatar"></el-avatar>
            </template>
          </el-table-column>
          <!-- 登录账号 -->
          <el-table-column align="center" label="登录账号" prop="username"></el-table-column>
          <!-- 手机号 -->
          <el-table-column align="center" label="手机号" prop="phone"></el-table-column>
          <!-- 邮箱 -->
          <el-table-column align="center" label="邮箱" prop="email" width="200px"> </el-table-column>
          <!-- 所属用户组 -->
          <el-table-column align="center" label="所属用户组" prop="group.name" width="100"> </el-table-column>
          <!-- 状态 -->
          <el-table-column prop="status" align="center" label="状态" width="100">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column align="center" label="操作" width="180px">
            <template>
              <el-button size="mini" type="text" >修改</el-button>
              <el-button size="mini" type="text" >重置密码</el-button>
              <el-button size="mini" type="text" >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 角色列表 -->
      <el-tab-pane label="角色列表" name="second">
        <div>
          <el-button size="mini" type="primary" v-auth="'添加角色'">添加角色</el-button>
        </div>
        <el-table border class="mt-3" :data="groupList" style="width: 100%">
          <!-- 角色名称-->
          <el-table-column align="center" label="角色名称" prop="name"></el-table-column>
          <!-- 状态 -->
          <el-table-column prop="status" align="center" label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column align="center" label="操作" width="250px">
            <template>
              <el-button size="mini" type="text" >修改</el-button>
              <el-button size="mini" type="text" >配置权限</el-button>
              <el-button size="mini" type="text" >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 权限列表 -->
      <el-tab-pane label="权限列表" name="third">
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" default-expand-all :expand-on-click-node="false" draggable @node-drop="nodeDrop">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <div>
              <el-input v-model="data.label" size="mini" v-if="data.editStatus"></el-input>
              <span v-else>{{ node.label }}</span>
            </div>
            <span>
              <el-button size="mini" :type="data.status ? 'primary':'danger'" @click.stop="showOrHide(data)">{{data.status ? '显示' : '隐藏'}}</el-button>
              <el-button size="mini" type="success" @click="append(data)" v-auth="'添加规则'">增加</el-button>
              <el-button size="mini" :type="data.editStatus ? 'default' : 'warning'" @click="edit(data)">{{data.editStatus ? '完成' : '修改'}}</el-button>
              <el-button size="mini" type="danger" @click="remove(node, data)">删除</el-button>
            </span>
          </span>
        </el-tree>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>


<script>
export default {
  data(){
    return {
      keyword:"",
      activeName:"first",
      managerList: [{
        id:10,
        username:"用户名",
        avatar:"https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4100987808,2324741924&fm=27&gp=0.jpg",
        phone:"15648897641",
        email:"15648897641@163.com",
        group_id:1,
        group:{
          id:1,
          name:'管理员'
        },
        status:1,
      }],
      groupList: [{
        id:10,
        name:"超级管理员",
        status:1,
      }],
      data: [{
        id:1,
        label: '一级 1',
        status:1,
        editStatus:false,
        children: [{
          id:2,
          label: '二级 1-1',
          status:1,
          editStatus:false,
          children: [{
            id:31,
            label: '三级 1-1-1',
            status:1,
            editStatus:false,
            children:[]
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods:{
    handleNodeClick(data) {
      console.log(data);
    },
    // 显示或隐藏
    showOrHide(data){
      data.status =  data.status ? 0 : 1
    },
    // 编辑
    edit(data){
      data.editStatus = !data.editStatus
    },
    // 删除
    remove(node, data){
      this.$confirm('是否删除该分类?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let parent = node.parent
        let children  = parent.data.children || parent.data
        let index = children.findIndex(v => {
          return v.id = data.id
        })
        children.splice(index,1)
      })
    },
    // 增加子分类
    append(data){
      let newObj = {
            id:31,
            label: '三级 1-1-1',
            status:1,
            editStatus:true,
            children:[]
          }
      data.children.push(newObj)
    },
    // 拖拽
    nodeDrop(...options){
      console.log(options[0])
    },
  }
}
</script>
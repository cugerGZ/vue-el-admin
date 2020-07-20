<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-12 col-sm-9 col-md-7 col-lg-6  m-auto pt-5">
          <div class="card mt-5">
            <!-- 标题 -->
            <div class="card-header bg-white">
              <h3 class="text-center mb-0 text-secondary">{{$conf.logo}}</h3>
            </div>
            <!-- 表单内容 -->
            <div class="card-body">
              <el-form ref="ruleForm" :model="form" :rules="rules">
                <el-form-item prop="username">
                  <el-input size="medium" v-model="form.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input size="medium" v-model="form.password" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="medium" class="w-100" @click="submit">立即登录</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      form:{
        username: '',
        password: ''
      },
      rules:{
        username:[
          {required: true, message: "请输入用户名", trigger: "blur"}
        ],
        password:[
          {required: true, message: "请输入密码", trigger: "blur"}
        ]
      }
    }
  },
  methods: {
    submit(){
      this.$refs.ruleForm.validate((valid) => {
          if (!valid) {
            return 
          } 
          this.$router.push({name:'index'})
      })
    }
  }
}
</script>
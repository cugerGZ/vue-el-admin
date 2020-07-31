<template>
  <div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
    <el-tabs v-model="activeName">
      <!-- 注册与访问 -->
      <el-tab-pane label="注册与访问" name="first">
        <el-form ref="form" :model="form" label-width="150px"> 
          <el-form-item label="是否允许注册会员">
            <el-radio-group v-model="form.open_reg" size="mini">
              <el-radio-button :label="1">是</el-radio-button>
              <el-radio-button :label="0">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="注册类型">
            <el-radio-group v-model="form.reg_method" size="mini"> 
              <el-radio-button label="username">普通注册</el-radio-button>
              <el-radio-button label="phone">手机注册</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="密码最小长度">
            <el-input v-model="form.password_min" size="mini" type="number" style="width:30%" placeholder="请输入密码最小长度" :min="0"></el-input>
          </el-form-item>
          <el-form-item label="强制密码复杂度">
						<el-checkbox-group v-model="form.password_encrypt"
						size="mini">
              <el-checkbox-button label="0">数字</el-checkbox-button>
              <el-checkbox-button label="1">小写字母</el-checkbox-button>
              <el-checkbox-button label="2">大写字母</el-checkbox-button>
              <el-checkbox-button label="3">符号</el-checkbox-button>
						</el-checkbox-group>
					</el-form-item>
        </el-form>
      </el-tab-pane>
      <!-- 上传设置 -->
      <el-tab-pane label="上传设置" name="second">
        <el-form ref="form" :model="form" label-width="150px"> 
          <el-form-item label="默认上传方式">
            <el-radio-group v-model="form.upload_method" size="mini">
              <el-radio-button label="local">本地存储</el-radio-button>
              <el-radio-button label="oss">阿里云存储</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <template v-if="form.upload_method === 'oss'">
            <el-form-item label="Bucket">
              <el-input size="mini" style="width:30%" v-model="form.upload_config.Bucket"></el-input>
            </el-form-item>
            <el-form-item label="ACCESS_KEY">
              <el-input v-model="form.upload_config.ACCESS_KEY" size="mini"  style="width:50%"></el-input>
            </el-form-item>
            <el-form-item label="SECRET_KEY">
              <el-input v-model="form.upload_config.SECRET_KEY" size="mini"  style="width:50%"></el-input>
            </el-form-item>
            <el-form-item label="空间域名">
              <el-input v-model="form.upload_config.http" size="mini"  style="width:50%"></el-input>
              <small class="text-secondary d-block">请补全http:// 或 https://</small>
            </el-form-item>
          </template>
        </el-form>
      </el-tab-pane>
      <!-- API安全 -->
      <el-tab-pane label="API安全" name="third">
        <el-form ref="form" :model="form" label-width="150px"> 
          <el-form-item label="是否开启API安全">
            <el-radio-group v-model="form.api_safe" size="mini">
              <el-radio-button :label="1">是</el-radio-button>
              <el-radio-button :label="0">否</el-radio-button>
            </el-radio-group>
            <small class="text-secondary d-block">api安全开启之后需，调用前端api需要传输签名串</small>
          </el-form-item>
          <el-form-item label="秘钥">
            <el-input size="mini" style="width:40%" v-model="form.api_secret"></el-input>
						<small class="text-secondary d-block">秘钥设置关系系统中api调用传输签名串的编码规则，以及会员token解析，请慎重设置，注意设置之后对应会员要求重新登录获取token</small>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <el-button type="primary" size="small" style="margin-left:200px; margin-bottom:20px" @click="submit">保存</el-button>

  </div>
</template>


<script>
export default {
  inject:['layout'],
  data(){
    return {
      form:{
        open_reg:1,
        reg_method:"username",
        password_min:0,
        password_encrypt:[],
        upload_method:['loacl'],
        upload_config:{
          Bucket:"",
          ACCESS_KEY:"",
          SECRET_KEY:"",
          http:"",
        },
        api_safe:1,
        api_secret:""
      },
      activeName:"first"
    }
  },
  created(){
    this.getData()
  },
  methods:{
    getData(){
      this.layout.showLoading()
      this.axios.get('/admin/sysconfig',{
        token:true
      }).then((res) => {
        this.form = res.data.data
        this.form.password_encrypt = this.form.password_encrypt.split(',')
        this.layout.hideLoading()
      }).catch(() => {
        this.layout.hideLoading()
      })
    },
    submit(){
      this.layout.showLoading()
      this.form.password_encrypt = this.form.password_encrypt.join(',')
      this.axios.post('/admin/sysconfig',this.form,{
        token:true
      }).then((res) => {
        this.form = res.data.data
        this.getData()
        this.layout.hideLoading()
        this.$message({
          type:"success",
          message:"保存成功"
        })
      }).catch(() => {
        this.layout.hideLoading()
      })
    }
  }
}
</script>
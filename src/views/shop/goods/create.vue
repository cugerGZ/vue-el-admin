<template>
	<div class="bg-white px-3 py-3 goods_create" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
		<router-link :to="{name:'shop_goods_list'}" style="position: absolute;top: 12px;left: 200px;">
			<el-button size="mini">回到商品列表</el-button>
		</router-link>
		
		
		<el-form ref="form" label-width="100px">
			<el-form-item label="商品名称">
				<el-input v-model="form.title" 
				placeholder="请输入商品名称，不能超过60个字符" 
				class="w-50"></el-input>
      </el-form-item>
      <el-form-item label="封面">
        <div>
          <span v-if="!form.cover" class="btn btn-light border mr-2"
            @click="chooseImage">
            <i class="el-icon-plus"></i>
          </span>
          <img v-else :src="form.cover" class="rounded" style="width: 45px;height: 45px;cursor: pointer;" @click="chooseImage"/>
        </div>
      </el-form-item>
      <el-form-item label="商品分类">
          <el-select v-model="form.category_id"
          placeholder="请选择商品分类">
          <el-option :label="item | tree" v-for="(item,index) in cates" :key="index"
          :value="item.id"></el-option>
          </el-select>
			</el-form-item>
			<el-form-item label="商品描述">
				<el-input  type="textarea" v-model="form.desc"  placeholder="选填，商品卖点简述，例如：此款商品美观大方 性价比较高 不容错过" class="w-50"></el-input>
			</el-form-item>
			<el-form-item label="商品单位">
				<el-input v-model="form.unit" placeholder="请输入商品单位" class="w-50"></el-input>
			</el-form-item>
			<el-form-item label="总库存">
				<el-input type="number" v-model="form.stock"
				class="w-25">
					<template slot="append">件</template>
				</el-input>
			</el-form-item>
			<el-form-item label="库存预警">
				<el-input type="number" v-model="form.min_stock" class="w-25">
					<template slot="append">件</template>
				</el-input>
			</el-form-item>
			<el-form-item label="最低销售价">
				<el-input type="number" v-model="form.min_price" class="w-25">
					<template slot="append">元</template>
				</el-input>
			</el-form-item>
			<el-form-item label="最低原价">
				<el-input type="number" v-model="form.min_oprice" class="w-25">
					<template slot="append">元</template>
				</el-input>
			</el-form-item>
			<el-form-item label="库存显示">
				<el-radio-group v-model="form.stock_display" >
					<el-radio :label="1" border>是</el-radio>
					<el-radio :label="0" border>否</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="是否上架">
				<el-radio-group v-model="form.status" >
					<el-radio :label="0" border>放入仓库</el-radio>
					<el-radio :label="1" border>立即上架</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="运费模板">
				<el-select v-model="form.express_id" 
				placeholder="请选择运费模板">
					<el-option :label="item.name" v-for="(item,index) in express" :key="index"
					:value="item.id"></el-option>
				</el-select>
			</el-form-item>
		</el-form>
		
    <div class="d-flex">
      <el-button type="primary" class="ml-auto mr-3 mt-3" @click="submit">{{this.id? '确认' : '发布商品'}}</el-button>
    </div>
	</div>
</template>

<script>
	export default {
		inject:['app', 'layout'],
		data() {
			return {
				cates:[],
				express:[],
				form:{
					title:"",
					category_id:"",
					cover:"",
					desc:"",
					unit:"",
					stock:"",
					min_stock:"",
					ischeck:0,
					status:0,
					stock_display:0,
					express_id:"",
					min_price:"",
					min_oprice:"",
        },
        id:0
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
		created(){
      this.id = this.$route.params.id
      if(this.id){
        // 获取商品信息
        this.layout.showLoading()
        this.axios.get('/admin/goods/read/'+this.id,{
          token:true
        }).then((res) => {
					let data =res.data.data
          this.form = data
          this.layout.hideLoading()
        }).catch(() =>{
          this.layout.hideLoading()
        })
      }
      
      
			this.axios.get('/admin/goods/create',{
				token:true
			}).then(res=>{
				let data = res.data.data
				this.cates = data.cates
				this.express = data.express.list
			})
		},
		methods: {
			chooseImage(){
				this.app.chooseImage((res)=>{
					this.form.cover = res[0].url
				},1)
      },
      submit(){
        this.layout.showLoading()
        let url = this.id ? '/admin/goods/'+this.id : '/admin/goods'
        this.axios.post(url,this.form,{
          token: true
        }).then(() => {
          this.$message({
              message: this.id ? '修改成功':'发布成功',
              type: 'success'
          });
          this.layout.hideLoading()
          this.$router.push({
            name:'shop_goods_list'
          })
        }).catch(() => {
          this.layout.hideLoading()
        })
      }
    },
	}
</script>
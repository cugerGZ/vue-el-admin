<template>
	<div class="bg-white px-3 py-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
		<router-link :to="{name:'shop_goods_list'}" style="position: absolute;top: 12px;left: 200px;">
			<el-button size="mini">回到商品列表</el-button>
		</router-link>
		
		<!-- 规格选项 -->
		<el-form ref="form" label-width="80px">
			<el-form-item label="商品规格">
				<el-radio-group :value="skus_type" 
				@input="vModel('skus_type',$event)" 
				size="medium">
					<el-radio-button :label="0">
						单一规格</el-radio-button>
					<el-radio-button :label="1">
						多规格</el-radio-button>
				</el-radio-group>
			</el-form-item>
		</el-form>
		
		<!-- 单规格 -->
		<template v-if="skus_type === 0">
			<el-form ref="form" label-width="80px">
				<el-form-item label="市场价格">
					<el-input type="number" v-model="sku_value.oprice" class="w-25">
						<template slot="append">元</template>
					</el-input>
				</el-form-item>
				<el-form-item label="销售价格">
					<el-input type="number" v-model="sku_value.pprice" class="w-25">
						<template slot="append">元</template>
					</el-input>
				</el-form-item>
				<el-form-item label="成本价格">
					<el-input type="number" v-model="sku_value.cprice" class="w-25">
						<template slot="append">元</template>
					</el-input>
				</el-form-item>
				<el-form-item label="商品重量">
					<el-input type="number" v-model="sku_value.weight" class="w-25">
						<template slot="append">公斤</template>
					</el-input>
				</el-form-item>
				<el-form-item label="商品体积">
					<el-input type="number" v-model="sku_value.volume" class="w-25">
						<template slot="append">立方米</template>
					</el-input>
				</el-form-item>
			</el-form>
		</template>
		<!-- 多规格 -->
		<template v-else>
			<!-- 规格卡片 -->
			<el-form ref="form" label-width="80px">
				<el-form-item label="添加规格">
					<sku-card v-for="(item,index) in sku_card" 
					:key="index" :item="item" :index="index"
					:total="skuCardTotal"></sku-card>
					<el-button type="success"
					size="mini" @click="addSkuCardEvent">添加规格</el-button>
				</el-form-item>
			</el-form>
			<el-form ref="form" label-width="80px">
				<el-form-item label="批量设置">
					<template v-if="!updateAllStatus">
						<el-button type="text"
						v-for="(btn,btnIndex) in updateList"
						:key="btnIndex"
						@click="openUpdateAllStatus(btn)"
						>{{btn.name}}</el-button>
					</template>
					<div v-else class="d-flex align-items-center">
						<el-input size="small" style="width: 150px;" class="mr-2" type="number" v-model="UpdateAllValue" :placeholder="UpdateAllPlaceholder"></el-input>
						<el-button type="primary" size="mini"
						@click="UpdateAllSubmit">设置</el-button>
						<el-button size="mini" @click="closeUpdateAllStatus">取消</el-button>
					</div>
					
				</el-form-item>
				<el-form-item label="规格设置">
					<sku-table ref="table"></sku-table>
				</el-form-item>
			</el-form>
		</template>
		
		<el-button type="primary" style="position: fixed;bottom: 50px;right: 50px;" @click="submit">提交</el-button>
		
	</div>
</template>

<script>
	import {mapState,mapMutations} from "vuex"
	
	import skuCard from '@/components/shop/create/sku/sku-card.vue';
	import skuTable from '@/components/shop/create/sku/sku-table.vue';
	
	export default {
		inject:['app','layout'],
		components: {
			skuCard,
			skuTable,
		},
		data() {
			return {
				id:0,
				sku_value:{
					oprice:0,
					pprice:0,
					cprice:0,
					weight:0,
					volume:0
				},
				// 批量修改
				updateList:[{
					name:"销售价",
					key:"pprice"
				},{
					name:"市场价",
					key:"oprice"
				},{
					name:"成本价",
					key:"cprice"
				},{
					name:"库存",
					key:"stock"
				},{
					name:"体积",
					key:"volume"
				},{
					name:"重量",
					key:"weight"
				}],
				updateAllStatus:false,
				UpdateAllPlaceholder:"",
				UpdateAllValue:""
			}
		},
		computed: {
			...mapState({
				skus_type:state=>state.goods_create.skus_type,
				sku_card:state=>state.goods_create.sku_card,
			}),
			// 规格卡片总数
			skuCardTotal(){
				return this.sku_card.length
			}
		},
		created() {
			this.id = this.$route.params.id
			if (!this.id) {
				this.$message({
					type:"error",
					message:"非法参数"
				})
				return this.$router.push({
					name:"shop_goods_list"
				})
			}
			// 获取之前的商品详情
			this.layout.showLoading()
			let defaultVal = ['属性值','#FFFFFF','/favicon.ico'];
			this.axios.get('/admin/goods/read/'+this.id,{
				token:true
			}).then(res=>{
				let data = res.data.data
				this.vModel('sku_card',data.goodsSkusCard.map(item=>{
					item.list = item.goodsSkusCardValue
					item.list.map(v=>{
						v.text = item.type === 0 ? v.value : defaultVal[0]
						v.color = item.type === 1 ? v.value : defaultVal[1]
						v.image = item.type === 2 ? v.value : defaultVal[2]
						return v
					})
					return item
				}))
				this.vModel('skus_type',data.sku_type)
				this.sku_value = data.sku_value ? data.sku_value : {
					oprice:0,
					pprice:0,
					cprice:0,
					weight:0,
					volume:0
				},
				this.$nextTick(()=>{
					if(this.$refs.table){
						this.$refs.table.list = data.goodsSkus
					}
				})
				
				this.layout.hideLoading()
			}).catch(()=>{
				this.layout.hideLoading()
			})
		},
		methods: {
			...mapMutations(['vModelState','addSkuCard','vModelGoodsAttrs']),
			addSkuCardEvent(){
				this.layout.showLoading()
				this.axios.post('/admin/goods_skus_card',{
					goods_id:this.id,
					name:"规格名称",
					order:50,
					type:0
				},{ token:true }).then(res=>{
					let data = res.data.data
					data.list = []
					this.addSkuCard(data)
					this.layout.hideLoading()
				}).catch(()=>{
					this.layout.hideLoading()
				})
			},
			// 修改表单的值
			vModel(key,value){
				this.vModelState({ key,value })
			},
			// 修改批量设置状态
			openUpdateAllStatus(item){
				this.updateAllStatus = item.key
				this.UpdateAllPlaceholder = item.name
			},
			// 取消批量设置状态
			closeUpdateAllStatus(){
				this.updateAllStatus = false
				this.UpdateAllValue = ""
			},
			// 提交批量设置
			UpdateAllSubmit(){
				this.$refs.table.list.forEach(item=>{
					item[this.updateAllStatus] = this.UpdateAllValue
				})
				this.closeUpdateAllStatus()
			},
			submit(){
				let list = []
				if(this.$refs.table){
					list = this.$refs.table.list.map(item=>{
						item.goods_id = this.id
						return item
					})
				}
				this.layout.showLoading()
				this.axios.post('/admin/goods/updateskus/'+this.id,{
					sku_type:this.skus_type,
					sku_value:this.sku_value,
					goodsSkus:list
				},{ token:true }).then(()=>{
					this.$message({
						type:"success",
						message:"修改成功"
					})
					this.$router.push({
						name:"shop_goods_list"
					})
					this.layout.hideLoading()
				}).catch(()=>{
					this.layout.hideLoading()
				})
			}
		},
	}
</script>
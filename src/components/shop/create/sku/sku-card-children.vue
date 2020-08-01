<template>
	<div class="border py-1 px-2 rounded mr-2 position-relative d-flex align-items-center">
		<div v-if="type != 0">
			<!-- 颜色选择器 -->
			<el-color-picker size="mini" :value="item.color"
			v-if="type === 1" @change="onColorChange"></el-color-picker>
			<!-- 图片选择 -->
			<template v-else>
				<span v-if="!item.image" class="btn btn-light border mr-2" @click="chooseImage">
					<i class="el-icon-plus"></i>
				</span>
				<img v-else :src="item.image" class="rounded" style="width: 45px;height: 45px;cursor: pointer;" @click="chooseImage"/>
			</template>
			
		</div>
		
		<input v-if="type === 0" :value="item.text" @input="inputChange" class="form-control text-center border-0" style="width: 80px;font-size: 15px;" />
		<!-- 删除 -->
		<span class="btn btn-light p-0 position-absolute" 
		style="line-height: 1;right: -10px;top: -10px;"
		@click="delSkuValueEvent">
			<i class="el-icon-circle-close"></i>
		</span>
	</div>
</template>

<script>
	import {mapMutations} from "vuex"
	export default {
		inject:['app','layout'],
		props: {
			type: {
				type: Number,
				default: 0
			},
			item:Object,
			index:Number,
			cardIndex:Number,
		},
		watch:{
			type(newVal){
				let keys = ['text','color','image']
				let defaultVal = ['属性值','#FFFFFF','/favicon.ico'];
				this.item.value = this.item[keys[newVal]] ? this.item[keys[newVal]] : defaultVal[newVal]
				this.updateSkuValueEvent()
			}
		},
		methods: {
			...mapMutations(['delSkuValue','updateSkuValue']),
			delSkuValueEvent(){
				this.layout.showLoading()
				this.axios.post('/admin/goods_skus_card_value/'+this.item.id+'/delete',{},{ token:true }).then(()=>{
					this.delSkuValue({
						cardIndex:this.cardIndex,
						valueIndex:this.index
					})
					this.layout.hideLoading()
				}).catch(()=>{
					this.layout.hideLoading()
				})
			},
			updateSkuValueEvent(){
				let keys = ['text','color','image']
				this.item.value = this.item[keys[this.type]]
				this.axios.post('/admin/goods_skus_card_value/'+this.item.id,this.item,{
					token:true
				})
			},
			inputChange(e){
				this.vModel('text',e.target.value)
			},
			vModel(key,value){
				this.updateSkuValue({
					cardIndex:this.cardIndex,
					valueIndex:this.index,
					key,
					value
				})
				this.updateSkuValueEvent()
			},
			// 选择图片
			chooseImage(){
				this.app.chooseImage((res)=>{
					this.vModel('image',res[0].url)
				},1)
			},
			// 监听颜色选择器
			onColorChange(e){
				this.vModel('color',e)
			}
		},
	}
</script>

<style>
</style>

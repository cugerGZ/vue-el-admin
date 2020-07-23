<template>
	<table class="table table-sm table-bordered">
    <thead>
        <tr>
          <th scope="col" class="text-center" style="vertical-align: middle;" v-for="(th,thi) in tableThs" :key="thi" :rowspan="th.rowspan" :colspan="th.colspan">{{th.name}}</th>
        </tr>
        <tr>
          <th scope="col" class="text-center"  style="vertical-align: middle;" v-for="(th,thi) in skuLabels" :key="thi" rowspan="1" colspan="1">{{th.name}}</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="(item,index) in list" :key="index">
          <th scope="row" v-for="(sku,skuI) in item.skus" :key="skuI" class="text-center">{{sku.name}}</th>
          <td class="text-center" width="100">
            <span class="btn btn-light" @click="chooseImage(item)" v-if="!item.image">
              <i class="el-icon-plus"></i>
            </span>
            <img :src="item.image" v-else style="width:40px;height:40px;cursor:pointer" class="rounded" @click="chooseImage">
          </td>
          <td class="text-center" width="100">
            <input type="number" v-model="item.pprice" class="form-control text-center">
          </td>
          <td class="text-center" width="100">
            <input type="number" v-model="item.oprice" class="form-control text-center">
          </td>
          <td class="text-center" width="100">
            <input type="number" v-model="item.cprice" class="form-control text-center">
          </td>
          <td class="text-center" width="100">
            <input type="number" v-model="item.stock" class="form-control text-center">
          </td>
          <td class="text-center" width="100">
            <input type="number" v-model="item.volume" class="form-control text-center">
          </td>
          <td class="text-center" width="100">
            <input type="number" v-model="item.weight" class="form-control text-center">
          </td>
          <td class="text-center" width="100">
            <input type="text" v-model="item.code" class="form-control text-center">
          </td>
        </tr>
      </tbody>
	</table>
</template>

<script>
import {mapGetters,mapState} from 'vuex'
export default {
  inject:['app'],
  data(){
    return {
      list:[]
    }
  },
  computed:{
    ...mapGetters([
      'tableThs',
      'tableData',
      'skuLabels'
    ]),
    ...mapState({
      'sku_card': state => state.goods_create.sku_card
    })
  },
  watch:{
    tableData(newValue){
      this.list = newValue
    }
  },
  mounted(){
    this.list = this.tableData
  },
  methods:{
    chooseImage(item){
      this.app.chooseImage((res) => {
        item.image = res[0].url
      },1)
    }
  }
}
</script>
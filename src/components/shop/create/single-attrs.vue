<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="市场价格">
        <el-input placeholder="请输入市场价格" class="w-50"  type="number" @input="vModel('oprice', $event )" :value="oprice">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="销售价格">
        <el-input placeholder="请输入销售价格" class="w-50"  type="number" @input="vModel('pprice', $event )" :value="pprice">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="成本价格">
        <el-input placeholder="请输入成本价格" class="w-50"  type="number" @input="vModel('cprice', $event )" :value="cprice">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="商品重量">
        <el-input placeholder="请输入商品重量" class="w-50"  type="number" @input="vModel('weight', $event )" :value="weight">
          <template slot="append">千克</template>
        </el-input>
      </el-form-item>
      <el-form-item label="商品体积">
        <el-input placeholder="请输入商品体积" class="w-50"  type="number" @input="vModel('volume', $event )" :value="volume">
          <template slot="append">立方米</template>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
export default {
  computed:{
    ...mapState({
      oprice:state => state.goods_create.oprice,  
      pprice:state => state.goods_create.pprice,  
      cprice:state => state.goods_create.cprice,  
      weight:state => state.goods_create.weight,  
      volume:state => state.goods_create.volume,  
    })
  },
  methods:{
    ...mapMutations(['vModelState']),
    // 修改表单的值
    vModel(key, value){
      this.vModelState({key, value})
    }
  }
}
</script>

<template>
  <div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
    <el-tabs v-model="activeName">
      
      <!-- 支付设置 -->
      <el-tab-pane label="运费模板" name="second">
        <div>
          <el-button size="mini" type="primary">添加模板</el-button>
        </div>
        <el-table border class="mt-3" :data="tableData" style="width: 100%">
          <!-- 支付方式-->
          <el-table-column label="支付方式" align="left">
            <template slot-scope="scope">
              <div class="d-flex align-items-center">
                <img :src="scope.row.src" style="width:50px;height:50px" class="rounded mr-2">
                <div>
                  <h6>{{scope.row.name}}</h6>
                  <small class="d-block text-secondary">{{scope.row.desc}}</small>
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column align="center" label="操作" width="150px">
            <template>
              <el-button size="mini" type="text" >配置</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 购物设置 -->
      <el-tab-pane label="购物设置" name="third">
        <el-form ref="form" label-width="160px">
					<el-form-item label="未支付订单">
						<el-input type="number" size="mini" style="width: 40%;" placeholder="未支付订单">
							<template slot="append">天后自动关闭</template>
						</el-input>
						<small class="text-secondary d-block">订单下单未付款，n天后自动关闭，设置0天不自动关闭</small>
					</el-form-item>
					<el-form-item label="已发货订单">
						<el-input type="number" size="mini" style="width: 40%;" placeholder="已发货订单">
							<template slot="append">天后自动确认收货</template>
						</el-input>
						<small class="text-secondary d-block">如果在期间未确认收货，系统自动完成收货，设置0天不自动收货</small>
					</el-form-item>
					<el-form-item label="已完成订单">
						<el-input type="number" size="mini" style="width: 40%;" placeholder="已完成订单">
							<template slot="append">天内允许申请售后</template>
						</el-input>
						<small class="text-secondary d-block">订单完成后 ，用户在n天内可以发起售后申请，设置0天不允许申请售后</small>
					</el-form-item>
					<el-form-item label="运费组合策略">
						<el-select placeholder="请选择运费组合策略" size="mini">
							<el-option label="区域一" value="shanghai"></el-option>
							<el-option label="区域二" value="beijing"></el-option>
						</el-select>
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
      activeName:"second",
      tableData: [{
					name:"银联卡支付",
					desc:"该系统支持即时到账接口",
					src:"http://wxcs.niuteam.cn/addons/NsUnionPay/ico.png"
				},{
					name:"支付宝支付",
					desc:"该系统支持即时到账接口",
					src:"http://wxcs.niuteam.cn/addons/NsAlipay/ico.png"
				},{
					name:"微信支付",
					desc:"该系统支持微信网页支付和扫码支付",
					src:"http://wxcs.niuteam.cn/addons/NsWeixinpay/ico.png"
				}],
    }
  }
}
</script>
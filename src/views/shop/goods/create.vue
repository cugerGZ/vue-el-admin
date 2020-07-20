<template>
  <div class="bg-white px-3 good_create" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
    <router-link :to="{name:'shop_goods_list'}" style="position:absolute; top:13px; left:180px">
      <el-button size="mini">返回商品列表</el-button>
    </router-link>
    <el-tabs v-model="tabIndex" @tab-click="handleClick">
      <el-tab-pane label="基础设置">
        <el-form ref="form" label-width="80px">
          <el-form-item label="商品名称">
            <el-input placeholder="请输入商品名称，不能超过60个字符" class="w-50" @input="vModel('title', $event )" :value="title"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader @input="vModel('category', $event )" :value="category" :options="options"></el-cascader>
          </el-form-item>
          <el-form-item label="商品描述">
            <el-input placeholder="选填，商品卖点简述，例如:此款商品美观大方性价比较高不容错过" class="w-50" @input="vModel('desc', $event )" :value="desc" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="商品单位">
            <el-input placeholder="请输入商品单位" class="w-50" @input="vModel('unit', $event )" :value="unit"></el-input>
          </el-form-item>
          <el-form-item label="总库存">
            <el-input  class="w-25" @input="vModel('stock', $event )" :value="stock" type="number">
              <template slot="append">件</template>
            </el-input>
          </el-form-item>
          <el-form-item label="库存预警">
            <el-input  class="w-25" @input="vModel('min_stock', $event )" :value="min_stock" type="number">
              <template slot="append">件</template>
            </el-input>
          </el-form-item>
          <el-form-item label="库存显示">
            <el-radio-group @input="vModel('display_stock', $event )" :value="display_stock">
              <el-radio :label="0" border>是</el-radio>
              <el-radio :label="1" border>否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否上架">
            <el-radio-group @input="vModel('status', $event )" :value="status">
              <el-radio :label="0" border>放入仓库</el-radio>
              <el-radio :label="1" border>立即上架</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="运费模板">
            <el-select @input="vModel('express', $event )" :value="express">
              <el-option label="区域一" v-model="tabIndex"></el-option>
              <el-option label="区域二" v-model="tabIndex"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品规格">
        <el-form label-width="80px">
          <el-form-item label="商品规格">
            <el-radio-group :value="skus_type" size="medium" @input="vModel('skus_type', $event )">
              <el-radio-button :label="0" border>单规格</el-radio-button>
              <el-radio-button :label="1" border>多规格</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <!-- 单规格 -->
        <template v-if="skus_type===0">
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
        </template>
        <!-- 多规格 -->
        <template v-if="skus_type===1">
          <el-form ref="form" label-width="80px">
            <el-form-item label="添加规格">
              <div class="card" style="line-height:1.2">
                <div class="card-header d-flex align-items-center" >
                  规格项：
                  <el-input size="mini" style="width:200px">
                    <el-button slot="append" icon="el-icon-more"></el-button>
                  </el-input>
                  <el-radio-group size="mini" style="margin-bottom:-10px" class="ml-2">
                    <el-radio :label="0">无</el-radio>
                    <el-radio :label="1">颜色</el-radio>
                    <el-radio :label="2">图片</el-radio>
                  </el-radio-group>
                  <el-button icon="el-icon-top" size="mini" class="ml-auto"></el-button>
                  <el-button icon="el-icon-bottom" size="mini"></el-button>
                  <el-button size="mini" type="text">删除</el-button>
                </div>
                <div class="card-body">
                  <div>
                    <el-button size="mini" type="text" icon="el-icon-plus">增加规格值</el-button>
                  </div>
                </div>
              </div>
              <el-button size="mini" type="success" class="mt-3">添加规格</el-button>
            </el-form-item>
            <el-form-item label="批量设置">
              <el-button type="text">销售价</el-button>
              <el-button type="text">成本价</el-button>
              <el-button type="text">市场价</el-button>
              <el-button type="text">库存</el-button>
              <el-button type="text">体积</el-button>
              <el-button type="text">重量</el-button>
            </el-form-item>
            <el-form-item label="规格设置">
              
            </el-form-item>
          </el-form>
        </template>
      </el-tab-pane>
      <el-tab-pane label="商品属性"></el-tab-pane>
      <el-tab-pane label="媒体设置"></el-tab-pane>
      <el-tab-pane label="商品详情"></el-tab-pane>
      <el-tab-pane label="折扣设置"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
export default {
  data(){
    return {
      tabIndex: 0,
      options: [{
          value: 'zhinan',
          label: '指南',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }, {
              value: 'fankui',
              label: '反馈'
            }, {
              value: 'xiaolv',
              label: '效率'
            }, {
              value: 'kekong',
              label: '可控'
            }]
          }, {
            value: 'daohang',
            label: '导航',
            children: [{
              value: 'cexiangdaohang',
              label: '侧向导航'
            }, {
              value: 'dingbudaohang',
              label: '顶部导航'
            }]
          }]
        }, {
          value: 'zujian',
          label: '组件',
          children: [{
            value: 'basic',
            label: 'Basic',
            children: [{
              value: 'layout',
              label: 'Layout 布局'
            }, {
              value: 'color',
              label: 'Color 色彩'
            }, {
              value: 'typography',
              label: 'Typography 字体'
            }, {
              value: 'icon',
              label: 'Icon 图标'
            }, {
              value: 'button',
              label: 'Button 按钮'
            }]
          }, {
            value: 'form',
            label: 'Form',
            children: [{
              value: 'radio',
              label: 'Radio 单选框'
            }, {
              value: 'checkbox',
              label: 'Checkbox 多选框'
            }, {
              value: 'input',
              label: 'Input 输入框'
            }, {
              value: 'input-number',
              label: 'InputNumber 计数器'
            }, {
              value: 'select',
              label: 'Select 选择器'
            }, {
              value: 'cascader',
              label: 'Cascader 级联选择器'
            }, {
              value: 'switch',
              label: 'Switch 开关'
            }, {
              value: 'slider',
              label: 'Slider 滑块'
            }, {
              value: 'time-picker',
              label: 'TimePicker 时间选择器'
            }, {
              value: 'date-picker',
              label: 'DatePicker 日期选择器'
            }, {
              value: 'datetime-picker',
              label: 'DateTimePicker 日期时间选择器'
            }, {
              value: 'upload',
              label: 'Upload 上传'
            }, {
              value: 'rate',
              label: 'Rate 评分'
            }, {
              value: 'form',
              label: 'Form 表单'
            }]
          }, {
            value: 'data',
            label: 'Data',
            children: [{
              value: 'table',
              label: 'Table 表格'
            }, {
              value: 'tag',
              label: 'Tag 标签'
            }, {
              value: 'progress',
              label: 'Progress 进度条'
            }, {
              value: 'tree',
              label: 'Tree 树形控件'
            }, {
              value: 'pagination',
              label: 'Pagination 分页'
            }, {
              value: 'badge',
              label: 'Badge 标记'
            }]
          }, {
            value: 'notice',
            label: 'Notice',
            children: [{
              value: 'alert',
              label: 'Alert 警告'
            }, {
              value: 'loading',
              label: 'Loading 加载'
            }, {
              value: 'message',
              label: 'Message 消息提示'
            }, {
              value: 'message-box',
              label: 'MessageBox 弹框'
            }, {
              value: 'notification',
              label: 'Notification 通知'
            }]
          }, {
            value: 'navigation',
            label: 'Navigation',
            children: [{
              value: 'menu',
              label: 'NavMenu 导航菜单'
            }, {
              value: 'tabs',
              label: 'Tabs 标签页'
            }, {
              value: 'breadcrumb',
              label: 'Breadcrumb 面包屑'
            }, {
              value: 'dropdown',
              label: 'Dropdown 下拉菜单'
            }, {
              value: 'steps',
              label: 'Steps 步骤条'
            }]
          }, {
            value: 'others',
            label: 'Others',
            children: [{
              value: 'dialog',
              label: 'Dialog 对话框'
            }, {
              value: 'tooltip',
              label: 'Tooltip 文字提示'
            }, {
              value: 'popover',
              label: 'Popover 弹出框'
            }, {
              value: 'card',
              label: 'Card 卡片'
            }, {
              value: 'carousel',
              label: 'Carousel 走马灯'
            }, {
              value: 'collapse',
              label: 'Collapse 折叠面板'
            }]
          }]
        }, {
          value: 'ziyuan',
          label: '资源',
          children: [{
            value: 'axure',
            label: 'Axure Components'
          }, {
            value: 'sketch',
            label: 'Sketch Templates'
          }, {
            value: 'jiaohu',
            label: '组件交互文档'
          }]
        }]
    }
  },
  computed:{
    ...mapState({
      skus_type:state => state.goods_create.skus_type,
      title: state => state.goods_create.title,
      category: state => state.goods_create.category,
      desc:state => state.goods_create.desc,
      unit:state => state.goods_create.unit,
      stock:state => state.goods_create.stock,
      min_stock:state => state.goods_create.min_stock,
      display_stock:state => state.goods_create.display_stock,
      status:state => state.goods_create.status,
      express:state => state.goods_create.express,

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
    },
    handleClick(){

    }
  }
}
</script>

<style>
  .good_create .el-form-item{
    margin-bottom: 15px;
  }
</style>
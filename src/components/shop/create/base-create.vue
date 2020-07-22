<template>
    <div>
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
    </div>
</template>
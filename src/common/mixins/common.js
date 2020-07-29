export default {
    data() {
        return {
            preUrl: "",

            page: {
                current: 1,
                sizes: [10, 20, 50, 100],
                size: 10,
                total: 0
            },

            multipleSelection: [],
            loading: true
        }
    },
    filters: {
        numToString(value) {
            return value.toString();
        }
    },
    created() {
        this.getList()
    },
    computed: {
        // 选中记录id组成的数组
        ids() {
            return this.multipleSelection.map(item => {
                return item.id
            })
        }
    },
    methods: {
        // 处理列表结果
        // getListResult(data){

        // },
        // 显示加载
        showLoading() {
            if (this.loading) {
                this.layout.showLoading()
            }
        },
        // 隐藏加载
        hideLoading() {
            if (this.loading) {
                this.layout.hideLoading()
            }
        },
        // 获取请求列表分页url
        getListUrl() {
            return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}`
        },
        // 获取列表
        getList() {
            if (this.preUrl == '') return;
            this.showLoading()
            let url = this.getListUrl();
            this.axios.get(url, {
                token: true
            }).then(res => {
                let data = res.data.data
                this.page.total = data.totalCount

                this.getListResult(data)

                this.hideLoading()
            }).catch(() => {
                this.hideLoading()
            })
        },
        // 添加/编辑
        addOrEdit(data, id = 0) {
            this.showLoading()
            let msg = id > 0 ? '修改' : '增加'
            let url = id > 0 ? '/admin/' + this.preUrl + '/' + id : '/admin/' + this.preUrl
            this.axios.post(url, data, {
                token: true
            }).then(() => {
                this.$message({
                    message: msg + '成功',
                    type: 'success'
                });
                this.getList()
                this.hideLoading()
            }).catch(() => {
                this.hideLoading()
            })
        },
        // 批量删除url
        deleteAllUrl() {
            return '/admin/' + this.preUrl + '/delete_all'
        },
        // 批量删除
        deleteAll() {
            if (this.ids.length === 0) {
                return this.$message({
                    message: '请先选中需要删除的信息',
                    type: 'error'
                });
            }
            this.$confirm('是否要删除选中规格?', '提示', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.showLoading()
                let url = this.deleteAllUrl()
                this.axios.post(url, {
                    ids: this.ids
                }, {
                    token: true
                }).then(() => {
                    this.multipleSelection = []
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.getList()
                    this.hideLoading()
                }).catch(() => {
                    this.hideLoading()
                })
            })
        },
        // 修改状态
        changeStatus(item) {
            let status = item.status === 1 ? 0 : 1
            let msg = status === 1 ? '禁用' : '启用'
            this.showLoading()
            this.axios.post('/admin/' + this.preUrl + '/' + item.id + '/update_status', {
                status: status
            }, {
                token: true
            }).then(() => {
                item.status = status
                this.$message({
                    message: msg + '成功',
                    type: 'success'
                });
                this.hideLoading()
            }).catch(() => {
                this.hideLoading()
            })
        },
        // 删除单个
        deleteItem(item) {
            this.$confirm('是否要删除该规格?', '提示', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.showLoading()
                this.axios.post('/admin/' + this.preUrl + '/' + item.id + '/delete', {}, {
                    token: true
                }).then(() => {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.getList()
                    this.hideLoading()
                }).catch(() => {
                    this.hideLoading()
                })
            })
        },
        // 选中
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleSizeChange(val) {
            this.page.size = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.page.current = val
            this.getList()
        }
    }
}
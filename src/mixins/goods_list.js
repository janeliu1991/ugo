import wepy from 'wepy'
export default class extends wepy.mixin {
    data = {
        query: '',
        // 查询关键字
        cid: '',
        // 查询分类Id
        pagenum: 1,
        // 当前页数
        pagesize: 5,
        // 每页条数
        total: 0,
        // 数据总条数
        goodsList: [],
        // 商品列表
        totalPage: 0,
        // 总页数
        isOver: false,
        // 是否全部显示完毕
        isLoading: false
            // 是否正在加载中
    }
    onLoad(options) {
        this.query = options.query || ''
        this.cid = options.cid || ''
        this.getGoodsList()

    }
    methods = {
            goGoodDetail(id) {
                wepy.navigateTo({
                    url: '/pages/goods_detail/main?goods_id=' + id
                })
            }
        }
        // 获取商品列表
    async getGoodsList(cb) {
            this.isLoading = true
            const { data: res } = await wepy.get('/goods/search', {
                query: this.query,
                cid: this.cid,
                pagenum: this.pagenum,
                pagesize: this.pagesize
            })
            if (res.meta.status !== 200) {
                return wepy.baseToast()
            }
            this.total = res.message.total
            this.totalPage = Math.ceil(this.total / this.pagesize)
            this.goodsList = [...this.goodsList, ...res.message.goods]
            this.isLoading = false
            this.$apply()
            cb && cb()
        }
        // 触底行为
    onReachBottom() {
        // 如果正在请求数据的过程中，数据还未加载出来，不进行下次请求
        if (this.isLoading) {
            return
        }
        if (this.pagenum >= this.totalPage) {
            this.isOver = true
            return
        }
        this.pagenum++
            this.getGoodsList()
    }
    onPullDownRefresh() {
        this.goodsList = []
        this.total = 0
        this.pagenum = 1
        this.totalPage = 0
        this.isOver = false
            // 通过回调函数优化下拉刷新行为
        this.getGoodsList(() => {
            // 停止下拉刷新
            this.stopPullDownRefresh()
        })
    }
}
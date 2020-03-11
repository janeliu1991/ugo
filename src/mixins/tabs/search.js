import wepy from 'wepy'
export default class extends wepy.mixin {
    data = {
        value: '', // 搜索内容
        suggestList: [], // 搜索建议列表
        kwSearchList: [] //历史搜索列表
    }
    onLoad() {
        const kwList = wepy.getStorageSync('kw') || []
        this.kwSearchList = kwList
    }
    methods = {
            // 触发搜索
            onSearch(e) {
                const kw = e.detail.trim()
                if (kw.length <= 0) {
                    this.suggestList = []
                    return
                }
                // 跳转前把用户的搜索关键字保存到搜索记录中去
                if (this.suggestList.indexOf(kw) === -1) {
                    this.kwSearchList.unshift(kw)
                }
                // if (this.kwSearchList.length > 10) {
                //     this.kwSearchList.splice(10, this.kwSearchList.length - 10)
                // }
                this.kwSearchList = this.kwSearchList.slice(0, 10)
                wepy.setStorageSync('kw', this.kwSearchList)
                wepy.navigateTo({
                    url: '/pages/goods_list?query=' + e.detail.trim()
                })
            },

            // 取消搜索
            onCancel() {
                this.suggestList = []
            },

            // 输入框的内容发生变化
            onChange(e) { //xian
                // 获取搜索建议列表
                this.value = e.detail.trim()
                if (e.detail.trim().length <= 0) {
                    this.suggestList = []
                    return
                }
                this.getSuggestList(e.detail)
            },

            // 点击标题跳转到详情页
            goDetailPage(goodsId) {
                wepy.navigateTo({
                    url: '/pages/goods_detail/main?goods_id=' + goodsId
                })
            },
            // 跳转到商品详情页面
            goGoodsList(kw) {
                wepy.navigateTo({
                    url: '/pages/goods_list?query=' + kw
                })
            },
            // 清空历史记录
            clearHistory() {
                this.kwSearchList = []
                wepy.setStorageSync('kw', [])
            }
        }
        // 获取搜索建议列表
    async getSuggestList(searchStr) {
        const { data: res } = await wepy.get('/goods/qsearch', { query: searchStr })
        if (res.meta.status !== 200) {
            return wepy.baseToast()
        }
        this.suggestList = res.message
        this.$apply()
    }
    computed = {
        isShowHistory() {
            if (this.value.length <= 0) {
                return true
            } else {
                return false
            }
        }
    }
}
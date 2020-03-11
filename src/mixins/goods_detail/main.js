import wepy from 'wepy'
export default class extends wepy.mixin {
    data = {
        goodsInfo: {},
        active: 0,
        addressInfo: null
    }
    onLoad(options) {
        if (options && options.goods_id) {
            this.getGoodsDetail(options.goods_id)
        }
    }
    methods = {
        onChange(e) {},
        preview(cUrl) {
            wepy.previewImage({
                current: cUrl,
                // 当前显示图片的http链接
                urls: this.goodsInfo.pics.map(i => i.pics_big)
                    // 需要预览的图片http链接列表
            })
        },
        async chooseAddress() {
            const res = await wepy.chooseAddress().catch(err => err)
            if (res.errMsg !== 'chooseAddress:ok') {
                return wepy.baseToast('获取收货地址失败')
            }
            this.addressInfo = res
            wepy.setStorageSync('address', res)
            this.$apply()
        },
        addToCart() {
            this.$parent.addGoodsToCart(this.goodsInfo)
            wepy.showToast({
                title: '添加购物车成功',
                icon: 'success'
            })
        }
    }
    async getGoodsDetail(id) {
        const { data: res } = await wepy.get('/goods/detail', { goods_id: id })
        if (res.meta.status !== 200) {
            return wepy.baseToast()
        }
        this.goodsInfo = res.message
        this.$apply()

    }
    computed = {
        addressStr() {
            if (this.addressInfo === null) {
                return '请选择收货地址'
            }
            const addr = this.addressInfo
            const str = addr.provinceName + addr.cityName + addr.countyName + addr.detailInfo
            return str
        },
        cartNUm(){
            return this.$parent.globalData.selectedNum
        }
    }

}
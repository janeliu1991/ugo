import wepy from 'wepy'
export default class extends wepy.mixin {
    data = {
        swiperList: [],
        // 是否显示面板指示点
        indicatorDots: false,
        // 自动播放
        autoplay: true,
        // 自动切换事件间隔
        interval: 3000,
        // 滑动动画时长
        duration: 600,
        // 是否无缝衔接
        circular: true,
        // 分类列表
        cateList: [],
        floorList: []
    }

    onLoad() {
        this.getSwiperImage()
        this.getCateItems()
        this.getfloor()
    }

    methods = {
        getGoodsList(url) {
            wepy.navigateTo({
                url
            })
        }
    }

    // 获取轮播图列表
    async getSwiperImage() {
        const { data: res } = await wepy.get('/home/swiperdata')
        console.log(res.message)
        if (res.meta.status !== 200) {
            return wepy.baseToast()
        }
        this.swiperList = res.message
        this.$apply()
    }

    // 获取首页分类
    async getCateItems() {
        const { data: res } = await wepy.get('/home/catitems')
        if (res.meta.status !== 200) {
            return wepy.baseToast()
        }
        // console.log(res)
        this.cateList = res.message
        this.$apply()
    }

    // 获取楼层数据
    async getfloor() {
        const { data: res } = await wepy.get('/home/floordata')
        if (res.meta.status !== 200) {
            return wepy.baseToast()
        }
        // console.log(res.message)
        this.floorList = res.message
        this.$apply()
    }
}
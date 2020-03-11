import wepy from 'wepy'
export default class extends wepy.mixin {
    data = {
        cateList: [],
        secondData: [],
        active: 0,
        windowHeight: 0
    }
    methods = {
        onChange(e) {
            console.log(e.detail);
            this.secondData = this.cateList[e.detail].children
        },
        //点击跳转到商品分类列表页面
        goGoodList(cid) {
            wepy.navigateTo({
                url: '/pages/goods_list?cid=' + cid
            })
        }
    }
    onLoad() {
        this.getCateList()
        this.getWindownHeight()
    }
    async getCateList() {
        const { data: res } = await wepy.get('/categories')
        console.log(res);
        if (res.meta.status !== 200) {
            return wepy.baseToast()
        }
        this.cateList = res.message
        this.secondData = res.message[0].children
        this.$apply()
    }
    async getWindownHeight() {
        const res = await wepy.getSystemInfo()
        if (res.errMsg === 'getSystemInfo:ok') {
            this.windowHeight = res.windowHeight
            this.$apply()
        }
        // console.log(res.screenHeight);

    }

}
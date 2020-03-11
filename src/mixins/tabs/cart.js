import wepy from 'wepy'
export default class extends wepy.mixin {
    data = {
        cartData: [],
        totalPrice: 0
    }
    onLoad () {
        this.cartData = this.$parent.globalData.cart
    }
    methods = {
        onChangeCount (e) {
            let count = e.detail
            let id = e.target.dataset.id
            this.$parent.updateGoodsCount(id, count)
            this.$apply()
        },
        onChangeChecked (e) {
            let isChecked = e.detail
            let id = e.target.dataset.id
            this.$parent.changeGoodsChecked(id, isChecked)
            this.$apply()
        },
        deleteGoods (id) {
            this.$parent.deleteCartGoods(id)
            this.$apply()
        },
        changeCheckedAll(e){
            this.$parent.changeCheckedAll(e.detail)
            this.$apply()
        },
        onSubmitOrder(){
            if(this.$parent.globalData.selectedNum<=0){
                return wepy.baseToast('选中商品不能为空')
            }
            wepy.navigateTo({
                url:'/pages/order'
            })
        }
    }
    computed = {
        isEmpty () {
            if (this.cartData.length <= 0) {
                return true
            } else {
                return false
            }
        },
        totalPrice () {
            let total = 0
            for (let item of this.cartData) {
                if (item.isChecked) {
                    total=total+ Number(item.goods_price * item.goods_acount)
                }
            }
            return total * 100
        },
        isCheckedAll () {
            let flag=true
            for(let item of this.cartData){
                if(item.isChecked===false){
                    flag=false
                    break
                }
            }
            if(flag){
                return true
            }else {
                return false
            }
        }
    }
}
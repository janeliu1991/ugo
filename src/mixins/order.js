import wepy from 'wepy'
export default class extends wepy.mixin {
  data = {
    addressInfo: null,
    selectGoods: [],
    isLogin:false
  }
  onLoad () {
    // 读取收货地址
    this.addressInfo = wepy.getStorageSync('address') || null
    // 从购物车列表中将勾选的商品过滤出来
    const newArr = this.$parent.globalData.cart.filter(x => x.isChecked === true)
    this.selectGoods = newArr
  }
  methods = {
    // 选择收货地址
    async chooseAddress () {
      const res = await wepy.chooseAddress().catch(err => err)
      if (res.errMsg !== "chooseAddress:ok") {
        return
      }
      this.addressInfo = res
      wepy.setStorageSync('address', res)
      // 强制页面重新渲染
      this.$apply()
    },
    // 获取用户登录信息，调起微信的登录开发能力
    async getUserInfo(userInfo){
      if(userInfo.detail.errMsg!=='getUserInfo:ok'){
        return wepy.baseToast('获取用户信息失败')
      }
      // 获取用户登录凭证
      const loginRes= await wepy.login()
      if(loginRes.errMsg!=='login:ok'){
        return wepy.baseToast('微信登录失败')
      }
      const loginParams={
        code:loginRes.code,
        encryptedData:userInfo.detail.encryptedData,
        iv:userInfo.detail.iv,
        rawData:userInfo.detail.rawData,
        signature:userInfo.detail.signature
      }
      console.log(loginParams)      
      // 发起登录请求，换区登录成功之后的token值
      const {data:res}= await wepy.post('/users/wxlogin',loginParams)
      console.log(res)
      if(res.meta.status!==200){
        return wepy.baseToast('微信登录失败')
      }
      wepy.setStorageSync('token',res.meta.token)
      this.isLogin=true
      this.$apply()
    },
    // 支付订单
    async onSubmit(){
      if(this.totalAmount<=0){
        return wepy.baseToast('订单金额不能为0')
      }
      if(this.addressStr.length<=0){
        return wepy.baseToast('请选择收货地址')
      }
      // 创建订单
      const {data:createRes}=await wepy.post('/my/orders/create',{
        order_price:0.01,
        // order_price:totalAmount/100,
        consignee_addr:this.addressStr,
        order_detail:JSON.stringify(this.selectGoods),
        goods:this.selectGoods.map(x=>{
          return {
            goods_id:x.goods_id,
            goods_number:x.goods_acount,
            goods_price:x.goods_price
          }
        })
      })
      console.log(createRes)      
      if(createRes.meta.status!==200){
        return wepy.baseToast('创建订单失败')
      }
      // 创建订单成功
      const orderInfo=createRes.message
      // 生成预支付订单
      const {data:orderRes}= await wepy.post('/my/orders/req_unifiedorder',{order_number:orderInfo.order_number})
      if(orderRes.meta.status!==200){
        return wepy.baseToast('生成预支付订单失败')
      }
      // 走支付流程
      // 掉微信支付api
      const payRes=await wepy.requestPayment(orderRes.message.pay).catch(err=>err)
      if(payRes.errMsg==='requestPament:fail cancel'){
        return wepy.baseToast('您已经取消了支付')
      }
      // 用户完成支付过程
      // 订单支付状态查询
      const {data:payStatus}= await wepy.post('/my/orders/chkOrder',{order_number:orderInfo.order_number})
      if(payStatus.meta.status!==200){
        return wepy.baseToast('订单支付失败')
      }
      // 提示用户支付成功
      wepy.showToast({title:'支付成功'})
      // 跳转到订单列表页面
      wepy.navigateTo({
        url:'pages/orderList'
      })
    }
  }
  computed = {
    isHaveAddress () {
      if (this.addressInfo === null) {
        return false
      } else {
        return true
      }
    },
    addressStr () {
      if (this.addressInfo === null) {
        return ''
      }
      return this.addressInfo.provinceName + this.addressInfo.cityName + this.addressInfo.countyName + this.addressInfo.detailInfo
    },
    totalAmount(){
      let num=0
      for(let item of this.selectGoods){
        num +=item.goods_price*item.goods_acount
      }
      return num*100
    }
  }
}
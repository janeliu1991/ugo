import wepy from 'wepy'
export default class extends wepy.mixin {
  data={
    active:0, // 被激活的标签索引
    // allOrderList:[],
    // waitorderList:[],
    // finishOederList:[],
    // statusTitle:['全部','待付款','已付款'],
    orderStatuLsit:[{title:'全部',type:1,list:[]},{title:'待付款',type:2,list:[]},{title:'已付款',type:3,list:[]}]
  }
  onload(){
    this.getOrderList(this.active)
  }
  methods={
    // 切换标签页
    tabChange(e){
      console.log(e)
      this.active=e.detail.index
      this.getOrderList(this.active)
    }
  }
  async getOrderList(index){
    const {data:res}=await wepy.get('/my/orders/all',{type:index+1})
    console.log(res)
    if(res.meta.status!==200){
      return wepy.baseToast('获取订单列表失败')
    }
    res.message.orders.forEach(x=>(x.order_detail=JSON.parse(x.order_detail)))
    if(index===0||index===1||index===2){
      this.orderStatuLsit[index].list=res.message.orders
    }else {
      wepy.baseToast('订单类型错误')
    }
  }
}

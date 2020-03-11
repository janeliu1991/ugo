import wepy from 'wepy'
const baseURL = 'https://www.zhengzhicheng.cn/api/public/v1'

// 弹框提示一个无图标的消息 str代表提示文本，如果没有str   提供一个默认值
wepy.baseToast = function(str = '获取数据失败') {
    wepy.showToast({
        title: str,
        // 弹框期间不携带任何图标
        icon: 'none',
        // 弹框多久后隐藏
        duration: 1500
    })
}

// 封装get请求
wepy.get = function(url, data = {}) {
    return wepy.request({
        url: baseURL + url,
        method: 'get',
        data
    })
}

// 封装post请求
wepy.post = function(url, data = {}) {
    return wepy.request({
        url: baseURL + url,
        method: 'post',
        data
    })
}
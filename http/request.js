let store = require('../common/store')
let system = store.getSystemInfo();

const clientInfo = {
  'clientType': 'Mp',
  'appnm': 'MincoEdu',
  'model': system.model,
  'os': system.system,
  'screen': system.screenWidth + '*' + system.screenHeight,
  'version': App.version,
  'channel': 'MiniProgram'
}

module.exports = {
  fetch: (url, data = {}, option = {}) => {
    let {
      loading = true, toast = true, isMock = false, method = 'get'
    } = option

    return new Promise((resolve, reject) => {
      if (loading) {
        wx.showLoading({
          title: '加载中...',
          mask: true
        })
      }

      let env = isMock ? App.config.mockApi : App.config.baseApi
      wx.request({
        url: env + url,
        data,
        method,
        header: {
          'clientInfo': JSON.stringify(clientInfo)
        },
        success: function (res) {
          // res: {data: {…}, header: {…}, statusCode: 200, cookies: Array(1), errMsg: "request:ok"}
          if (res.data.code == 200) {
            if (loading) {
              wx.hideLoading();
            }
            resolve(res.data)
          } else {
            if (toast) {
              wx.showToast({
                mask: true,
                title: res.data.message,
                icon: 'none'
              })
            } else {
              wx.hideLoading();
            }
            reject(res)
          }
        },
        fail: function (err) {
          wx.showToast({
            title: err.errMsg,
            icon: 'none'
          })
          reject(err)
        }
      })

    })
  },
}

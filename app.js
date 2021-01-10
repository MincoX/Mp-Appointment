let config = require('./env.js')
let Api = require('./http/api.js')
let Store = require('./common/store')
let request = require('./http/request.js')

// let router = require('./utils/router.js')

let env = 'pro';
App.version = '1.0.0';
// App.config.env = env;
App.config = config[env];
App.config.mockApi = config.mockApi;

App({
  Api,
  config: config[env],
  get: request.fetch,
  // router,
  // post: (url, data, option) => {
  //   option.method = 'post';
  //   return request.fetch(url, data, option);
  // },
  onLaunch: function () {
    wx.login({
      success(res) {
        if (res.code) {
          request.fetch(Api.getSession, {
            code: res.code
          }).then(res => {
            if (res.data.env == 'dev') {
              Store.setItem('openId', res.data.openid)
              wx.redirectTo({
                url: "/pages/menuList/index"
              })
            } else {
              Store.setItem('openId', res.data.openid)
            }

          }).catch(err => {
            wx.showToast({
              mask: true,
              title: '网络繁忙，请稍后重试',
              icon: 'none',
              duration: 1000
            })
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
const app = getApp()

let Api = require('../../http/api')
let Store = require('../../common/store')

Page({
  data: {
    motto: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      }),

      this.data.userInfo.openId = Store.getItem('openId')
      app.get(Api.saveUserinfo, {
        userInfo: this.data.userInfo
      }, {
        'method': 'post'
      }).then(res => {
        wx.navigateTo({
          url: '../information/index'
        })
      }).catch(err => {
        wx.showToast({
          mask: true,
          title: '网络繁忙，请稍后重试',
          icon: 'none'
        })
      })
  }
})
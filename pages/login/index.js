const app = getApp()
let Api = require('../../http/api')


Page({

  data: {
    account: 'MincoX',
    pwd: '123456'
  },

  onLoad: function (options) {

  },


  login: function () {
    var account = this.data.account
    var pwd = this.data.pwd

    if (account == "" || pwd == "") {

      wx.showToast({
        mask: true,
        title: '请填写账号和密码',
        icon: 'none'
      })

    } else {
      app.get(Api.adminLogin, {
        account: this.data.account,
        pwd: this.data.pwd,
      }, {
        'method': 'post'
      }).then(res => {

        if (res.code == 200) {
          wx.redirectTo({
            url: "/pages/list/index"
          })
        } else {
          wx.showToast({
            mask: true,
            title: res.data.msg,
            icon: 'none'
          })
        }

      }).catch(err => {
        wx.showToast({
          mask: true,
          title: '网络不稳定，请稍后重试',
          icon: 'none'
        })
      })
    }

  }

})
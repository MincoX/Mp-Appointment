const app = getApp()

let store = require('../../common/store')
let Api = require('../../http/api')

Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    filterType: 0, // 0：申请成功列表 1：审核通过列表 2：审核失败列表 
    userList: [],
    baseApi: app.config['baseApi'],

    login: false,
    appoint: null,
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  onLoad: function () {
    this.sysInit()
    this.getTabList()
    this.setData({
      login: app.globalData.login,
    })
  },

  sysInit: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },

  saveUserInfo: function () {
    app.get(Api.saveUserinfo, {
      userInfo: this.data.userInfo
    }, {
      'method': 'post'
    }).then(res => {
      this.setData({
        userInfo: res.data['user_info'],
        appoint: res.data['user_info'].apply_status
      })
    }).catch(err => {
      wx.showToast({
        mask: true,
        title: '网络繁忙，请稍后重试',
        icon: 'none'
      })
    })
  },

  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    app.globalData.login = true
    
    this.data.userInfo.openId = store.getItem('openId')
    this.saveUserInfo()
    this.setData({
      login: true
    })

  },

  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        filterType: e.target.dataset.current
      })
      that.getTabList()
    }
  },

  getTabList: function () {
    var that = this
    app.get(Api.getUsers, {
      filterType: this.data.filterType,
    }, {
      'method': 'get'
    }).then(res => {
      that.setData({
        userList: res.data
      })
    }).catch(err => {
      wx.showToast({
        mask: true,
        title: '网络繁忙，请稍后重试',
        icon: 'none'
      })
    })
  },

  auditUser: function (event) {
    var that = this
    var item = event.currentTarget.dataset.item
    var operate = event.currentTarget.dataset.operate
    var content = operate == 1 ? '确定要下发此用户？' : '确定拒绝下发此用户?'
    wx.showModal({
      title: '用户审核',
      content: content,
      showCancel: true, //是否显示取消按钮
      // cancelText: "取消", //默认是“取消”
      // cancelColor: 'skyblue', //取消文字的颜色
      // confirmText: "确定", //默认是“确定”
      // confirmColor: 'skyblue', //确定文字的颜色
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          app.get(Api.auditUser, {
            openId: item.openId,
            operate: operate,
          }, {
            'method': 'post'
          }).then(res => {
            if (res.status) {
              wx.showToast({
                mask: true,
                title: res.msg,
                icon: 'none',
                duration: 1000,
                success: () => {
                  setTimeout(() => {
                    that.onLoad()
                  }, 1000)
                }
              })
            } else {
              wx.showToast({
                mask: true,
                title: res.msg,
                icon: 'none',
                duration: 1000,
              })
            }
          }).catch(err => {
            wx.showToast({
              mask: true,
              title: '网络繁忙，请稍后重试',
              icon: 'none'
            })
          })
        }
      },
      //模态框调用失败的回调函数
      fail: function (res) {},
      //模态框调用结束的回调函数（调用成功、失败都会执行）
      complete: function (res) {},
    })
  }
})
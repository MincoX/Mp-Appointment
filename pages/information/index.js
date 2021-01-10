const app = getApp()

let util = require('../../utils/util.js')
let store = require('../../common/store')
let Api = require('../../http/api')

const date = new Date();
const years = [];
const months = [];
const days = [];

for (let i = 2018; i <= date.getFullYear() + 5; i++) {
  years.push("" + i);
}
for (let i = 1; i <= 12; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  months.push("" + i);
}
for (let i = 1; i <= 31; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  days.push("" + i);
}


Page({
  data: {
    name: '',
    gender: 0,
    mail: '',
    phoneNum: '',
    idNum: '666888666888666888',
    chooseYear: '',
    faceUploaded: false,
    multiIndex: [0, 9, 16, 10, 17],
    multiArray: [years, months, days],
    applyDate: (util.addZern(date.getMonth() + 1)) + "/" + util.addZern(date.getDate()),
  },

  onLoad: function (options) {
    this.setData({
      chooseYear: this.data.multiArray[0][0]
    })
  },

  chooseImageTap: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#00000",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })
  },

  chooseWxImage: function (type) {
    var that = this;
    var imgsPaths = that.data.imgs;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        that.upImgs(res.tempFilePaths[0], 0) //调用上传方法
      }
    })
  },

  upImgs: function (imgurl, index) {
    var that = this;
    wx.uploadFile({
      url: App.config['baseApi'] + Api.uploadAvatar,
      filePath: imgurl,
      name: 'uploadAvatar',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: {
        'openId': store.getItem('openId')
      },

      success: function (res) {
        var res = JSON.parse(res.data)
        if (!res.data.face_path) {
          wx.showToast({
            mask: true,
            title: res.msg,
            icon: 'none'
          })
        } else {
          wx.showToast({
            mask: true,
            title: '人脸图片上传成功',
            icon: 'none',
          })
          that.setData({
            facePath: App.config['baseApi'] + '/' + res.data.face_path,
            faceUploaded: true
          })
        }

      }
    })
  },

  radioChange(e) {
    this.setData({
      gender: e.detail.value
    })
  },
  checkName: function () {
    if (this.data.name.length == 0) {
      wx.showToast({
        mask: true,
        title: '姓名不能为空',
        icon: 'none'
      })
      return false
    } else {
      return true
    }

  },
  checkPhoneNum: function () {
    let str = /^1\d{10}$/
    if (str.test(this.data.phoneNum)) {
      return true
    } else {
      wx.showToast({
        mask: true,
        title: '手机号不正确',
        icon: 'none'
      })
      return false
    }

  },
  checkEmail: function () {
    let str = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
    if (str.test(this.data.mail)) {
      return true
    } else {
      wx.showToast({
        mask: true,
        title: '请填写正确的邮箱号',
        icon: 'none'
      })
      return false
    }
  },
  checkIdNum: function () {
    let str = /\d{10}$/
    if (str.test(this.data.idNum)) {
      return true
    } else {
      wx.showToast({
        mask: true,
        title: '身份证号输入有误',
        icon: 'none'
      })
      return false
    }
  },
  loginBtnClick: function () {

    if (this.data.name.length == 0 || this.data.phone.length == 0) {

      this.setData({

        infoMess: '温馨提示：用户名和密码不能为空！',

      })

    } else {

      this.setData({

        infoMess: '',

        name: '用户名：' + this.data.userN,

        phone: '密码：' + this.data.passW

      })

    }

  },

  submitApply: function () {
    var that = this
    var name = this.data.name
    var mail = this.data.mail
    var phoneNum = this.data.phoneNum
    var idNum = this.data.idNum
    var applyDate = this.data.applyDate

    if (!this.data.faceUploaded) {
      wx.showToast({
        mask: true,
        title: '请先上传人脸图片',
        icon: 'none'
      })

      return false
    }

    if (name == "" || mail == "" || phoneNum == "" || idNum == "" || applyDate == "") {

      wx.showToast({
        mask: true,
        title: '请填写完整信息',
        icon: 'none'
      })

    } else {
      app.get(Api.submitApply, {
        openId: store.getItem('openId'),
        name: name,
        gender: this.data.gender,
        mail: mail,
        phoneNum: phoneNum,
        idNum: idNum,
        applyDate: applyDate,
      }, {
        'method': 'post'
      }).then(res => {
        wx.showToast({
          mask: true,
          title: res.msg,
          icon: 'none',
          duration: 2000,
          success: function () {
            setTimeout(function () {
              that.onLoad()
            }, 2000)
          }
        })
      }).catch(err => {
        wx.showToast({
          mask: true,
          title: '网络繁忙，请稍后重试',
          icon: 'none'
        })
      })
    }
  },

  bindMultiPickerChange: function (e) {
    this.setData({
      multiIndex: e.detail.value
    })
    const index = this.data.multiIndex;
    const year = this.data.multiArray[0][index[0]];
    const month = this.data.multiArray[1][index[1]];
    const day = this.data.multiArray[2][index[2]];

    if (new Date(year + '-' + month + '-' + day + ' ' + 23 + ':' + 59 + ':' + 59).getTime() < date.getTime()) {

      wx.showToast({
        title: '所选时间已过期',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    this.setData({
      applyDate: util.addZern(month) + '/' + util.addZern(day)
    })

  },
  bindMultiPickerColumnChange: function (e) {
    //获取年份
    if (e.detail.column == 0) {
      let chooseYear = this.data.multiArray[e.detail.column][e.detail.value];
      this.setData({
        chooseYear
      })
    }
    if (e.detail.column == 1) {
      let num = parseInt(this.data.multiArray[e.detail.column][e.detail.value]);
      let temp = [];
      if (num == 1 || num == 3 || num == 5 || num == 7 || num == 8 || num == 10 || num == 12) { //判断31天的月份
        for (let i = 1; i <= 31; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 4 || num == 6 || num == 9 || num == 11) { //判断30天的月份
        for (let i = 1; i <= 30; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 2) { //判断2月份天数
        let year = parseInt(this.data.chooseYear);
        if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
          for (let i = 1; i <= 29; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        } else {
          for (let i = 1; i <= 28; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        }
      }
    }
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },

})
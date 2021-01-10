/**
 * Storage 通用文件存储管理
 */

module.exports = {
  setItem(key, value, moduleName) {
    if (moduleName) {
      let moduleNameInfo = this.getItem(moduleName)
      moduleNameInfo[key] = value
      wx.setStorageSync(moduleName, moduleNameInfo)
    } else {
      wx.setStorageSync(key, value)
    }
  },
  getItem(key, moduleName) {
    if (moduleName) {
      let val = this.getItem(moduleName)
      if (val) return val[key]
      return ''
    } else {
      return wx.getStorageSync(key)
    }
  },
  clear(key) {
    key ? wx.removeStorageSync(key) : wx.clearStorageSync()
  },
  getSystemInfo() {
    return wx.getStorageInfoSync()
  }
}
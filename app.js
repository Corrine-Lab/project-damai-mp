// app.js
import event from '@codesmiths/event'

App({
  onLaunch() {
    const _this = this

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        _this.login( res.code )
      }
    })
  },

  // 发送登录请求
  login( code ) {
    const _this = this

    wx.request({
      url: 'http://localhost:4000/api/v1/session/login',
      method: 'POST',
      data: { code },
      success( res ) {
        if ( res.statusCode === 200 ) {
          // 登录成功，存储返回的用户信息和token
          console.log( 'login' )
          _this.globalData.user = res.data.data
          _this.globalData.token = `Bearer ${ res.data.token }`
          event.emit( 'tokenReady' )
        } else {
          // 登录失败，进行提示
          wx.showToast( { title: '登录失败，请重新登录!' } )
        }
      }
    })
  },

  globalData: {
    user: null,
    token: null
  }
})

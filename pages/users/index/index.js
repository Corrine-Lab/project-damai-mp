// pages/users/index/index.js
import { getUserInfo } from '../../../api/index'

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
      wx.setNavigationBarTitle( { title: '个人信息' } )
      this.fetchUserInfo()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },

    // 获取用户信息
    async fetchUserInfo() {
      wx.showLoading( { title: '正在加载中...' } )
      const { data } = await getUserInfo()
      
      wx.hideLoading()
      this.setData( { user: data } )
    },

    // 跳转至“我的档案”页面
    navigateToInfo() {
      wx.navigateTo( { url: '/pages/users/edit/index' } )
    },

    // 跳转至“我的关注”页面
    navigateToFollowing() {
      wx.navigateTo( { url: '/pages/followings/index/index' } )
    }, 

    // 跳转至“演出历史”页面
    navigateToBookingHistory() {
      wx.navigateTo( { url: '/pages/bookings/index/index' } )
    },

    // 跳转至“演出管理”页面
    navigateToShowManagement() {
      wx.navigateTo( { url: '/pages/shows/management/index' } )
    },
})
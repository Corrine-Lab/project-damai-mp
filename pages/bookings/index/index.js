// pages/bookings/index/index.js
import { checkShowExpired } from '../../../utils/util'
import { getBookedShows } from '../../../api/index'

Page({

    /**
     * 页面的初始数据
     */
    data: {
      index: 0,
      isMenuShow: false,
      category: [ '近期热演', '往期演出' ]
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
      wx.setNavigationBarTitle( { title: '演出历史' } )
      this.fetchBookedShows()
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

    // 点击显示下拉列表
    selectTaps( e ) {
      this.setData( { isMenuShow: !this.data.isMenuShow } );
    },

    // 选中下拉列表选项
    optionTaps(e) {
      const index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
      this.setData( { index, isMenuShow: !this.data.isMenuShow } );
    },

    // 获取参与的演出
    async fetchBookedShows() {
      wx.showLoading( { title: '正在加载中...' } )
      const { data } = await getBookedShows()
      const { upcomingShows, expiredShows } = checkShowExpired( data )

      wx.hideLoading()
      this.setData( { upcomingShows, expiredShows } )
    },

    // 跳转至（未过期）演出详情页
    navigateToUpcomingDetail( e ) {
      const { id } = e.currentTarget.dataset
      wx.navigateTo( { url: `/pages/shows/show/index?id=${ id }&isExpired=false` } )
    },

    // 跳转至（过期）演出详情页
    navigateToExpiredDetail( e ) {
      const { id } = e.currentTarget.dataset
      wx.navigateTo( { url: `/pages/shows/show/index?id=${ id }&isExpired=true` } )
    }
})
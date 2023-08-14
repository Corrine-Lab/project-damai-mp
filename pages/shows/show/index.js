// pages/shows/show/index.js
import { getShowInfo, bookShow, unBookShow } from '../../../api/index'

const { globalData } = getApp()

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
      const { id, isExpired } = options
      this.setData( { isExpired: isExpired === 'true' } )
      this.fetchShowInfo( id )
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
      wx.setNavigationBarTitle( { title: '演出详情' } )
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

    // 获取演出信息
    async fetchShowInfo( id ) {
      wx.showLoading( { title: '正在加载中...' } )

      const { data } = await getShowInfo( id )

      wx.hideLoading()
      this.setData( { show: data } )
      this.checkBookStatus( data.audiences )
    },

    // 判断订阅状态
    checkBookStatus( audiences ) {
      const userId = globalData.user._id
      const _this = this

      audiences.forEach( audience => {
        if ( audience._id === userId ) _this.setData( { isBooked: true } )
      } )
    },

    // 订阅演出
    async bookShow() {
      const showId = this.data.show._id
      await bookShow( { showId } )
      
      this.setData( { isBooked: true } )
      this.fetchShowInfo( showId )
    },

    // 取消订阅
    unBookShow() {
      const _this = this

      wx.showModal({
        title: '取消提示',
        content: '确认取消参加吗？',
        complete: async (res) => {
          if (res.confirm) {
            const showId = _this.data.show._id
            await unBookShow( showId )

            _this.setData( { isBooked: false } )
            _this.fetchShowInfo( showId )
          }
        }
      })
    },

    // 跳转至演员详情页
    navigateToComeidanDetail( e ) {
      const { id } = e.currentTarget.dataset
      wx.navigateTo( { url: `/pages/comedians/show/index?comedianId=${ id }` } )
    }
})
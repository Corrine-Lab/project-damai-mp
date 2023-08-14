// pages/shows/management/index.js
import { checkShowExpired } from '../../../utils/util'
import { getCreatedShows, removeShow } from '../../../api/index'

Page({

    /**
     * 页面的初始数据
     */
    data: {
      index: 0,
      isMenuShow: false,
      category: ['近期热演', '往期演出'],
      isShowActions: false
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
      wx.setNavigationBarTitle( { title: '演出管理' } )
      this.fetchCreatedShows()
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
      this.setData( { isMenuShow: !this.data.isMenuShow } )
    },

    // 选中下拉列表选项
    optionTaps( e ) {
      const index = e.currentTarget.dataset.index //获取点击的下拉列表的下标
      this.setData( { index, isMenuShow: !this.data.isMenuShow } )
    },

    // 获取创建的演出列表
    async fetchCreatedShows() {
      wx.showLoading( { title: '正在加载中...' } )
      const { data } = await getCreatedShows()
      const { upcomingShows, expiredShows } = checkShowExpired( data )

      wx.hideLoading()
      this.setData( { upcomingShows, expiredShows } );
    },

    // 点击（未过期）演出卡片
    clickCard( e ) {
      const { id } = e.currentTarget.dataset
      this.setData( {
        currentShowId: id,
        isShowActions: ( this.data.currentShowId && this.data.currentShowId === id ) ? !this.data.isShowActions : 'true',
      } )
    },

    // 删除演出
    async deleteShow() {
      const _this = this

      wx.showModal({
        title: '删除提示',
        content: '确认删除该演出吗？',
        complete: async (res) => {
          if (res.confirm) {
            await removeShow( _this.data.currentShowId )
            wx.showToast( { title: '删除成功' } )
            const { upcomingShows } = _this.data
            const newShows = upcomingShows.filter( show => show.id !== _this.data.currentShowId )
            _this.setData( { upcomingShows: newShows } )
          }
        }
      })
    },

    // 跳转至“创建演出”页面
    navigateToShowNew() {
      wx.navigateTo( { url: '/pages/shows/new/index' } )
    },

    // 跳转至（已过期）演出详情页
    navigateToDetailExpired( e ) {
      const { id } = e.currentTarget.dataset
      wx.navigateTo( { url: `/pages/shows/show/index?id=${ id }&isExpired=true` } )
    },

    // 跳转至（未过期）演出详情页
    navigateToDetailUpcoming( e ) {
      const id = this.data.currentShowId
      wx.navigateTo( { url: `/pages/shows/show/index?id=${ id }&isExpired=false` } )
    },

    // 跳转至演出信息编辑页
    navigateToShowEdit() {
      const id = this.data.currentShowId;
      wx.navigateTo( { url: `/pages/shows/new/index?isEdit=true&id=${ id }` } )
    },
})
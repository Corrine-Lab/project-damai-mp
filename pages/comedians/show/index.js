// pages/comedians/show/index.js
import { checkShowExpired } from '../../../utils/util.js'
import { getComedianInfo, getClubInfo, followComedian, unFollowComedian, followClub, unFollowClub } from '../../../api/index'

Page({

    /**
     * 页面的初始数据
     */
    data: {
      index: 0,
      isMenuShow: false,
      category: [ '近期热演', '往期演出' ],
      isFollowed: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      const { comedianId, clubId, isFollowed } = options
      this.setData( { comedianId, clubId, isFollowed: isFollowed === 'true' } )
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
      const { comedianId, clubId } = this.data
      const title = comedianId ? '演员信息' : '俱乐部信息'
      wx.setNavigationBarTitle( { title } )

      !comedianId ? this.fetchClubInfo( clubId ) : this.fetchComedianInfo( comedianId )
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
    optionTaps( e ) {
      const index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
      this.setData( { index, isMenuShow: !this.data.isMenuShow } );
    },

    // 获取演员详情
    async fetchComedianInfo( id ) {
      wx.showLoading( { title: '正在加载中...' } )

      const { data } = await getComedianInfo( id )
      const { upcomingShows, expiredShows } = checkShowExpired( data.shows )
      wx.hideLoading()
      this.setData( { comedian: data, upcomingShows, expiredShows } )
    },

    // 获取俱乐部详情
    async fetchClubInfo( id ) {
      wx.showLoading( { title: '正在加载中...' } )

      const { data } = await getClubInfo( id )
      const { upcomingShows, expiredShows } = checkShowExpired( data.shows )
      wx.hideLoading()
      this.setData( { club: data, upcomingShows, expiredShows } )
    },

    // 关注演员
    async followComedian() {
      await followComedian( { comedianId: this.data.comedianId } )
      this.setData( { isFollowed: true } )
      wx.showToast( { title: '关注成功' } )
    },

    // 取关演员
    async unFollowComedian() {
      const _this = this

      wx.showModal({
        title: '取关提示',
        content: '确认取消关注该演员吗？',
        complete: async (res) => {
          if (res.confirm) {
            await unFollowComedian( { comedianId: _this.data.comedianId } )
            _this.setData( { isFollowed: false } )
            wx.showToast( { title: '取关成功' } )
          }
        }
      })
    },

    // 关注俱乐部
    async followClub() {
      await followClub( { clubId: this.data.clubId } )
      this.setData( { isFollowed: true } )
      wx.showToast( { title: '关注成功' } )
    },

    // 取关俱乐部
    async unFollowClub() {
      const _this = this

      wx.showModal({
        title: '取关提示',
        content: '确认取消关注该俱乐部吗？',
        complete: async (res) => {
          if (res.confirm) {
            await unFollowClub( { clubId: _this.data.clubId } )
            _this.setData( { isFollowed: false } )
            wx.showToast( { title: '取关成功' } )
          }
        }
      })
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
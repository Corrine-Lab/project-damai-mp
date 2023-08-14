// pages/shows/index/index.js
import event from '@codesmiths/event'
import { checkShowExpired } from '../../../utils/util'
import { getShowList } from '../../../api/index'

const { globalData } = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
      query: '',
      isSearchMode: false,
      isLoading: false,
      currentListPage: 1,
      currentSearchPage: 1,
      loadMore: false
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
      // 获取所有演出
      !globalData.token ? event.on( 'tokenReady', this, this.fetchShows) : this.fetchShows
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
      console.log( '页面上拉触底' )
      if ( this.data.isLoadedAll ) return false
      this.setData( { loadMore: true } )
      this.data.isSearchMode ? this.searchShow() : this.fetchShows()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },

    // 获取演出列表
    async fetchShows() {
      wx.showLoading( { title: '正在加载数据' } )
      this.setData( { isLoading: true } )

      if ( !this.data.loadMore ) this.setData( { currentListPage: 1 } )

      // 第一次加载数据
      if ( this.data.currentListPage === 1 ) this.setData( { isLoadedAll: false } )

      // 请求数据
      const result = await getShowList( { page: this.data.currentListPage } )

      wx.hideLoading()
      const { currentListPage } = this.data
      let { upcomingShows } = checkShowExpired( result.data )
      if ( currentListPage !== 1 ) upcomingShows = this.data.upcomingShows.concat( upcomingShows )
      this.setData( { upcomingShows, isLoading: false, loadMore: false, isLoadedAll: currentListPage === result.totalPages } )
      this.setData( { currentListPage: this.data.isLoadedAll ? currentListPage : currentListPage + 1 } )
    },

    // 搜索演出
    async searchShow( e ) {
      wx.showLoading( { title: '正在搜索演出...' } )
      let query

      if ( !this.data.loadMore ) query = e.detail.value

      if ( query !== this.data.query ) this.setData( { currentSearchPage: 1 } )
      this.setData( { isSearchMode: true, isLoading: true, query } )
      
      if ( query === '' ) {
        this.fetchShows()
        return false
      }

      // 第一次加载数据
      if ( this.data.currentSearchPage === 1 ) this.setData( { isLoadedAll: false } )

      // 请求搜索
      const result = await getShowList( { page: this.data.currentSearchPage, query } )

      wx.hideLoading()
      const { currentSearchPage } = this.data
      let { upcomingShows } = checkShowExpired( result.data )
      if ( currentSearchPage !== 1 ) upcomingShows = upcomingShows.concat( this.data.upcomingShows )
      this.setData( { upcomingShows, isLoading: false, loadMore: false, isLoadedAll: currentSearchPage === result.totalPages } )
      this.setData( { currentSearchPage: this.data.isLoadedAll ? currentSearchPage : currentSearchPage + 1 } )
    }, 

    // 取消搜索
    cancelSearch() {
      this.setData( { isSearchMode: false, query: '' } )
      this.fetchShows()
    },

    // 跳转至演出详情页
    navigateToDetail( e ) {
      const { id } = e.currentTarget.dataset
      wx.navigateTo( { url: `/pages/shows/show/index?id=${ id }` } )
    }
})
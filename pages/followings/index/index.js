// pages/followings/index/index.js
import { getFollowedComedians, getFollowedClubs, unFollowComedian, unFollowClub } from '../../../api/index'

Page({

    /**
     * 页面的初始数据
     */
    data: {
      index: 0,
      isMenuShow: false,
      category: [ '演员', '俱乐部' ],
      query: '',
      loadMore: false,
      isSearchMode: false,
      currentSearchComediansPage: 1,
      currentSearchClubsPage: 1,
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
      if ( this.data.index === 0 ) {
        wx.setNavigationBarTitle( { title: '已关注演员列表' } )
        this.fetchComedianFollowings()
      } else {
        wx.setNavigationBarTitle( { title: '已关注俱乐部列表' } )
        this.fetchClubFollowings()
      }
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

      if ( this.data.index === 0 ) {
        if ( this.data.isLoadedComediansAll ) return false
      } else {
        if ( this.data.isLoadedClubssAll ) return false
      }

      this.setData( { loadMore: true } )
      this.data.index === 0 ? this.fetchComedianFollowings() : this.fetchClubFollowings()
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

      // change title
      const title = index === 0 ? '已关注演员列表' : '已关注俱乐部列表';
      wx.setNavigationBarTitle( { title } );

      // fetch data
      if ( this.data.query !== '' ) {
        this.handleSearch()
      } else {
        index === 0 ? this.fetchComedianFollowings() : this.fetchClubFollowings()
      }
    },

    // 获取关注的演员
    async fetchComedianFollowings() {
      wx.showLoading( { title: '正在加载中...' } )

      if ( !this.data.loadMore ) this.setData( { currentComedianPage: 1 } )

      // 第一次加载数据
      if ( this.data.currentComedianPage === 1 ) this.setData( { isLoadedComediansAll: false } )

      // 请求数据
      const result = await getFollowedComedians( { page: this.data.currentComedianPage } )
      
      wx.hideLoading()
      const { currentComedianPage } = this.data
      let comedians = result.data;
      if ( currentComedianPage !== 1 ) comedians = this.data.comedians.concat( comedians )
      this.setData( { comedians, loadMore: false, isLoadedComediansAll: currentComedianPage === result.totalPages } )
      this.setData( { currentComedianPage: this.data.isLoadedComediansAll ? currentComedianPage : currentComedianPage + 1 } )
    },

    // 获取关注的俱乐部
    async fetchClubFollowings() {
      wx.showLoading( { title: '正在加载中...' } )

      if ( !this.data.loadMore ) this.setData( { currentClubPage: 1 } )

      // 第一次加载数据
      if ( this.data.currentClubPage === 1 ) this.setData( { isLoadedClubsAll: false } )

      // 请求数据
      const result = await getFollowedClubs( { page: this.data.currentClubPage } )
      
      wx.hideLoading()
      const { currentClubPage } = this.data
      let clubs = result.data;
      if ( currentClubPage !== 1 ) clubs = this.data.clubs.concat( clubs )
      this.setData( { clubs, loadMore: false, isLoadedClubsAll: currentClubPage === result.totalPages } )
      this.setData( { currentClubPage: this.data.isLoadedClubsAll ? currentClubPage : currentClubPage + 1 } )
    },

    // 搜索
    handleSearch( e ) {
      let query
      if ( this.data.isSearchMode ) {
        query = this.data.query
      } else {
        if ( !this.data.loadMore ) query = e.detail.value
      }

      this.setData( { isSearchMode: true } )
      this.data.index === 0 ? this.searchComedians( query ) : this.searchClubs( query )
    },

    // 搜索演员
    async searchComedians( query ) {
      wx.showLoading( { title: '正在搜索演员...' } )

      if ( query !== this.data.query ) this.setData( { currentSearchComediansPage: 1 } )
      this.setData( { query } )

      if ( this.data.query === '' ) {
        this.fetchComedianFollowings()
        return false
      }

      // 第一次加载数据
      if ( this.data.currentSearchComediansPage === 1 ) this.setData( { isLoadedAll: false } )

      // 请求搜索
      const result = await getFollowedComedians( { page: this.data.currentSearchComediansPage, query } )

      wx.hideLoading()
      const { currentSearchComediansPage } = this.data
      let comedians = result.data;
      if ( currentSearchComediansPage !== 1 ) comedians = this.data.comedians.concat( comedians )
      this.setData( { comedians, loadMore: false, isLoadedAll: currentSearchComediansPage === result.totalPages } )
      this.setData( { currentSearchComediansPage: this.data.isLoadedAll ? currentSearchComediansPage : currentSearchComediansPage + 1 } )
    },

    // 搜索俱乐部
    async searchClubs( query ) {
      wx.showLoading( { title: '正在搜索俱乐部...' } )

      if ( query !== this.data.query ) this.setData( { currentSearchClubsPage: 1 } )
      this.setData( { query } )

      if ( this.data.query === '' ) {
        this.fetchClubFollowings()
        return false
      }

      // 第一次加载数据
      if ( this.data.currentSearchClubsPage === 1 ) this.setData( { isLoadedAll: false } )

      // 请求搜索
      const result = await getFollowedClubs( { page: this.data.currentSearchClubsPage, query } )

      wx.hideLoading()
      const { currentSearchClubsPage } = this.data
      let clubs = result.data;
      if ( currentSearchClubsPage !== 1 ) clubs = this.data.clubs.concat( clubs )
      this.setData( { clubs, loadMore: false, isLoadedAll: currentSearchClubsPage === result.totalPages } )
      this.setData( { currentSearchClubsPage: this.data.isLoadedAll ? currentSearchClubsPage : currentSearchClubsPage + 1 } )
    },

    // 取消搜索
    cancelSearch() {
      this.setData( { query: '', isSearchMode: false } )
      this.data.index === 0 ? this.fetchComedianFollowings() : this.fetchClubFollowings()
    },

    // 取关演员
    unFollowComedian( e ) {
      const _this = this

      wx.showModal({
        title: '取关提示',
        content: '确认取消关注该演员吗？',
        complete: async (res) => {
          if (res.confirm) {
            const { id } = e.currentTarget.dataset
            await unFollowComedian( { comedianId: id } )
            const { comedians } = _this.data

            comedians.forEach( ( comedian, index ) => {
              if ( comedian._id === id ) {
                comedians[ index ].isFollowed = false
                _this.setData( { ['comedians[' + index + ']']: comedians[ index ] } )
              }
            } )

            wx.showToast( { title: '取关成功' } )
          }
        }
      })
    },

    // 取关俱乐部
    unFollowClub( e ) {
      const _this = this

      wx.showModal({
        title: '取关提示',
        content: '确认取消关注该俱乐部吗？',
        complete: async (res) => {
          if (res.confirm) {
            const { id } = e.currentTarget.dataset
            await unFollowClub( { clubId: id } )
            const { clubs } = _this.data

            clubs.forEach( ( club, index ) => {
              if ( club.id === id ) {
                clubs[ index ].isFollowed = false
                _this.setData( { ['clubs[' + index + ']']: clubs[ index ] } )
              }
            } )

            wx.showToast( { title: '取关成功' } )
          }
        }
      })
    },

    // 跳转至演员详情页
    nagivateToComedianDetail( e ) {
      const { id } = e.currentTarget.dataset
      wx.navigateTo( { url: `/pages/comedians/show/index?comedianId=${ id }&isFollowed=true` } )
    },

    // 跳转至俱乐部详情页
    nagivateToClubDetail( e ) {
      const { id } = e.currentTarget.dataset
      wx.navigateTo( { url: `/pages/comedians/show/index?clubId=${ id }&isFollowed=true` } )
    }
})
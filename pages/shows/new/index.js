// pages/shows/new/index.js
import event from '@codesmiths/event';
import { fetchCurrentDate } from '../../../utils/util';
import { createNewShow, getComedians, getShowInfo, getUserInfo, updateShowInfo, createNewShowComedian, removeShowComedian } from '../../../api/index'

Page({

    /**
     * 页面的初始数据
     */
    data: {
      index: 0,
      isMenuShow: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      const { id, isEdit } = options
      this.setData( { id, isEdit: isEdit === 'true' } );
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
      const { isEdit } = this.data
      wx.setNavigationBarTitle( { title: isEdit ? '编辑演出' : '创建演出' } )
      this.fetchComedians()
      isEdit ? this.fetchShowInfo( this.data.id ) : this.fetchUserInfo()

      if ( isEdit ) {
        this.data.show ? this.setDateTime() : event.on( 'infoReady', this, this.setDateTime )
      } else {
        this.setDateTime()
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

    // 获取用户信息
    async fetchUserInfo() {
      const { data } = await getUserInfo()
      this.setData( { club: data.club } )
    },

    // 获取全部演员
    async fetchComedians() {
      wx.showLoading( { title: '正在加载中...' } )
      const { data: comedians } = await getComedians()
      const category = comedians.map( item => item.nickname )

      wx.hideLoading()
      this.setData( { comedians, category } )
      event.emit('categoryReady')
    },

    // 获取演出信息
    async fetchShowInfo( id ) {
      wx.showLoading( { title: '正在加载中...' } )
      const { data: show } = await getShowInfo( id )
      show.date = show.date.replace( /\//g, '-' );

      wx.hideLoading()
      this.setData( { show } )
      event.emit('infoReady');
      this.data.category ? this.setComedian() : event.on( 'categoryReady', this, this.setComedian )
    },
    
    // 设置登场演员默认值
    setComedian() {
      const comedians = this.data.category
      const comedian = this.data.show.comedians[0]
      const comedianIndex = comedians.findIndex(function(item) {
        return comedian.nickname === item
      })
      this.setData( { index: comedianIndex } )
    },

    // 设置日期和时间
    setDateTime() {
      const { isEdit, show } = this.data;

      this.setData({
        date: isEdit ? show.date : fetchCurrentDate(),
        startTime: isEdit ? show.startTime : '19:00',
        endTime: isEdit ? show.endTime : '21:30'
      });
    },

    // 选择演出日期
    bindDateChange( e ) {
      this.setData( { date: e.detail.value } )
    },

    // 选择开始时间
    bindStartTimeChange: function( e ) {
      this.setData( { startTime: e.detail.value } )
    },
  
    // 选择结束时间
    bindEndTimeChange: function( e ) {
      this.setData( { endTime: e.detail.value } )
    },

    // 处理表单提交事件
    handleCreate( e ) {
      const content =  this.data.isEdit ? '确认更新演出吗？' : '确认创建演出吗？'

      wx.showModal({
        title: '确认提示',
        content,
        complete: (res) => {
          if (res.confirm) {
            this.createOrUpdateShow( e.detail.value )
          }
        }
      })
    },

    // 创建/更新演出
    async createOrUpdateShow( values ) {
      const { isEdit, comedians, index } = this.data
      const comedianId = comedians[index]._id
      wx.showLoading( { title: isEdit ? '正在更新中...' : '正在创建中...' } )
      const { date, startTime, endTime } = this.data
      const { showName, address, description } = values
      const club = isEdit ? this.data.show.club : this.data.club 
      const data = { name: showName, clubId: club._id, date, startTime, endTime, address, description }
      const { data: newShow } = isEdit ? await updateShowInfo( this.data.show._id, data ) : await createNewShow( data )

      await createNewShowComedian( { showId: newShow._id, comedianId } )
      
      wx.hideLoading()
      wx.showToast( { title: isEdit ? '更新成功' : '创建成功' } )
      setTimeout( () => wx.navigateTo( { url: `/pages/shows/show/index?id=${ newShow._id }` } ), 2000 );
    },

    // 选择图片
    // handleImageSelect() {
    //   const _this = this;

    //   wx.chooseMedia({
    //     count: 1,
    //     sizeType: [ 'original', 'compressed' ],
    //     sourceType: [ 'album', 'camera' ],
    //     success(res) {
    //       const { tempFilePath } = res.tempFiles[0];
    //       console.log('select image', res);
    //       console.log('path', tempFilePath);
    //     }
    //   })
    // }
})
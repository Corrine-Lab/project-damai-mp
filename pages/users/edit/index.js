// pages/users/edit/index.js
import { getUserInfo, updateUserInfo, createNewClub, updateClubInfo } from '../../../api/index'

const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
      isMenuShow: false,
      roles: [ '观众', '演员', '主理人' ]
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
      this.setIndex()
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

    // 点击显示下拉列表
    selectTaps( e ) {
      this.setData({ isMenuShow: !this.data.isMenuShow });
    },

    // 选中下拉列表选项
    optionTaps( e ) {
      const index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
      this.setData({ index, isMenuShow: !this.data.isMenuShow });
    },

    // 设置index
    setIndex() {
      let { role } = app.globalData.user
      switch( role ) {
        case 'comedian':
          role = '演员'
          break
        case 'holder':
          role = '主理人'
          break
        default:
          role = '观众'
      };

      const index = this.data.roles.indexOf( role )
      this.setData( { index } )
    },

    // 获取用户信息
    async fetchUserInfo() {
      wx.showLoading( { title: '正在加载中' } )
      const { data } = await getUserInfo()

      wx.hideLoading()
      this.setData( { user: data, currentRole: data.role } )
    },

    // 保存信息提示
    updateNotification( e ) {
      const _this = this

      wx.showModal({
        title: '确认提示',
        content: '确认保存当前信息吗',
        complete: (res) => {
          if (res.confirm) {
            _this.updateUserInfo( e.detail.value )
          }
        }
      })
    },

    // 更新用户信息
    async updateUserInfo( values ) {
      wx.showLoading( { title: '正在保存中...' } )
      
      // 获取头像信息

      // 获取身份信息
      let role = this.data.roles[ this.data.index ]
      switch( role ) {
        case '演员':
          role = 'comedian'
          break
        case '主理人':
          role = 'holder'
          break
        default:
          role = 'audience'
      }

      // 获取其他信息
      const { nickname } = values
      let data

      switch( role ) {
        case 'comedian':
          const { slogan, experience } = values
          data = { role, nickname, slogan, experience }
          break

        case 'holder':
          const { clubName, clubAddr, clubDesc } = values
          data = { role, nickname }
          const clubData = {
            name: clubName,
            address: clubAddr,
            description: clubDesc
          }

          this.data.currentRole === 'holder' ? updateClubInfo( this.data.user.club.id, clubData ) : this.createClub( clubData )
          break

        default:
          data = { role, nickname }
      }

      // 请求更新
      await updateUserInfo( data )
      wx.hideLoading()
      wx.showToast( { title: '信息更新成功' } )
      wx.navigateBack()
    },

    // 创建俱乐部
    async createClub( data ) {
      const { success } = await createNewClub( data )
      if ( !success ) wx.showToast( { title: '当前用户已注册俱乐部' } )
    }
})
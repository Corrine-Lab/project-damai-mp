const BASE_URL = 'http://localhost:4000/api/v1'
const app = getApp()

const request = ( url, method, data ) => {
  const _url = BASE_URL +  url
  const _header = method === 'POST' ? 'application/x-www-form-urlencoded' : 'application/json'

  return new Promise( ( resolve, reject ) => {
    wx.request({
      url: _url,
      method,
      data,
      header: {
        'Content-Type': _header,
        'Authorization': app.globalData.token || ''
      },
      success( res ) { resolve( res.data ) },
      fail( err ) { reject( err ) }
    })
  } )
}

module.exports = {
  getShowList: data => request( '/shows', 'GET', data ),
  getShowInfo: id => request( `/shows/${ id }`, 'GET', {} ),
  bookShow: data => request( '/bookings', 'POST', data ),
  unBookShow: id => request( `/bookings/${ id }`, 'DELETE', {} ),
  getComedianInfo: id => request( `/users/comedians/${ id }`, 'GET', {} ),
  getClubInfo: id => request( `/clubs/${ id }`, 'GET', {} ),
  getComedianFollowings: () => request( '/comedian_followings', 'GET', {} ),
  getClubFollowings: () => request( '/club_followings', 'GET', {} ),
  followComedian: data => request( '/comedian_followings', 'POST', data ),
  unFollowComedian: data => request( '/comedian_followings', 'DELETE', data ),
  followClub: data => request( '/club_followings', 'POST', data ),
  unFollowClub: data => request( '/club_followings', 'DELETE', data ),
  getComedians: data => request( '/users/comedians', 'GET', data ),
  getClubs: data => request( '/clubs', 'GET', data ),
  getUserInfo: () => request( '/users', 'GET', {} ),
  updateUserInfo: data => request( '/users', 'PATCH', data ),
  createNewClub: data => request( '/clubs', 'POST', data ),
  updateClubInfo: ( id, data ) => request( `/clubs/${ id }`, 'PATCH', data ),
  getFollowedComedians: data => request( '/users/followed_comedians', 'GET', data ),
  getFollowedClubs: data => request( '/users/followed_clubs', 'GET', data ),
  getBookedShows: () => request( '/users/booked_shows', 'GET', {} ),
  getCreatedShows: () => request( '/users/created_shows', 'GET', {} ),
  removeShow: id => request( `/shows/${ id }`, 'DELETE', {} ),
  createNewShow: data => request( '/shows', 'POST', data ),
  updateShowInfo: ( id, data ) => request( `/shows/${ id }`, 'PATCH', data ),
  createNewShowComedian: data => request( '/show_comedians', 'POST', data ),
  removeShowComedian: data => request( '/show_comedians', 'DELETE', data )
}

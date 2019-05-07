// import {
//   rejects
// } from 'assert'

// import { request } from "http";

function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

const host = 'https://www.heyuhsuo.xyz/heyushuo'

const request = function (url, method, data, header = {}) {
  wx.showLoading({
    title: '加载中', //提示的内容,
    mask: true, //显示透明蒙层，防止触摸穿透,
    success: res => {}
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url: host + url, //开发者服务器接口地址",
      data: data, //请求的参数",
      method: method,
      header: {
        'content-type': 'application/json'
      },
      dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
      success: res => {
        wx.hideLoading()
        resolve(res.data)
      },
      fail: () => {
        wx.hideLoading()
        reject(false)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  })
}

const toLogin = function () {
  const userInfo = wx.getStorageSync('userInfo')
  if (!userInfo) {
    wx.navigateTo({
      url: '/pages/login/main'
    })
  }else{return true}
}

const login = function () {
  const userInfo = wx.getStorageSync('userInfo')
  if (userInfo) {
    return userInfo
  }
}

const get = function (url, data) {
  return request(url, 'GET', data)
}
const post = function (url, data) {
  return request(url, 'POST', data)
}

const getStorageOpenid = function () {
  const openId = wx.getStorageSync('openId')
  if (openId) {
    return openId
  } else {
    return ''
  }
}

const getOpenid = function () {
//   wx.login({
//     success: res => {
//       if (res.code) {
//         wx.request({
//           url: 'https://api.weixin.qq.com/sns/jscode2session',
//           data: {
//             'appid': 'wx601ce71bde7b9add',
//             'secret': 'abed5421d88eb8236e933c6e42d5c14e',
//             'js_code': res.code,
//             'grant_type': 'authorization_code'
//           },
//           //          method: 'GET',
//           //   dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
//           success: res => {
//             const openid=res.data.openid
//             wx.setStorageSync('openid',openid)
//           },
//           fail: () => {},
//           complete: () => {}
//         })
//       }else{
//         console.log('登录失败'+res.errMsg)
        
//       }
//     },
//     fail: () => {},
//     complete: () => {}
//   })
}

export {
  formatNumber,
  formatTime,
  host,
  get,
  post,
  toLogin,
  login,
  getStorageOpenid,
  getOpenid,
}

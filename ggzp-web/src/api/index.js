import {request} from './request'
//此文件包含所有的接口函数

//发送登录请求数据的函数
export function postLoginInfo(queryInfo) {
  return request ({
    url: '/login',
    method: 'post',
    data: queryInfo
  })
}

//发送注册请求数据的函数
export function postRegisterInfo(queryInfo) {
  return request ({
    url: '/register',
    method: 'post',
    data: queryInfo
  })
}

//更新用户的接口
export function postUpdate(queryInfo) {
  return request ({
    url: '/update',
    method: 'post',
    data: queryInfo
  })
}

//根据类型获取用户信息的接口
export function getUserList(type) {
  return request ({
    url: '/userlist',
    method: 'get',
    params: {type: type}
  })
}

//根据类型获取用户信息的接口
export function getUserInfo() {
  return request ({
    url: '/user',
    method: 'get'
  })
}

//获取当前用户的所有发送/接收消息的接口
export function getChatMsgList() {
  return request ({
    url: '/msglist',
    method: 'get'
  })
}

//修改指定消息为已读的接口
export function putMsgReaded(from) {
  return request ({
    url: '/readmsg',
    method: 'post',
    data: from
  })
}

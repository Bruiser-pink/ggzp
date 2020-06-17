import axios from "axios"

export function request(config) {
  const instance = axios.create({
    timeout: 5000
  })
  //1. 请求拦截器
  instance.interceptors.request.use(config => {
    config.headers.Authorization = document.cookie
    return config
  },err => {
    console.log(err)
  })
  //发送网络请求
  return instance(config);
}
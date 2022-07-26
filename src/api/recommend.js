import jsonp from '@/common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'

/**
 * 该接口无法使用 
 * @returns 
 */
export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin:0,
    needNewCode: 1
  })

  return jsonp(url, data, options)

}

export function getDiscList() {
  const url = 'http://localhost:8080/api/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  // return jsonp(url, data, options)
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
    // console.log(res.data.data);
  })
}


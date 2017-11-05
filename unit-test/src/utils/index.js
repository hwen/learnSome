/**
 * copy from ./../../../code-some/i-request.js
 * 
 * 
 * 封装的小型 ajax|fetch 库
 * const request = new Request()
 * request.fetch(options)
 * request.get(urll headers, isFetchMode)
 * request.post(url, data, headers, isFetchMode)
 * 使用方法见最底下的注释：
 */

export default class Request {
  _parse (request) {
    let result
    try {
      result = JSON.parse(request.responseText)
    } catch (err) {
      result = request.responseText
    }

    return result
  }

  _toQuery (query) {
    let params = []
    for (let key in query) {
      params.push(`${key}=${query[key]}`)
    }

    return params.join('&')
  }

  _getContentType (headers) {
    return headers && (headers['Content-type'] || headers['content-type'] || headers['Content-Type'])
  }

  async _fetch (options) {
    console.log('mode: fetch')
    const { url, method, data, headers } = options

    /**
     * [参考0：](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)
     * [参考1：](http://louiszhai.github.io/2016/11/02/fetch/#u5C1D_u8BD5_u4E00_u4E2Afetch)
     * [参考2：](http://www.cnblogs.com/wonyun/p/fetch_polyfill_timeout_jsonp_cookie_progress.html)
     */
    let config = {
      // credentials: 'include',
      method: method,
      headers: headers ? new Headers(headers) : {'Content-Type': 'application/json'},
      mode: 'cors', // cors 模式需要服务端支持
      // 如果存在缓存, 那么fetch将发送一个条件查询request和一个正常的request, 拿到响应后, 它会更新http缓存.
      cache: 'no-cache'
    }

    if (method === 'POST') {
      config.body = JSON.stringify(data)
    }

    try {
      const response = await fetch(url, config)
      const responseJson = await response.json()
      return responseJson
    } catch (err) {
      throw err
    }
  }

  async _xhr (options) {
    console.log('mode: xhr')
    return new Promise((resolve, reject) => {
      const { url, method, data, headers } = options
      const xhr = window.XMLHttpRequest
        ? new XMLHttpRequest()
        /* eslint-disable */
        : new ActiveXObject()
        /* eslint-enable */

      let sendData = ''

      if (method === 'POST') {
        sendData = !this._getContentType(headers) || this._getContentType(headers) === 'application/x-www-form-urlencoded'
          ? this._toQuery(data)
          : JSON.stringify(data)
      }

      xhr.open(method, url, true)
      // set header after open before send
      if (method === 'POST' && !this._getContentType(headers)) {
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      }
      for (let h in headers) {
        xhr.setRequestHeader(h, headers[h])
      }
      xhr.send(sendData)

      xhr.onerror = () => {
        reject(new Error('Network request fail'))
      }

      xhr.ontimeout = () => {
        reject(new Error('Network request timeout'))
      }

      xhr.onload = () => {
        if ((xhr.statusText === 'OK' && xhr.status === 200) || typeof xhr.statusText === 'undefined') {
          resolve(this._parse(xhr))
        } else {
          reject(this._parse(xhr))
        }
      }
    })
  }

  fetch (options) {
    options.method = options.method ? options.method.toUpperCase() : 'GET'
    if (options.fetch) {
      return window.fetch && window.Promise
        ? this._fetch(options)
        : this._xhr(options)
    }

    return this._xhr(options)
  }

  get (url, headers, fetch = false) {
    return this.fetch({
      method: 'GET',
      url: url,
      headers: headers,
      fetch: fetch
    })
  }

  post (url, data, headers, fetch = false) {
    return this.fetch({
      method: 'POST',
      data: data,
      headers: headers,
      fetch: fetch
    })
  }
}

/* 使用方法 */
/*
var request = new Request()

const bai = 'https://www.baidu.com'
const cnode = 'https://cnodejs.org/api/v1/topics'
const ganhuo = 'http://gank.io/api/history/content/2/1'
const get = 'http://localhost:2333/forget'
const post = 'http://localhost:2333/forpost'

const options = {
  method: 'POST',
  url: post,
  headers: {
    // 'Content-type': 'application/json'
  },
  data: {
    m:'s',
    a: 1,
    d: [1, 2, 3]
  },
  fetch: true
}

request.fetch(options)
.then((res, xhr) => {
  console.log('fetch >>>>>')
  console.log(res)
  console.log(xhr)
})
.catch(err => {
  console.log('fetch =======')
  console.log(err)
})

options.fetch = false
request.fetch(options)
.then((res, xhr) => {
  console.log('xhr >>>>>')
  console.log(res)
  console.log(xhr)
})
.catch(err => {
  console.log('xhr =======')
  console.log(err)
})
*/

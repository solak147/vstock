import axios from 'axios';

const protocol = window.location.protocol
const paramObj = getURLParameters()
const domain = paramObj && paramObj.d ? `${protocol}//${paramObj.d}` : ''

// 创建请求实例
const instance = axios.create({
  // baseURL: process.env.NODE_ENV === 'development' ? '/api' : '',
  baseURL: '/api',
  // 指定请求超时的毫秒数
  timeout: 5000,
  // 表示跨域请求时是否需要使用凭证
  withCredentials: false,
});

// 前置拦截器（发起请求之前的拦截）
instance.interceptors.request.use(
  (config) => {
    /**
     * 在这里一般会携带前台的参数发送给后台，比如下面这段代码：
     * const token = getToken()
     * if (token) {
     *  config.headers.token = token
     * }
     */
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 后置拦截器（获取到响应时的拦截）
instance.interceptors.response.use(
  (response) => {
    /**
     * 根据你的项目实际情况来对 response 和 error 做处理
     * 这里对 response 和 error 不做任何处理，直接返回
     */
    console.log(response.config.url, response.config.params, response.data)
    return response.data;
  },
  (error) => {
    const { response } = error;
    if (response && response.data) {
      return Promise.reject(error);
    }
    const { message } = error;
    console.error(message);
    return Promise.reject(error);
  },
);

// 导出常用函数

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export const post = (url, data = {}, params = {}) => {
  return instance({
    method: 'post',
    url,
    data,
    params,
  });
};

/**
 * @param {string} url
 * @param {object} params
 */
export const get = (url, params = {}) => {

  // uid: '5446223',
  // token : '56ead3c929a64f01ec27fd6d1876227f',
  // http://13.214.27.204:57769/public/dist/index.html#/?uid=1&token=2

  const mergedParams = {
    uid: paramObj?.uid,  
    token: paramObj?.token,
    ...params,
  };

  return instance({
    method: 'get',
    url,
    params: mergedParams,
  });
};

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export const put = (url, data = {}, params = {}) => {
  return instance({
    method: 'put',
    url,
    params,
    data,
  });
};

/**
 * @param {string} url
 * @param {object} params
 */
export const _delete = (url, params = {}) => {
  return instance({
    method: 'delete',
    url,
    params,
  });
};

function getURLParameters() {
  var search = window.location.href.split('?');
  var params = {};

  if(search.length > 1){
    search = search[1]
  }else{
    return
  }

  if (search) {
    var paramArray = search.split('&');
    for (var i = 0; i < paramArray.length; i++) {
      var param = paramArray[i].split('=');
      var paramName = decodeURIComponent(param[0]);
      var paramValue = decodeURIComponent(param[1]);
      params[paramName] = paramValue;
    }
  }
  
  return params;
}

export default instance;

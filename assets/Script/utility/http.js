/**
 * 这里的HTTP接口未必符合每个使用者的需求，
 * 您可以根据项目需求进行调整和修改。
 */

/**网络包待发送队列*/
let __packets = [];

/**上次请求的网络包*/
let __last_packet = null;

/**
 * 拼接 http get 参数字符串
 * @param {object} params http get 参数
 * @return {string} http get 参数字符串
 */
function join_query_string(params) {
  let keys = Object.keys(params);
  let walk = (key) => {
    return `${key}=${params[key]}`;
  };
  return "?" + Array.prototype.map.call(keys, walk).join("&");
}

/**
 * 对比网络包
 * @param {object} p1 网络包1
 * @param {object} p2 网络包2
 * @return {boolean} 对比网络包的结果
 */
function __compare_packets(p1, p2) {
  return JSON.stringify(p1) === JSON.stringify(p2);
}

/**
 * 添加网络包，排除多次添加
 * @param {object} packet 网络包
 */
function __add_packet(packet) {
  if (__last_packet && __compare_packets(__last_packet, packet)) {
    cc.warn("重复提交网络包:", packet?.json?.action);
    return;
  }
  __packets.push(packet);
  __send();
}

/**
 * 清空上次请求
 */
function __spare() {
  __last_packet = null;
  __send();
}

/**
 * 发送网络包
 */
function __send() {
  // 上次请求未完成
  if (__last_packet) {
    return;
  }

  // 提取下一个网络包
  let packet = __packets.shift();
  if (!packet) return;

  // 根据方法发送网络包
  __last_packet = packet;
  let { get, post } = cc.durian.immutable.http.method;
  let { url, json } = packet;
  let xhr = new XMLHttpRequest();
  xhr.timeout = cc.durian.immutable.http.timeout;
  xhr.onreadystatechange = (e) => {
    if (xhr.readyState === 4) {
      if (
        xhr.status >= 200 &&
        xhr.status < 400 &&
        xhr.getResponseHeader("Content-Type") === cc.durian.immutable.http.content_type
      ) {
        let result = JSON.parse(xhr.responseText);
        console.log("receive server packet: ", result);
        if (result.err === 0) {
          cc.durian.event.emit(result.action, result.data);
        } else {
          cc.durian.notifier?.message(result.msg);
        }
      }
      __spare();
    }
  };
  xhr.onerror = (e) => {
    cc.error("request server error: ", e);
    cc.durian.notifier?.message(cc.durian.i18n.text("http.request.invalid"));
    __spare();
  };
  xhr.timeout = (e) => {
    cc.error("request server timeout: ", e);
    cc.durian.notifier?.message(cc.durian.i18n.text("http.request.timeout"));
    __spare();
  };
  xhr.open(get, url, true);
  xhr.setRequestHeader("Content-Type", cc.durian.immutable.http.content_type);
  if (packet.method === get) {
    xhr.send();
  } else if (packet.method === post) {
    xhr.send(JSON.stringify(json));
  }
}

/**
 * 客户端申请发送一个Get请求
 * @param {object} json json格式对象
 * @param {string?} host 主机地址
 * @param {string?} router 网络路由
 */
function get(params, host, router) {
  host = host || cc.durian.immutable.http.passbook.host;
  router = router || cc.durian.immutable.http.passbook.router;
  let url = host + router;
  if (Object.keys(params).length > 0) {
    url += join_query_string(params);
  }
  let packet = {
    method: cc.durian.immutable.http.method.get,
    url: url
  };
  __add_packet(packet);
}

/**
 * 客户端申请发送一个Post请求
 * @param {object} json json格式对象
 * @param {string?} host 主机地址
 * @param {string?} router 网络路由
 */
function post(json, host, router) {
  host = host || cc.durian.immutable.http.passbook.host;
  router = router || cc.durian.immutable.http.passbook.router;
  let packet = {
    method: cc.durian.immutable.http.method.post,
    url: host + router,
    json: json
  };
  __add_packet(packet);
}

/**
 * http 封装
 * @file
 * @module http
 * @author DoooReyn<jl88744653@gmail.com>
 * @comment
 * xhr.readyState - description - xhr.status
 * 0 - UNSENT（未发送）- 0
 * 1 - OPENED（已打开） - 0
 * 2 - HEADERS_RECEIVED(头部已获得) - 0
 * 3 - LOADING（载入中） 200
 * 4 - DONE（完成）- 200
 */
export default {
  get,
  post
};

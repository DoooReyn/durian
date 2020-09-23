/**心跳检测 */
let heartbeat = {
  /**心跳包发送间隔 */
  timeout: 10000,
  /**客户端连接超时对象 */
  timeout_client_obj: null,
  /**服务端连接超时对象 */
  timeout_server_obj: null,
  /**重置心跳包 */
  reset() {
    clearTimeout(this.timeout_client_obj);
    clearTimeout(this.timeout_server_obj);
    return this;
  },
  /**发送心跳包 */
  start() {
    this.timeout_client_obj && clearTimeout(this.timeout_client_obj);
    this.timeout_server_obj && clearTimeout(this.timeout_server_obj);
    this.timeout_client_obj = setTimeout(() => {
      socks.send("heartbeat");
      console.log("ping");
      this.timeout_server_obj = setTimeout(() => {
        console.log("server closed connection");
        socks.disconnect(-1);
      }, this.timeout);
    }, this.timeout);
  }
};

/**WebSocket 封装 */
let socks = {
  /**@type {WebSocket} */
  ws: null,

  /**重连锁 */
  lock_reconnect: false,

  /**重连间隔 */
  timeout_reconnect: 10000,

  /**重连超时对象 */
  timeout_reconnect_obj: null,

  /**连接 WebSocket */
  connect() {
    if (!Object.is_void(this.ws) && this.opened()) {
      return cc.warn("WebSocket has established!");
    }
    this.ws = new WebSocket(cc.durian.immutable.websocket.host);
    this.ws.onopen = this.onopen.bind(this);
    this.ws.onmessage = this.onmessage.bind(this);
    this.ws.onerror = this.onerror.bind(this);
    this.ws.onclose = this.onclose.bind(this);
  },

  /**WebSocket 重连 */
  reconnect() {
    if (this.lock_reconnect) return;
    this.lock_reconnect = true;
    this.timeout_reconnect_obj && clearTimeout(this.timeout_reconnect_obj);
    this.timeout_reconnect_obj = setTimeout(() => {
      console.log("WebSocket reconnecting...");
      cc.durian.notifier?.message("websocket connection reconnecting");
      this.lock_reconnect = false;
      this.connect();
    }, this.timeout_reconnect);
  },

  /**
   * websocket 连接建立
   * @param {Event} e websocket 事件
   */
  onopen(e) {
    cc.durian.notifier?.message("websocket connection established");
    console.log("ws onopen: ", e);
    heartbeat.reset().start();
  },

  /**
   * websocket 连接收到消息
   * @param {MessageEvent} e websocket 事件
   */
  onmessage(e) {
    console.log("onmessage: ", e);
    heartbeat.reset().start();
  },

  /**
   * websocket 连接错误
   * @param {Event} e websocket 事件
   */
  onerror(e) {
    console.log("ws onerror: ", e);
    cc.durian.notifier?.message("websocket connection error occurred");
    this.reconnect();
  },

  /**
   * websocket 连接建立
   * @param {CloseEvent} e websocket 事件
   */
  onclose(e) {
    console.log("ws onclose: ", e);
    heartbeat.reset();
    if (e.code === 0) return;
    if (e.code === -1) {
      cc.durian.notifier?.message("server closed websocket connection");
      return;
    }
    cc.durian.notifier?.message("websocket connection lost");
    this.reconnect();
  },

  /**
   * websocket 连接发送消息
   * @param {object} msg 消息
   */
  send(msg) {
    this.ws && this.ws.send(JSON.stringify(msg));
  },

  /**
   * 主动关闭websocket连接
   */
  disconnect(code = 0) {
    this.opened() && this.ws.close(code);
  },

  /**
   * websocket连接是否处于打开状态
   * @return {boolean} 是否打开状态
   */
  opened() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  },

  /**
   * websocket连接是否处于关闭状态
   * @return {boolean} 是否关闭状态
   */
  closed() {
    return this.ws && this.ws.readyState === WebSocket.CLOSED;
  },

  /**
   * websocket连接是否处于连接中状态
   * @return {boolean} 是否连接中状态
   */
  connecting() {
    return this.ws && this.ws.readyState === WebSocket.CONNECTING;
  }
};

export default socks;

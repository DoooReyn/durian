// ---------------------------- 内置 ----------------------------

/**开发环境配置 */
const env = {
  /**是否发布版本 */
  release: false,
  /**此版本号为游戏包版本，非框架版本 */
  version: "0.0.1"
};

/**语言*/
const language = {
  support: [cc.sys.LANGUAGE_CHINESE, cc.sys.LANGUAGE_ENGLISH],
  default: cc.sys.LANGUAGE_CHINESE
};

/**渲染层级定义*/
const z_index = {
  // ui 界面
  layer: 1,
  // 半透遮罩
  semi_transparent: 2,
  // ui 弹窗
  popup: 3,
  // ui 新手引导
  guide: 4,
  // ui 通知消息
  notifier: 5,
  // 屏蔽输入层
  block: 6
};

/**通知消息层层级定义*/
const notifier_z_index = {
  // ui 通知消息 - 飘字通知
  notifier_float: 1,
  // ui 通知消息 - 气泡通知
  notifier_bubble: 2,
  // ui 通知消息 - 滚动通知
  notifier_broadcast: 3
};

/**
 * ui事件类型
 * @enum
 */
const UI_TYPE = cc.Enum(z_index);

/**色值定义*/
const color = {
  /**白色*/
  white: cc.color("#ffffff"),
  /**红色*/
  red: cc.color("#c62828"),
  /**粉红色*/
  pink: cc.color("#ad1457"),
  /**紫色*/
  purple: cc.color("#6a1b9a"),
  /**深紫色*/
  deep_purple: cc.color("#4527a0"),
  /**靛蓝色*/
  indigo: cc.color("#283593"),
  /**蓝色*/
  blue: cc.color("#1565c0"),
  /**淡蓝色*/
  light_blue: cc.color("#0277bd"),
  /**天青色*/
  cyan: cc.color("#00838f"),
  /**蓝绿色*/
  teal: cc.color("#00695c"),
  /**绿色*/
  green: cc.color("#2e7d32"),
  /**淡绿色*/
  light_green: cc.color("#558b2f"),
  /**酸橙色*/
  indigo: cc.color("#9e9d24"),
  /**黄色*/
  yellow: cc.color("#f9a825"),
  /**琥珀色*/
  amber: cc.color("#ff8f00"),
  /**橘黄色*/
  orange: cc.color("#ef6c00"),
  /**深橘色*/
  deep_orange: cc.color("#d84315"),
  /**褐色*/
  brown: cc.color("#4e342e"),
  /**灰色*/
  grey: cc.color("#424242"),
  /**蓝灰色*/
  blue_grey: cc.color("#37474f")
};

// ---------------------------- 可自定义 ----------------------------

/**自定义事件名称*/
const event = {
  open_book: "open_book",
  new_keypair: "new_keypair",
  window_resize: "window_resize",
  open_handle_item: "open_handle_item",
  main_change_layer: "main_change_layer",
  app_enter_foreground: "app_enter_foreground",
  app_enter_background: "app_enter_background",
  change_language: "change_language",
  game_state_ready: "game_state_ready",
  game_state_running: "game_state_running",
  game_state_pause: "game_state_pause",
  game_state_over: "game_state_over",
  game_pre_running: "game_pre_running",
  game_choose_mode: "game_choose_mode",
  refresh_total_coin: "refresh_total_coin",
  player_jump: "player_jump",
  player_fall: "player_fall",
  change_skin: "change_skin",
  factory_item_recycle: "factory_item_recycle"
};

/**HTTP(s) API*/
const http = {
  /**方法 */
  method: {
    get: "GET",
    post: "POST"
  },
  /**超时 */
  timeout: 10000,
  /**文本类型 */
  content_type: "application/json",
  passbook: {
    //host: "https://wu57.cn:8012", // release
    host: "http://localhost:8012", // develop
    router: "/passbook",
    actions: {
      get_user_book: "get_user_book",
      create_user: "create_user",
      retrieve_password: "retrieve_password"
    }
  }
};

/**WebSocket */
const websocket = {
  // host: "wss://wu57.cn:8012",
  host: "ws://localhost:8012",
  timeout: 10000,
  router: {}
};

/**游戏模式 */
const game_mode = cc.Enum({
  none: 0,
  single: 1,
  couple: 2
});

/**碰撞标记 */
const collider_group = {
  platform: "platform",
  player: "player",
  prop: "prop",
  obstacle: "obstacle"
};

/**玩家标记 */
const play_which = cc.Enum({
  player_1: 1,
  player_2: 2
});

// ---------------------------- 导出模块 ----------------------------

/**常量定义 */
export default {
  env,
  http,
  event,
  color,
  z_index,
  UI_TYPE,
  notifier_z_index,
  language,
  websocket,
  game_mode,
  play_which,
  collider_group
};

import { UI_TYPE } from "../constant/immutable";

/**
 * ui组件基类
 * @class
 */
export default cc.Class({
  extends: cc.Component,

  editor: {
    disallowMultiple: true
  },

  ctor() {
    /**事件id映射 */
    this.event_map = new Map();
  },

  properties: {
    ui_type: {
      tooltip: "ui类型",
      type: UI_TYPE,
      default: UI_TYPE.layer
    },
    closable: {
      displayName: "是否可关闭",
      tooltip: "不可关闭代表该ui打开之后常驻内存",
      default: true
    },
    allow_touch_across: {
      displayName: "是否允许穿透",
      tooltip: "若不允许穿透，则在运行时会为节点自动添加cc.BlockInputEvents组件",
      default: true
    },
    maskable: {
      displayName: "是否需要半透层",
      default: false
    }
  },

  statics: {
    UI_TYPE: UI_TYPE
  },

  /**
   * 组件onLoad事件，可以在此
   * - 在此布置初始任务
   */
  onLoad() {},

  /**
   * 组件start事件，可以在此
   * - 在此布置开始任务
   */
  start() {
    cc.durian.cocos.load_game_fnt(this.node, cc.durian.assets.game_font_x32);
  },

  /**
   * 组件启用事件，可以在此
   * - 注册事件
   * - 进入动画
   */
  onEnable() {
    !this.allow_touch_across &&
      cc.durian.cocos.get_or_add_component(this.node, cc.BlockInputEvents);
    this.maskable && cc.durian.app.c_semi_transparent.increase();
  },

  /**
   * 组件禁用事件，可以在此
   * - 注销事件
   */
  onDisable() {
    this.off_all();
    this.unscheduleAllCallbacks();
    this.maskable && cc.durian.app.c_semi_transparent.decrease();
  },

  /**
   * 组件销毁事件
   * - 在此释放资源
   */
  onDestroy() {},

  /**
   * 关闭当前界面
   */
  ui_close() {
    cc.durian.app.c_ui.close(this.get_ui_path());
  },

  /**
   * 返回上一级
   */
  ui_back() {
    this.scheduleOnce(() => {
      cc.durian.app.c_ui.pop();
    }, 0);
  },

  /**
   * 获取ui资源路径
   */
  get_ui_path() {
    let name = this.node.name;
    return cc.durian.assets[name] || cc.durian.assets[name];
  },

  /**
   * 注册监听事件
   * @param {string} name 事件名称
   * @param {function} fn 事件回调
   */
  on(name, fn) {
    cc.durian.event.on(name, fn, this);
  },

  /**
   * 解除监听事件
   * @param {string} name 事件名称
   * @param {function} fn 事件回调
   */
  off(name, fn) {
    cc.durian.event.off(name, fn, this);
  },

  /**
   * 解除监听所有事件
   */
  off_all() {
    cc.durian.event.targetOff(this);
  }
});

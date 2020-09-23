import c_ui_base from "./c_ui_base";
import { color } from "../constant/immutable";

/**消息颜色 */
const FLOAT_COLOR = {
  message: color.white,
  warning: color.yellow,
  fetal: color.red
};

let c_notifier_float = cc.Class({
  extends: c_ui_base,

  properties: {
    ui_type: {
      type: c_ui_base.UI_TYPE,
      default: c_ui_base.UI_TYPE.notifier,
      override: true,
      readonly: true
    },
    template: {
      displayName: "消息模板",
      default: null,
      type: cc.Node
    },
    float_time: {
      tooltip: "持续时间",
      default: 2.0,
      min: 0.2
    },
    from_y: {
      tooltip: "从屏幕百分比的高度位置开始",
      default: 0.7,
      min: 0,
      max: 100
    },
    to_y: {
      tooltip: "在屏幕百分比的高度位置结束",
      default: 0.8,
      min: 0,
      max: 1
    }
  },

  onLoad() {
    cc.durian.app.c_notifier_float = this;
  },

  onEnable() {
    cc.durian.app.c_pools.create(cc.durian.assets.float_text, 3);
  },

  onDisable() {
    cc.durian.app.c_pools.unload(cc.durian.assets.float_text);
  },

  start() {
    cc.durian.app.c_pools.fill(cc.durian.assets.float_text);
  },

  /**
   * 推送消息
   * - 强行插入会清空之前的消息
   * @param {string} tip 消息内容
   * @param {boolean} interrupt 强行插入
   * @return {c_notifier_bubble} 返回当前类实例
   */
  push(tip, color) {
    let item = cc.durian.app.c_pools.get_item(cc.durian.assets.float_text);
    this.node.addChild(item);
    item.active = true;
    item.opacity = 255;
    cc.durian.cocos.load_game_fnt(item, cc.durian.assets.game_font_x32);
    let lab = item.getComponent(cc.Label);
    lab.string = tip;
    item.color = color;
    item.x = 0;
    item.y = cc.durian.root.height * this.from_y;
    let to_y = cc.durian.root.height * this.to_y;
    let o_delay = this.float_time * 0.25;
    let o_time = this.float_time * 0.75;
    cc.tween(item)
      .parallel(
        cc.tween().to(this.float_time, { y: { value: to_y, easing: "sineIn" } }),
        cc.tween().delay(o_delay).to(o_time, { opacity: 88 })
      )
      .call(() => {
        item.getComponent(cc.Label).string = "";
        cc.durian.app.c_pools.back_item(cc.durian.assets.float_text, item);
      })
      .start();

    return this;
  },

  /**
   * 推送普通消息
   * @param {string} tip 消息内容
   * @return {c_notifier_bubble} 返回当前类实例
   */
  message(tip) {
    return this.push(tip, FLOAT_COLOR.message);
  },

  /**
   * 推送警告消息
   * @param {string} tip 消息内容
   * @return {c_notifier_bubble} 返回当前类实例
   */
  warning(tip) {
    return this.push(tip, FLOAT_COLOR.warning);
  },

  /**
   * 推送错误消息
   * @param {string} tip 消息内容
   * @return {c_notifier_bubble} 返回当前类实例
   */
  fetal(tip) {
    return this.push(tip, FLOAT_COLOR.fetal);
  }
});

export default c_notifier_float;

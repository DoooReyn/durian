import c_ui_base from "./c_ui_base";

/**
 * 气泡通知
 * @class
 */
let c_notifier_bubble = cc.Class({
  extends: c_ui_base,

  ctor() {
    this.tips = [];
    this.playing = false;
  },

  properties: {
    ui_type: {
      type: c_ui_base.UI_TYPE,
      default: c_ui_base.UI_TYPE.notifier,
      override: true,
      readonly: true
    },
    tip_label: {
      displayName: "消息文本",
      default: null,
      type: cc.Label
    },
    stay_time: {
      displayName: "停留时间(s)",
      default: 2
    }
  },

  onLoad() {
    this.playing = false;
    this.tips.length = 0;
    this.node.opacity = 0;
    this.tip_label.string = "";
    cc.durian.app.c_notifier_bubble = this;
  },

  /**
   * 清空消息列表
   */
  clear() {
    this.tips.length = 0;
  },

  /**
   * 推送消息
   * - 强行插入会清空之前的消息
   * @param {string} tip 消息内容
   * @param {boolean} interrupt 强行插入
   * @return {c_notifier_bubble} 返回当前类实例
   */
  push(tip, interrupt = false) {
    if (tip) {
      interrupt && (this.tips.length = 0);
      this.tips.push(tip);
      this.next();
    }
    return this;
  },

  /**
   * 播报下一个消息
   */
  next() {
    if (this.playing) return;
    let tip = this.tips.shift();
    if (!tip) return;

    this.tip_label.string = tip;
    this.playing = true;
    cc.tween(this.node)
      .to(0.5, { opacity: 255 })
      .delay(this.stay_time)
      .to(0.5, { opacity: 0 })
      .call(() => {
        this.playing = false;
        this.next();
      })
      .start();
  }
});

export default c_notifier_bubble;

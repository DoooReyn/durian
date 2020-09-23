import c_ui_base from "./c_ui_base";

export default cc.Class({
  extends: c_ui_base,

  properties: {
    ui_type: {
      tooltip: "ui类型",
      type: c_ui_base.UI_TYPE,
      default: c_ui_base.UI_TYPE.popup,
      override: true,
      readonly: true
    },
    click_outside_to_close: {
      displayName: "点击外部区域关闭",
      default: false,
      tooltip: "点击主窗体外部区域可以关闭当前窗口"
    },
    win_frame: {
      type: cc.Node,
      default: null,
      displayName: "主窗体节点",
      tooltip: "设定主窗体区域的节点，可以使用一个划定区域大小的空节点代替",
      visible() {
        return this.click_outside_to_close;
      }
    },
    close_tip: {
      type: cc.Node,
      default: null,
      tooltip: "点击外部区域可关闭的提示文本节点，不设置则不会播放过渡效果",
      visible() {
        return this.click_outside_to_close;
      }
    }
  },

  onLoad() {
    c_ui_base.prototype.onLoad.call(this);
    this.click_outside_to_close && !this.win_frame && cc.error("必须指定主窗体节点");
  },

  onEnable() {
    // cc.durian.audio.play_sound(cc.durian.assets.sound_popup);
    this.play_enter_animation();
    if (this.click_outside_to_close) {
      this.node.on(cc.Node.EventType.TOUCH_END, this.click_outside, this);
      this.play_close_tip();
    }
    c_ui_base.prototype.onEnable.call(this);
  },

  onDisable() {
    // cc.durian.audio.play_sound(cc.durian.assets.sound_popup);
    if (this.click_outside_to_close) {
      this.node.off(cc.Node.EventType.TOUCH_END, this.click_outside, this);
    }
    c_ui_base.prototype.onDisable.call(this);
  },

  /**
   * 播放进入动画
   */
  play_enter_animation() {
    this.node.setScale(0, 1);
    cc.tween(this.node)
      .to(0.25, { scaleX: { value: 1, easing: "sineInOut" } })
      .start();
  },

  /**
   * 播放进入动画
   */
  play_exit_animation(fn) {
    cc.tween(this.node)
      .to(0.1, { scaleX: { value: 0, easing: "sineInOut" } })
      .call(() => fn && fn())
      .start();
  },

  /**
   * 点击外部区域处理
   * @param {cc.Event.EventTouch} event 触摸事件
   */
  click_outside(event) {
    event.stopPropagation();
    if (this.click_outside_to_close && this.win_frame) {
      if (!cc.durian.cocos.touch_point_inside_of_node(event, this.win_frame)) {
        this.ui_close();
        cc.durian.audio.play_sound(cc.durian.assets.sound_click);
      }
    }
  },

  /**
   * 播放关闭提示
   */
  play_close_tip() {
    if (!this.close_tip) return;
    cc.Tween.stopAllByTarget(this.close_tip);
    this.close_tip.opacity = 0;
    let action = cc.tween().to(0.5, { opacity: 255 }).delay(0.5).to(0.5, { opacity: 0 });
    cc.tween(this.close_tip).repeatForever(action).start();
  }
});

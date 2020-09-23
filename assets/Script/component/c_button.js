import assets from "../constant/assets";

/**
 * 按钮扩展基类
 */
export default cc.Class({
  extends: cc.Component,

  properties: {
    effect: {
      default: assets.sound_click,
      displayName: "音频路径"
    }
  },

  onEnable() {
    this.node.on("click", this.on_play_click_effect, this);
  },

  onDisable() {
    this.node.off("click", this.on_play_click_effect, this);
  },

  /**
   * 播放点击音效
   */
  on_play_click_effect() {
    cc.durian.audio.play_sound(this.effect);
  }
});

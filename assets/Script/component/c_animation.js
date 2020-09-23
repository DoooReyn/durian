export default cc.Class({
  extends: cc.Component,

  editor: {
    requireComponent: cc.Sprite,
    disallowMultiple: true
  },

  properties: {
    target: {
      type: cc.Sprite,
      default: null
    },
    frames: {
      type: [cc.SpriteFrame],
      default: []
    },
    repeat: {
      default: 1,
      min: 0,
      type: cc.Integer,
      tooltip: "0代表循环播放,大于0代表有限次循环播放"
    },
    interval: {
      default: 0.1,
      min: 0,
      tooltip: "播放间隔"
    },
    on_load_play: {
      default: true,
      tooltip: "加载后立即播放"
    }
  },

  onLoad() {
    this.reset();
  },

  onEnable() {
    this.on_load_play && this.play();
  },

  onDisable() {
    this.unscheduleAllCallbacks();
  },

  reset() {
    this.unschedule(this._play);
    this.current = 0;
    this.target.spriteFrame = this.frames[this.current];
  },

  _play() {
    this.current++;
    this.current = this.current >= this.frames.length ? 0 : this.current;
    this.target.spriteFrame = this.frames[this.current];
  },

  play() {
    this.reset();
    this.schedule(
      this._play,
      this.interval,
      this.repeat > 0 ? this.repeat : cc.macro.REPEAT_FOREVER
    );
  }
});

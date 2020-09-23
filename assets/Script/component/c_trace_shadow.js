cc.Class({
  extends: cc.Component,

  editor: {
    requireComponent: cc.Sprite,
    disallowMultiple: true
  },

  properties: {
    interval: {
      displayName: "残影生成间隔(1个/每帧)",
      type: cc.Integer,
      default: 1,
      min: 1
    },
    opacity: {
      min: 0,
      max: 255,
      default: 128,
      type: cc.Integer
    },
    keep_time: {
      displayName: "残影持续时间",
      default: 0.1,
      min: 0.01
    }
  },

  onLoad() {
    this.frames = 0;
    this.pre_pos = this.node.getPosition();
  },

  new_shadow() {
    let node = new cc.Node("__shadow__");
    let properties = [
      "x",
      "y",
      "angle",
      "scaleX",
      "scaleY",
      "opacity",
      "anchorX",
      "anchorY",
      "width",
      "height",
      "skewX",
      "skewY"
    ];
    for (let p of properties) {
      node[p] = this.node[p];
    }
    node.opacity = this.opacity;
    this.node.parent.addChild(node, this.node.zIndex - 1);
    let sprite = node.addComponent(cc.Sprite);
    sprite.spriteFrame = this.node.getComponent(cc.Sprite).spriteFrame;

    cc.tween(node)
      .by(this.keep_time, {
        opacity: -node.opacity,
        x: -this.node.width * 2,
        scaleX: -node.scaleX * 0.5,
        scaleY: -node.scaleY * 0.5
      })
      .start();

    this.scheduleOnce(() => {
      node.removeFromParent();
    }, this.keep_time);
  },

  lateUpdate() {
    // if (this.node.x === this.pre_pos.x && this.node.y === this.pre_pos.y) {
    //   this.frames = 0;
    //   return;
    // }

    // if (!cc.durian.game_state.instance.is_running()) return;

    this.frames++;
    if (this.frames % this.interval === 0) {
      this.new_shadow();
    }
    // else if (this.node.y !== this.pre_pos.y) {
    //   if (this.frames % Math.ceil(this.interval / 3) === 0) this.new_shadow();
    // }

    this.pre_pos.x = this.node.x;
    this.pre_pos.y = this.node.y;
  }
});

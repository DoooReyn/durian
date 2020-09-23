/**拖动行为定义 */
const Drag_Behavior = cc.Enum({
  xy_both: 0,
  x_only: 1,
  y_only: 2
});

/**拖动事件名称 */
const Drag_Event = "dragging";

/**
 * 节点拖动组件
 * @class c_draggable
 */
export default cc.Class({
  extends: cc.Component,

  properties: {
    /**
     * @property {Component.EventHandler[]} events
     */
    events: {
      default: [],
      type: cc.Component.EventHandler,
      tooltip: "拖动事件"
    },

    enable_default_behavior: {
      default: true,
      tooltip: "是否启用默认的拖动行为"
    },

    draggable_behavior: {
      displayName: "拖动行为",
      type: Drag_Behavior,
      default: Drag_Behavior.xy_both,
      visible() {
        return this.enable_default_behavior;
      }
    }
  },

  statics: {
    Behavior: Drag_Behavior,
    Event: Drag_Event
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.on_drag, this);
  },

  /**
   * 移动
   * @param {cc.Event.EventTouch} e
   */
  on_drag(e) {
    if (this.enable_default_behavior) {
      let { x, y } = this.node;
      let delta = e.getDelta();
      switch (this.draggable_behavior) {
        case Drag_Behavior.xy_both:
          this.node.setPosition(x + delta.x, y + delta.y);
          break;
        case Drag_Behavior.x_only:
          this.node.setPosition(x + delta.x, y);
          break;
        case Drag_Behavior.y_only:
          this.node.setPosition(x, y + delta.y);
          break;
      }
    }
    cc.Component.EventHandler.emitEvents(this.events, e);
    this.node.emit(Drag_Event, e);
  }
});

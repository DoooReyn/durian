/**
 * @class c_scroll_item
 * @description
 * 用法：
 *  1. 将本组件挂载在Item节点上
 * 	2. 在属性面板上指定事件数组回调，即可监听 Item 「进入」和「离开」ScrollView可视区域的事件
 */
export default cc.Class({
  extends: cc.Component,

  ctor() {
    /**
     * 当前是否在展示中
     * 1. 在进入ScrollView期间为 true
     * 2. 在离开ScrollView期间为 false
     */
    this.showing = false;
  },

  properties: {
    on_enter_scroll_view_events: {
      default: [],
      type: [cc.Component.EventHandler],
      tooltip: "进入ScrollView时回调"
    },
    on_exit_scroll_view_events: {
      default: [],
      type: [cc.Component.EventHandler],
      tooltip: "离开ScrollView时回调"
    },
    on_position_change_events: {
      default: [],
      type: [cc.Component.EventHandler],
      tooltip: "进入ScrollView之后，位置发生改变时回调"
    }
  },

  /**
   * Item 进入 ScrollView 的时候回调
   */
  on_scroll_view_enter(view) {
    if (this.on_enter_scroll_view_events.length == 0) return;
    this.on_enter_scroll_view_events.forEach((event) => {
      event.emit([]);
    });
  },

  /**
   * Item 离开 ScrollView 的时候回调
   */
  on_scroll_view_exit(view) {
    if (this.on_exit_scroll_view_events.length == 0) return;
    this.on_exit_scroll_view_events.forEach((event) => {
      event.emit([]);
    });
    // TODO: 如果Item是使用对象池产生的话，则需要归还到对象池
    // view.back_to_pool && view.back_to_pool(this.node);
  },

  /**
   * Item 进入 ScrollView 后，位置发生移动时回调，离开ScrollView后不会回调
   * @param x_offset_percent 相对于 ScrollView 可视区域中心点，X的偏移量百分比，取值范围：[0, 1]。其中，0：为在可视区域最左边，1：为可视区域最右边
   * @param x_offset_percent 相对于 ScrollView 可视区域中心点，Y的偏移量百分比，取值范围：[0, 1]。其中，0：为在可视区域最下边，1：为可视区域最上边
   */
  on_scroll_view_position_changed(view, x_offset_percent, y_offset_percent) {
    if (this.on_position_change_events.length == 0) return;
    this.on_position_change_events.forEach((event) => {
      event.emit([x_offset_percent, y_offset_percent]);
    });
  }
});

import c_scroll_item from "./c_scroll_item";

/**
 * @class c_scroll_view
 * @classdesc 只渲染可视区域的ScrollView
 * @description
 *
 * 用法：
 *  1. 将本组件挂载在节点上即可，和正常ScrollView使用一致
 *
 * 原理：
 *  1. 滚动时，判断子节点是否进入了/离开了可视区域
 *  2. 根据结果回调对应事件，在可以实现类似以下功能：
 *    - 控制可视区域Item显示（透明度改为 255 ），非可视区域Item隐藏（透明度改为 0 ）
 */
let c_scroll_view = cc.Class({
  extends: cc.ScrollView,

  properties: {
    calculate_position: {
      default: false,
      tooltip: "是否需要监听可视区域中Item的相对位置变化事件（可能会相对耗性能）"
    }
  },

  start() {
    cc.ScrollView.prototype.start.call(this);
    this.optimize_drawcall();
  },

  onEnable() {
    cc.ScrollView.prototype.onEnable.call(this);
    this.node.on(cc.ScrollView.EventType.SCROLLING, this.optimize_drawcall, this);
    this.content.on("child-added", this.optimize_drawcall, this);
    this.content.on("child-removed", this.optimize_drawcall, this);
  },

  onDisable() {
    cc.ScrollView.prototype.onDisable.call(this);
    this.node.off(cc.ScrollView.EventType.SCROLLING, this.optimize_drawcall, this);
    this.content.off("child-added", this.optimize_drawcall, this);
    this.content.off("child-removed", this.optimize_drawcall, this);
  },

  onDestroy() {
    cc.ScrollView.prototype.onDestroy.call(this);
  },

  /**
   * 优化 ScrollView DrawCall
   */
  optimize_drawcall(view, event) {
    if (this.content.childrenCount === 0) return;
    if (event && event !== cc.ScrollView.EventType.SCROLLING) return;

    // 获取 ScrollView Node 的左下角坐标在世界坐标系中的坐标
    let left_bottom_local_point = cc.v2(
      this.node.x - this.node.anchorX * this.node.width,
      this.node.y - this.node.anchorY * this.node.height
    );
    let left_bottom_world_point = this.node.parent.convertToWorldSpaceAR(left_bottom_local_point);

    // 求出 ScrollView 可视区域在世界坐标系中的矩形（碰撞盒）
    let scroll_view_rect = cc.rect(
      left_bottom_world_point.x,
      left_bottom_world_point.y,
      this.node.width,
      this.node.height
    );

    // 遍历 ScrollView Content 内容节点的子节点，对每个子节点的包围盒做和 ScrollView 可视区域包围盒做碰撞判断
    let count = 0;
    this.content.children.forEach((child_node, index) => {
      // 没有绑定指定组件的子节点不处理
      let c_scroll_item_com = child_node.getComponent(c_scroll_item);
      if (c_scroll_item_com == null) return;

      // 如果相交了，那么就显示，否则就隐藏
      let child_node_rect = child_node.getBoundingBoxToWorld();
      let cross = child_node_rect.intersects(scroll_view_rect);
      if (cross) {
        count++;
        if (!c_scroll_item_com.showing) {
          c_scroll_item_com.showing = true;
          c_scroll_item_com.on_scroll_view_enter(this);
          // console.log("item enter", index);
        }
        // 将位于可视区域内的节点的透明度还原，让引擎绘制
        child_node.opacity = 255;
        if (this.calculate_position) {
          if (c_scroll_item_com.showing) {
            c_scroll_item_com.on_scroll_view_position_changed(
              this,
              (child_node_rect.x - (scroll_view_rect.x - child_node_rect.width / 2)) /
                (child_node_rect.width + scroll_view_rect.width),
              (child_node_rect.y - (scroll_view_rect.y - child_node_rect.height / 2)) /
                (child_node_rect.height + scroll_view_rect.height)
            );
          }
        }
      } else {
        // 将不在可视区域内的节点的透明度设置为0，减少 drawcall
        c_scroll_item_com.showing = false;
        c_scroll_item_com.on_scroll_view_exit(this);
        child_node.opacity = 0;
        // console.log("item exit", index);
      }
    });
  },

  /**
   *  判断节点是否位于可视区域
   *
   * @description
   * 根据节点的包围盒是否与ScrollView可视区域包围盒相交来判断
   * - 如果相交，则代表着节点位于ScrollView的可视区域内，即是可见的
   * - 反之，则节点不在ScrollView的可视区域内，即是不可见的
   *
   * @param {cc.Node} node ScrollItem节点
   */
  node_in_visible_rect(node) {
    // 获取ScrollView的左下角世界坐标
    let left_bottom_local_point = cc.v2(
      this.node.x - this.node.anchorX * this.node.width,
      this.node.y - this.node.anchorY * this.node.height
    );
    let left_bottom_world_point = this.node.parent.convertToWorldSpaceAR(left_bottom_local_point);
    // 获取ScrollView可视区域包围盒
    let scroll_view_rect = cc.rect(
      left_bottom_world_point.x,
      left_bottom_world_point.y,
      this.node.width,
      this.node.height
    );
    // 获取节点的包围盒
    let node_rect = node.getBoundingBoxToWorld();
    return node_rect.intersects(scroll_view_rect);
  }
});

export default c_scroll_view;

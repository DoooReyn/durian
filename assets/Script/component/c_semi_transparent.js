/**
 * 半透明层
 * - 通过引用计数配合c_ui_base来实现自动管理
 * - 一般地，弹窗都需要半透层，因此可以在弹窗ui中开启maskable属性
 * - 透明度根据需要自行调整该节点的opacity属性即可
 *
 * @class c_semi_transparent
 */
export default cc.Class({
  extends: cc.Component,

  editor: {
    disallowMultiple: true
  },

  ctor() {
    this.__refs = 0;
  },

  onLoad() {},

  /**
   * 检查引用计数，根据引用计数控制节点的启用与禁用
   * @param {number} symbol 正负值，1或-1
   */
  check(symbol = 0) {
    this.__refs += symbol;
    this.__refs = Math.max(0, this.__refs);
    let enable = this.__refs > 0;
    console.log("semi_transparent ref: ", this.__refs);
    if (this.node.active === enable) return;
    this.node.active = enable;
  },

  /**
   * 增引用
   */
  increase() {
    this.check(1);
  },

  /**
   * 减引用
   */
  decrease() {
    this.check(-1);
  }
});

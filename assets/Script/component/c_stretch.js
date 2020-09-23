/**
 * 适配组件
 * - 根据Canvas进行适配
 */
export default cc.Class({
  extends: cc.Component,

  editor: {
    requireComponent: cc.Widget,
    disallowMultiple: true,
    executeInEditMode: true
  },

  resetInEditor() {
    this.layout();
  },

  /**
   * 适配布局
   */
  layout() {
    // 如果在编辑器模式并且该节点属于预制体，则不进行适配
    if(CC_EDITOR && this.node._prefab) return;

    let widget = this.getComponent(cc.Widget);
    widget.target = cc.find("Canvas");
    let size = widget.target.getContentSize();
    widget.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
    this.node.setContentSize(size);
    this.node.setPosition(0, 0);
    widget.isAlignTop = widget.isAlignBottom = widget.isAlignLeft = widget.isAlignRight = true;
    widget.top = widget.bottom = widget.left = widget.right = 0;
    widget.updateAlignment();
  },

  onEnable() {
    this.layout();
  }
});

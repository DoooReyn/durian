/**
 * i18n 文本组件
 * @module c_i18n
 * @requires cc.Component
 */
cc.Class({
  extends: cc.Component,

  editor: {
    requireComponent: cc.Label,
    disallowMultiple: true
  },

  onLostFocusInEditor() {
    this.update_text();
  },

  properties: {
    text: ""
  },

  onLoad() {
    this.label = this.node.getComponent(cc.Label);
    this.update_text();
  },

  onEnable() {
    cc.durian.event.on(cc.durian.immutable.event.change_language, this.update_text, this);
  },

  onDisable() {
    cc.durian.event.off(this.update_text, this);
  },

  /**
   * 更新i18n文本
   */
  update_text() {
    this.label.string = cc.durian.i18n.text(this.text);
  }
});

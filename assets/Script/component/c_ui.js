import c_ui_base from "./c_ui_base";

/**
 * ui管理组件
 * - ui出栈要按照先入后出原则，避免依赖产生不可预知的错误
 * - 不同层之间禁止穿透
 *
 * @class c_ui
 */
export default cc.Class({
  extends: cc.Component,

  editor: {
    disallowMultiple: true
  },

  properties: {
    stack: {
      default: [],
      type: [cc.Node],
      visible: false
    }
  },

  onLoad() {
    for (let child of this.node.children) {
      this[child.name] = child;
    }
    cc.durian.app.c_semi_transparent = this.semi_transparent.getComponent("c_semi_transparent");
  },

  /**打印ui stack */
  dump_ui_stack() {
    let stack_log = [];
    stack_log.push("> ui stack");
    for (let item of this.stack) {
      console.log(item.path, item.closable);
      let s = "  > {0}/{1}  closable: {2}".format(
        item.node.parent.name,
        item.node.name,
        item.closable
      );
      stack_log.push(s);
    }
    console.log(stack_log.join("\n"));
  },

  /**
   * UI加载
   * @param {string} path ui资源路径
   * @param {function} loaded ui加载完成回调
   */
  load_ui_prefab(path, loaded) {
    cc.durian.c_statics.load(path, cc.Prefab, (prefab) => {
      if (prefab.data.getComponent(c_ui_base)) {
        loaded && loaded(prefab);
      } else {
        cc.error("预制体[%s]不是ui节点，无法添加", path);
        cc.durian.c_statics.unload(path);
      }
    });
  },

  /**
   * 获取ui节点
   * @param {string} path ui预制体资源路径
   * @return {cc.Node} ui节点
   */
  get(path) {
    let index = this.stack.findIndex((item) => {
      return item.path === path;
    });
    if (index > -1) {
      return this.stack[index];
    }
    return null;
  },

  /**
   * 打开ui
   * @param {string} path ui预制体资源路径
   */
  open(path) {
    let index = this.stack.findIndex((item) => {
      return item.path === path;
    });
    if (index > -1) {
      return cc.warn("ui[%s]已打开", path);
    }
    this.load_ui_prefab(path, (prefab) => {
      let node = cc.instantiate(prefab);
      let ui = node.getComponent(c_ui_base);
      let type = c_ui_base.UI_TYPE[ui.ui_type];
      let mount_target = this[type];
      if (!mount_target) {
        mount_target = this.layer;
        cc.warn("无法确定ui节点[%s]的挂载目标，默认挂载到layer，请确认挂载目标", path);
      }
      let closable = ui.closable;
      mount_target.addChild(node);
      this.stack.push({ path, node, closable });
      console.log("正在打开ui[%s] - 目标[%s]", path, mount_target.name);
    });
  },

  /**
   * 关闭当前ui，之后打开该ui
   * @param {string} path ui预制体资源路径
   */
  replace(path) {
    this.pop();
    this.open(path);
  },

  /**
   * ui栈中的节点
   * @typedef StackItem
   * @property {string} path 资源路径
   * @property {cc.Node} node 资源节点
   */
  /**
   * 删除ui栈节点占用的资源
   * @param {StackItem} item ui节点
   */
  __unload(item) {
    if (item && item.path && item.node) {
      let callback = () => {
        item.node.removeFromParent();
        cc.durian.c_statics.unload(item.path);
      };
      let popup = item.node.getComponent("c_popup");
      if (popup) {
        popup.play_exit_animation(callback);
      } else {
        callback();
      }
    }
  },

  /**
   * ui出栈直到指定索引
   * @param {number} index 指定索引
   */
  __closes_by_index(index) {
    index = 0 | index;
    if (index < 0) return;
    let size = this.stack.length;
    if (index >= size) return;

    for (let i = size - 1; i >= index; i--) {
      let item = this.stack[i];
      if (item.closable) {
        this.__unload(item);
        this.stack.splice(i, 1);
      }
    }
  },

  /**
   * 关闭直到指定ui后面的所有ui
   * - 指定ui也会被关闭
   * @param {string} path ui预制体资源路径
   */
  close_to(path) {
    let index = this.stack.findIndex((item) => {
      return item.path === path;
    });
    this.__closes_by_index(index);
  },

  /**
   * 关闭指定ui
   * @param {string} path ui预制体资源路径
   */
  close(path) {
    let index = this.stack.findIndex((item) => {
      return item.path === path;
    });
    if (index > -1) {
      let item = this.stack[index];
      if (item.closable) {
        this.__unload(item);
        this.stack.splice(index, 1);
      }
    }
  },

  /**
   * 关闭ui直到指定ui后面的所有ui
   * - 指定ui不会被关闭
   * @param {string} path ui预制体资源路径
   */
  close_until(path) {
    let index = this.stack.findIndex((item) => {
      return item.path === path;
    });
    this.__closes_by_index(index + 1);
  },

  /**
   * 关闭所有ui
   */
  clear() {
    this.__closes_by_index(0);
  },

  /**
   * 关闭当前ui，即栈顶ui
   */
  pop() {
    this.__closes_by_index(this.stack.length - 1);
  }
});

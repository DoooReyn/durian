/**
 * 标记类型
 * - 可以添加更多标记类型，方便后续开发
 * @enum
 */
let tag_define = cc.Enum({
  // 通用标记，主要使用者灵活使用
  common: 0,
  // 标记此Label忽略设置全局fnt字体
  ignore_fnt: 1
});

/**
 * @file
 * @module c_tag
 * @overview 标记组件
 */
let c_tag = cc.Class({
  extends: cc.Component,

  properties: {
    type: {
      default: tag_define.common,
      type: tag_define
    },

    value: ""
  }
});

/**
 * 查看节点是否包含指定标记类型的 c_tag 组件
 * @param {cc.Node} node 节点
 * @param {tag_define} tag 标记类型
 * @return {boolean} 返回包含结果
 */
function has_c_tag(node, tag) {
  let components = node.getComponents("c_tag");
  for (let c of components) {
    if (c.type === tag) {
      return true;
    }
  }
  return false;
}

/**
 * 获取节点指定标记类型的 c_tag 组件的值
 * @param {cc.Node} node 节点
 * @param {tag_define} tag 标记类型
 * @return {string} 返回标记组件的值
 */
function get_c_tag(node, tag) {
  let components = node.getComponents("c_tag");
  for (let c of components) {
    if (c.type === tag) {
      return c.value;
    }
  }
  return null;
}

export default {
  c_tag,
  tag_define,
  has_c_tag,
  get_c_tag
};

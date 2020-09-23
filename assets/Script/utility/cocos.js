/**
 * 节点树遍历回调
 * @callback traverse_callback
 * @param {cc.Node} node
 */
/**
 * 遍历节点树
 * @param {cc.Node} root 节点树根节点
 * @param {traverse_callback} fn 节点树遍历回调
 */
function traverse_node(root, fn) {
  if (!root || !fn) return;
  cc.js.getClassName(root) === "cc.Node" && fn(root);
  for (let node of root.children) {
    traverse_node(node, fn);
  }
}

/**
 * 遍历场景节点树
 * @param {traverse_callback} fn 节点树遍历回调
 */
function traverse_scene(fn) {
  traverse_node(cc.durian.scene, fn);
}

/**
 * 加载游戏fnt资源文件
 * @param {string} fnt_path fnt字体文件路径
 */
function load_game_fnt(node, fnt_path) {
  node = node || cc.durian.scene;
  cc.durian.c_statics.load(fnt_path, cc.BitmapFont, (fnt) => {
    apply_fnt_to_labels(node, fnt);
  });
}

/**
 * 搜索场景下的Label组件并添加fnt字体
 * @param {cc.Font} fnt 字体句柄
 */
function apply_fnt_to_labels(node, fnt) {
  traverse_node(node, (child) => {
    let label = child.getComponent(cc.Label);
    if (!label) return;
    if (!cc.durian.c_tag.has_c_tag(child, cc.durian.c_tag.tag_define.ignore_fnt)) {
      label.font = fnt;
    }
  });
}

/**
 * 搜索场景下的Label组件并设置国际化文本
 */
function update_i18n_text_for_scene_labels() {
  traverse_scene((node) => {
    node.getComponent("c_i18n")?.update_text();
  });
}

/**
 * 为调试信息节点设置颜色
 * @param {cc.Color} color 颜色
 */
function set_color_for_display_status(color) {
  if (!cc.debug.isDisplayStats()) return;
  let node = cc.find("PROFILER-NODE");
  if (!node) {
    return cc.warn(
      "PROFILER-NODE not exists, please call `set_display_status_color` after scene loaded"
    );
  }
  color = color || cc.durian.immutable.color.amber;
  traverse_node(node, (n) => {
    n.color = color;
  });
}

/**
 * 获取节点在场景树中的树路径
 * @param {cc.Node} node 节点
 * @return {string} 节点路径
 */
function get_node_url(node) {
  let path = [];
  while (node.parent) {
    path.push(node.name);
    node = node.parent;
  }
  return path.reverse().join("/");
}

/**
 * 对贴图启用抗锯齿
 * @param {cc.Texture2D} tex 贴图
 * @param {boolean} enabled 是否启用抗锯齿
 */
function enable_anti_aliasing(tex, enabled) {
  const { LINEAR, NEAREST } = cc.Texture2D.Filter;
  let filter = enabled ? LINEAR : NEAREST;
  tex && tex.setFilters(filter, filter);
}

/**
 * 将摄像机内容转化为Base64图片数据，相当于截屏
 * @param {cc.Camera} camera 摄像机
 */
function render_camera_as_image_uri(camera) {
  camera = camera || cc.durian.camera;
  let texture = new cc.RenderTexture();
  let gl = cc.game._renderContext;
  texture.initWithSize(cc.visibleRect.width, cc.visibleRect.height, gl.STENCIL_INDEX8);
  camera.targetTexture = texture;
  camera.render();
  camera.targetTexture = null;

  let data = texture.readPixels();
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  canvas.width = texture.width;
  canvas.height = texture.height;

  let width = texture.width;
  let height = texture.height;
  let rowBytes = width * 4;
  for (let row = 0; row < height; row++) {
    let s_row = height - 1 - row;
    let imageData = ctx.createImageData(width, 1);
    let start = s_row * width * 4;
    for (let i = 0; i < rowBytes; i++) {
      imageData.data[i] = data[start + i];
    }
    ctx.putImageData(imageData, 0, row);
  }
  return canvas.toDataURL("image/jpeg");
}

/**
 * 获取或添加组件
 * @param {cc.Component | cc.Node} com_or_node 组件类型
 * @param {cc.Component} component 组件类型
 * @return {cc.Component} 组件
 */
function get_or_add_component(com_or_node, component) {
  return com_or_node.getComponent(component) || com_or_node.addComponent(component);
}

/**
 * 获取帧数的时间
 * @param {number} frames 帧数
 */
function time_for_frame(frames) {
  frames = Math.max(0, 0 | frames);
  return frames / cc.game.getFrameRate();
}

/**
 * 触摸点是否在目标节点内部
 * @param {cc.Event.EventTouch} event 触摸事件
 * @param {cc.Node} node 目标节点
 * @return {boolean} 返回包含结果
 */
function touch_point_inside_of_node(event, node) {
  let left_bottom_local_point = cc.v2(
    node.x - node.anchorX * node.width,
    node.y - node.anchorY * node.height
  );
  let left_bottom_world_point = node.parent.convertToWorldSpaceAR(left_bottom_local_point);
  let win_frame_rect = cc.rect(
    left_bottom_world_point.x,
    left_bottom_world_point.y,
    node.width,
    node.height
  );
  let point = event.getLocation();
  return win_frame_rect.contains(point);
}

/**
 * 垂直滑动至指定Item
 * @param {cc.ScrollView} view 滚动视图
 * @param {number} item_sequence 指定Item序号
 * @param {number} time_in_second 滚动时间
 */
function scroll_vertical_to_item(view, item_sequence = 0, time_in_second = 0.1) {
  if (!view || !item_sequence) return;
  let item = view.content.children[item_sequence];
  if (!item) return;
  let pos_y = -item.y - item.height * 0.5;
  view.scrollToOffset(cc.v2(0, pos_y), time_in_second);
  view.getComponent("c_scroll_view")?.optimize_drawcall();
}

/**
 * 水平滑动至指定Item
 * @param {cc.ScrollView} view 滚动视图
 * @param {number} item_sequence 指定Item序号
 * @param {number} time_in_second 滚动时间
 */
function scroll_horizontal_to_item(view, item_sequence = 0, time_in_second = 0.1) {
  if (!view) return;
  let item = view.children[item_sequence];
  if (!item) return;
  let pos_x = -item.x - item.width * 0.5;
  view.scrollToOffset(cc.v2(pos_x, 0), time_in_second);
  view.getComponent("c_scroll_view")?.optimize_drawcall();
}

/**
 * cocos API 扩展
 * @file
 * @module cocos
 */
export default {
  get_node_url,
  traverse_node,
  load_game_fnt,
  traverse_scene,
  time_for_frame,
  apply_fnt_to_labels,
  enable_anti_aliasing,
  get_or_add_component,
  scroll_vertical_to_item,
  scroll_horizontal_to_item,
  render_camera_as_image_uri,
  touch_point_inside_of_node,
  set_color_for_display_status,
  update_i18n_text_for_scene_labels
};

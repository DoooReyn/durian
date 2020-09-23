/**
 * 此组件用于放置经常使用的静态资源， 你可以将静态资源挂载到此组件下，
 * 然后通过`cc.durian.c_statics.get`方法来获取并使用。
 * 你也可以通过`cc.durian.c_statics.load`方法来获取资源（包括静态
 * 资源和动态资源）。
 * @module c_statics
 */
let c_statics = cc.Class({
  extends: cc.Component,

  editor: {
    requireComponent: cc.Canvas
  },

  properties: {
    assets: {
      default: [],
      type: cc.Asset
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.static_assets_map = new Map();
    this.dynamic_assets_map = new Map();
  },

  start() {
    for (let asset of this.assets) {
      this.static_assets_map.set("statics/" + asset.name, asset);
    }
  },

  /**
   * 获取静态资源
   * @param {string} path 静态资源路径
   * @return {cc.Asset} 静态资源
   */
  get(path) {
    return this.static_assets_map.get(path);
  },

  /**
   * 获取动态资源
   * @param {string} path 动态资源路径
   * @return {cc.Asset} 动态资源
   */
  get_dynamic(path) {
    return this.dynamic_assets_map.get(path);
  },

  /**
   * 获取图集中的精灵帧
   * @param {string} atlas_path 图集名称
   * @param {string} texture_name 图片名称
   * @return {cc.SpriteFrame} 精灵帧
   */
  get_sprite_frame(atlas_path, texture_name) {
    atlas_path += ".plist";
    let asset = this.get(atlas_path) || this.get_dynamic(atlas_path);
    if (asset) return asset.getSpriteFrame(texture_name);
    return null;
  },

  /**
   * 获取资源
   * - 对动态资源增加引用计数
   *
   * @param {string} path 资源路径
   * @param {cc.Asset} type 资源类型
   * @param {function} path 资源加载完成回调
   */
  load(path, type, fn) {
    let asset = this.get(path) || this.get_dynamic(path);
    if (!asset) {
      cc.resources.load(path, type, (err, asset) => {
        if (err) return cc.error(path, err);
        console.log("动态资源[%s]已加载", path);
        this.dynamic_assets_map.set(path, asset);
        asset.addRef();
        fn(asset);
      });
    } else {
      fn(asset);
    }
  },

  /**
   * 卸载资源
   * - 不允许卸载静态资源
   * - 对动态资源移除引用计数，并释放资源
   *
   * @param {string} path 资源路径
   */
  unload(path) {
    let asset = this.get_dynamic(path);
    if (asset) {
      asset.decRef();
      asset.refCount <= 0 && cc.assetManager.releaseAsset(asset);
      this.dynamic_assets_map.delete(path);
      console.log("动态资源[%s]卸载中", path);
    }
  },

  /**
   * 释放未使用资源
   * - 谨慎使用该接口
   */
  unload_unused() {
    cc.assetManager.releaseUnusedAssets();
    console.log("正在释放未使用的资源");
  }
});

/**
 * 获取资源
 * @param {string} path 资源路径
 * @param {cc.Asset} type 资源类型
 * @param {function} path 资源加载完成回调
 */
function load(path, type, fn) {
  cc.durian.app.c_statics.load(path, type, fn);
}

/**
 * 获取资源
 * @param {string} path 资源路径
 * @param {cc.Asset} type 资源类型
 * @param {function} path 资源加载完成回调
 */
function get(path) {
  return cc.durian.app.c_statics.get(path);
}

/**
 * 卸载资源
 * - 对动态资源移除引用计数，并尝试释放资源
 *
 * @param {string} path 资源路径
 */
function unload(path) {
  cc.durian.app.c_statics.unload(path);
}

export default { c_statics, get, load, unload };

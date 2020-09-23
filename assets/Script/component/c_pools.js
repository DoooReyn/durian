import pool from "../utility/pool";

/**
 * 对象池管理
 * @class c_pool
 */
let c_pools = cc.Class({
  extends: cc.Component,

  ctor() {
    this.__pools = new Map();
  },

  properties: {
    clean_interval: {
      tooltip: "对象池清理间隔",
      type: cc.Integer,
      default: 60
    }
  },

  onLoad() {
    this.__pools.clear();
  },

  onEnable() {
    this.__schedule_to_reset();
  },

  onDisable() {
    this.unschedule(this.__reset_pools);
  },

  /**
   * 定时重置对象池
   */
  __schedule_to_reset() {
    this.unschedule(this.__reset_pools);
    this.schedule(this.__reset_pools, this.clean_interval);
  },

  /**
   * 重置对象池
   */
  __reset_pools() {
    if (this.__pools.size === 0) return;
    this.__pools.forEach(function (pool_data) {
      pool_data.pool.reset();;
    });
  },

  /**
   * 检查对象池是否存在
   * @param {string} prefab_path 预制体资源路径
   * @return {boolean} 对象池是否存在
   */
  __exists(prefab_path) {
    let ret = this.__pools.has(prefab_path);
    if (!ret) cc.error("对象池[%s]不存在", prefab_path);
    return ret;
  },

  /**
   * 创建对象池
   * @param {string} prefab_path 预制体资源路径
   * @param {number} cache 预先缓存数量
   * @param {number} depth 对象池深度
   * @param {function} fn 创建完成回调
   */
  create(prefab_path, cache, depth, fn) {
    cc.durian.c_statics.load(prefab_path, cc.Prefab, (prefab) => {
      let pool_new = new pool(prefab, cache, depth);
      let pool_data = { path: prefab_path, pool: pool_new, cache, depth };
      this.__pools.set(prefab_path, pool_data);
      fn && fn();
    });
  },

  /**
   * 填充对象池
   * @param {string} prefab_path 预制体资源路径
   */
  fill(prefab_path) {
    if (!this.__exists(prefab_path)) return;

    let pool_data = this.__pools.get(prefab_path);
    pool_data.pool.fill();
  },

  /**
   * 重置对象池
   * @param {string} prefab_path 预制体资源路径
   */
  reset(prefab_path) {
    if (!this.__exists(prefab_path)) return;

    let pool_data = this.__pools.get(prefab_path);
    pool_data.pool.reset();
  },

  /**
   * 清理对象池
   * @param {string} prefab_path 预制体资源路径
   */
  clean(prefab_path) {
    if (!this.__exists(prefab_path)) return;

    let pool_data = this.__pools.get(prefab_path);
    pool_data.pool.clean();
  },

  /**
   * 从对象池取出一个对象
   * @param {string} prefab_path 预制体资源路径
   */
  get_item(prefab_path) {
    if (!this.__exists(prefab_path)) return;

    let pool_data = this.__pools.get(prefab_path);
    return pool_data.pool.get_item();
  },

  /**
   * 将一个对象归还到对象池
   * @param {string} prefab_path 预制体资源路径
   */
  back_item(prefab_path, item) {
    if (!this.__exists(prefab_path)) return;

    let pool_data = this.__pools.get(prefab_path);
    pool_data.pool.back_item(item);
  },

  /**
   * 卸载（删除）对象池
   * @param {string} prefab_path 预制体资源路径
   */
  unload(prefab_path) {
    if (!this.__exists(prefab_path)) return;

    let pool_data = this.__pools.get(prefab_path);
    pool_data.pool.clear();
    cc.durian.c_statics.unload(pool_data.path);
    this.__pools.delete(prefab_path);
  },

  /**
   * 获取当前对象池深度
   * @param {string} prefab_path 预制体资源路径
   * @return {number} 深度
   */
  size(prefab_path) {
    if (!this.__exists(prefab_path)) return -1;

    let pool_data = this.__pools.get(prefab_path);
    return pool_data.pool.size();
  }
});

export default c_pools;

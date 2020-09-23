/**
 * 对象池封装
 * @class pool
 */
export default class pool {
  /**
   * 构建一个对象池对象
   * @param {cc.Prefab} prefab 对象池目标预制体
   * @param {number} cache 预先缓存的数量
   * @param {number} depth 对象池深度
   */
  constructor(prefab, cache, depth) {
    cache = cache | 0;
    this.__cache = cache;
    this.__prefab = prefab;
    this.__depth = Math.max(cache, 0 | (depth || cache));
    this.__name = prefab.data.name;
    this.__pool = new cc.NodePool();
    this.__filled = false;
  }

  /**
   * 创建全新的对象
   */
  __new_item() {
    return cc.instantiate(this.__prefab);
  }

  /**
   * 从池子中取出对象
   * @return {cc.Node} 对象
   */
  get_item() {
    return this.__pool.size() > 0 ? this.__pool.get() : this.__new_item();
  }

  /**
   * 归还对象给池子
   * @param {cc.Node} item 对象
   */
  back_item(item) {
    let name = item._prefab?.root.name;
    if (name === this.__name) {
      this.__pool.put(item);
    } else {
      cc.warn("对象{0}不存在或返还到错误的对象池{1}".format(item, this.__name));
    }
  }

  /**
   * 填充池子
   */
  fill() {
    let size = this.__pool.size();
    if (size < this.__cache) {
      for (let i = 0; i < this.__cache - size; i++) {
        this.back_item(this.__new_item());
      }
    }
  }

  /**
   * 重置池子
   */
  reset() {
    let count = this.__pool.size();
    if (count <= this.__depth) return;
    for (let i = 0; i < count - this.__depth; i++) {
      this.get_item().destroy();
    }
    console.log("清理[%s]对象池OK", this.__name);
  }

  /**
   * 清理池子
   */
  clean() {
    this.__pool.clear();
  }

  /**
   * 池子深度
   * @return {number} 深度
   */
  size() {
    return this.__pool.size();
  }
}

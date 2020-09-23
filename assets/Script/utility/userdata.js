/**
 * 获得数据
 * @param {string} key 键名
 * @param {any} def 数据
 */
function get(key, def) {
  let val = cc.sys.localStorage.getItem(key);
  if (Object.is_void(val) && !Object.is_void(def)) {
    set(key, def);
    return def;
  }
  return val;
}

/**
 * 设置数据
 * @param {string} key 键名
 * @param {any} val 数据
 */
function set(key, val) {
  cc.sys.localStorage.setItem(key, val);
}

/**
 * 在原始数值的基础上增加指定值
 * @param {string} key 键名
 * @param {any} val 数据
 */
function increase_int(key, val) {
  let v = parseInt(get(key) || 0);
  set(key, v + val);
}

/**
 * 在原始数值的基础上减少指定值
 * @param {string} key 键名
 * @param {any} val 数据
 */
function decrease_int(key, val) {
  let v = parseInt(get(key) || 0);
  set(key, v + val);
}

/**
 * 如果大于原始数值则设置
 * @param {string} key 键名
 * @param {any} val 数据
 */
function gt_set_int(key, val) {
  let v = parseInt(get(key) || 0);
  val > v && set(key, val);
}

/**
 * 如果小于原始数值则设置
 * @param {string} key 键名
 * @param {any} val 数据
 */
function lt_set_int(key, val) {
  let v = parseInt(get(key) || 0);
  val < v && set(key, val);
}

export default {
  get,
  set,
  increase_int,
  decrease_int,
  gt_set_int,
  lt_set_int
};

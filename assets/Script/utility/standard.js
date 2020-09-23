/**
 * 标准库扩充
 */

// -------------------- 字符串 --------------------

import { base64 } from "../library/base64";

/**
 * 反转次数
 * @private
 * @type {number}
 * @describe 自定义反转次数，但不建议设置太多次，不然字符串可能太长
 */
const __ub64_times__ = 2;
const __unreadable_level__ = 2;
const __unreadable_offset__ = 16;
const __unreadable_range_min__ = 766;
const __unreadable_range_max__ = 879;

/**
 * 字符串反转
 * @return {string} 反转后的字符串
 */
String.prototype.reverse = function () {
  return this.split("").reverse().join("");
};

/**
 * utf8 base64 编码
 * @param {number} times 翻转次数
 * @return {string}
 */
String.prototype.encode_ub64 = function (times = __ub64_times__) {
  let text = this.slice();
  for (let i = 0; i < times; i++) {
    text = base64.encode(text).reverse();
  }
  return text;
};

/**
 * utf8 base64 解码
 * @param {number} times 翻转次数
 * @return {string}
 */
String.prototype.decode_ub64 = function (times = __ub64_times__) {
  let text = this.slice();
  for (let i = 0; i < times; i++) {
    text = base64.decode(text.reverse());
  }
  return text;
};

/**
 * 是否完全的中文字符串
 * @return {boolean} 是否完全的中文字符串
 */
String.prototype.isChinese = function () {
  return /^[\u4E00-\u9FA5]+$/.test(this);
};

/**
 * 去除中文字符
 * @return {string} 返回去除中文字符后的字符串
 */
String.prototype.remove_chinese = function () {
  return this.replace(/[\u4E00-\u9FA5]+/gm, "");
};

/**
 * 使字符串不可阅读
 * @return {string} 不可阅读的字符串
 */
String.prototype.unreadable = function () {
  return Array.prototype.map
    .call(this, (char) => {
      let code1 = String.fromCharCode(char.charCodeAt(0) + __unreadable_offset__);
      let code2 = new Array(__unreadable_level__)
        .fill(0)
        .map(() => {
          return String.fromCharCode(
            Math.random_int(__unreadable_range_min__, __unreadable_range_max__)
          );
        })
        .join("");
      return code1 + code2;
    })
    .join("");
};

/**
 * 恢复不可阅读的字符串
 */
String.prototype.readable = function () {
  return Array.prototype.map
    .call(this, (char, index) => {
      let out = index % (__unreadable_level__ + 1) === 0;
      if (!out) {
        return "";
      }
      return String.fromCharCode(char.charCodeAt(0) - __unreadable_offset__);
    })
    .join("");
};

/**
 * 字符串格式化
 *
 * @example
 * let s = "我叫{0}，我今年{1}岁"
 * let f = s.format("DoooReyn", "18")
 * console.log(f) // 我是DoooReyn，我今年18岁
 *
 * @return {string} 格式化后的字符串
 */
String.prototype.format = function () {
  return this.replace(/\{(\d+)\}/g, (match, index) => {
    return index < arguments.length ? arguments[index] : match;
  });
};

// -------------------- 科学运算 --------------------

/**
 * 检测数字是否处于误差范围
 * @param {number} check_num 待检测的数字
 * @param {number} correct_num 正确的数字
 * @param {number} np_range 正负值范围
 * @return {boolean} 检测结果
 */
Math.in_error_range = function(check_num, correct_num, np_range = 0) {
  return Math.abs(correct_num - check_num) <= Math.abs(np_range);
}

/**
 * 随机整数 [min, max]
 * @param min 下限
 * @param max 上限
 */
Math.random_int = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * 随机浮点数 [min, max]
 * @param min 下限
 * @param max 上限
 * @return {number} 随机数
 */
Math.random_num = function (min, max) {
  return Math.random() * (max - min) + min;
};

/**
 * 整数高位补零
 * @param {number} num 整数
 * @param {number} len 位数
 * @return {string} 高位补零结果
 */
Math.zero_padding_left = function (num, len = 2) {
  num = 0 | num;
  len = 0 | len;
  num = num.toString();
  let fill = len - num.length;
  if (fill <= 0) {
    return num;
  }
  return "0".repeat(fill) + num;
};

// -------------------- 对象 --------------------

/**
 * 对象复制
 * @param {object} v 对象参数
 */
Object.clone = function (v) {
  return JSON.parse(JSON.stringify(v));
};

/**
 * 对象比较
 * @param {object} v1 对象1
 * @param {object} v2 对象2
 * @return {boolean} 对比结果
 */
Object.equal = function (v1, v2) {
  return JSON.stringify(v1) === JSON.stringify(v2);
};

/**
 * 查看数据是否属于空值
 * @param {any} val 数据
 * @return {boolean} 是否空值
 */
Object.is_void = function (val) {
  return val === null || val === undefined;
};

// -------------------- 数组 --------------------

/**
 * 从开始数值生成限制个数的数组
 * @param {number} range 限定个数
 * @param {number} from 开始数值
 */
Array.range = function (range, from) {
  range = Math.max(0, 0 | range);
  from = 0 | from;
  let array = new Array(range).fill(0);
  array = array.map((x, i) => {
    return (x = i + from);
  });
  return array;
};

/**
 * 打乱数组
 * @param {any[]} arr 数组
 */
Array.shuffle = function (arr) {
  for (let i = 1; i < arr.length; i++) {
    const r = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[r]] = [arr[r], arr[i]];
  }
};

/**
 * 随机选取数组中的几个元素
 * @param {any[]} arr
 * @param {number} count
 * @return {any[]} 随机选取的数组元素数组
 */
Array.select = function (arr, count = 1) {
  count = Math.max(1, Math.min(0 | count, arr.length));
  return Array.shuffle(arr.slice(0)).splice(0, count);
};

/**
 * 从数组中移除元素
 * @param {any[]} arr 数组
 * @param {any} val 元素
 * @return {any} 被移除的元素索引
 */
Array.remove_value = function (arr, val) {
  let index = arr.indexOf(val);
  if (index >= 0) {
    arr.splice(index, 1);
  }
  return index;
};

/**
 * 从数组中随机一个元素
 * @param {any[]} arr 数组
 */
Array.random_from = function (arr) {
  let index = Math.randomInt(0, arr.length - 1);
  return arr[index];
};

/**
 * 判断元素是否在数组中
 * @param {any[]} arr 数组
 * @param {any} ele 元素
 * @return {boolean} 判断结果
 */
Array.contains = function (arr, ele) {
  return arr.indexOf(ele) >= 0;
};

/**
 * 获取数组中的最大值
 * @param {number[]} arr 数组
 * @return {number} 数组中的最大值
 */
Array.max = function (arr) {
  return Math.max.apply(Math, arr);
};

/**
 * 获取数组中的最小值
 * @param {number[]} arr 数组
 * @return {number} 数组中的最小值
 */
Array.min = function (arr) {
  return Math.min.apply(Math, arr);
};

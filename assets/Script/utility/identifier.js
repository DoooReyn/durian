/**
 * 标识符id生成器
 * @file
 * @class identifier
 */
class identifier {
  /**
   * 标识符生成器之构造器
   * @constructor
   * @param {string} category
   */
  constructor(category = "#") {
    this.category = category;
    this.id = 0 | (Math.random() * 998);
  }

  /**
   * 获取下一个标识符id
   * @return {string} 下一个标识符id
   */
  next() {
    return this.category + "." + ++this.id;
  }
}

/**
 * 标识id生成器静态方法
 * @static
 * @param {string} category
 * @param {number} id
 * @return {identifier} 标识符id生成器实例
 */
identifier.from = function (category, id) {
  let idf = new identifier(category);
  id !== undefined && (idf.id = 0 | id);
  return idf;
};

export default identifier;

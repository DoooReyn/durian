/**
 * 数据存储key
 */
const STORAGE_KEY = "__userdata__";

/**
 * 数据模板
 */
const TEMPLATE = {
  language: "zh",
  volume_bgm: 1.0,
  volume_snd: 1.0,
  music_on: true,
  coin_current: 0,
  coin_total: 0,
  skin_current: 1,
  skin_own_list: [1],
  single_current_score: 0,
  single_highest_score: 0,
  couple_current_score: 0,
  couple_highest_score: 0
};

/**
 * 本地数据存储管理
 */
class Storage {
  constructor() {
    this.init();
  }

  /**初始化数据对象 */
  init() {
    this.data = Object.assign({}, TEMPLATE);
    let modified = false;
    let value = cc.sys.localStorage.getItem(STORAGE_KEY);
    if (!value) {
      modified = true;
    } else {
      let data = JSON.parse(value);
      for (let key in this.data) {
        if (data[key] !== undefined) {
          this.data[key] = data[key];
          modified = true;
        }
      }
    }
    modified && this.save();
  }

  /**
   * 保存数据到本地
   * - 需要手动调用
   */
  save() {
    let data = JSON.stringify(this.data);
    cc.sys.localStorage.setItem(STORAGE_KEY, data);
  }
}

/**单例实例对象 */
Storage.__instance = null;

/**获取单例实例对象 */
Storage.get_instance = function () {
  if (!Storage.__instance) {
    Storage.__instance = new Storage();
  }
  return Storage.__instance;
};

export default Storage;

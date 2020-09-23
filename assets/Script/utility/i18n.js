import i18n_lang from "../constant/i18n_lang";

/**
 * 是否有效的语言
 * @param {string} lang 语言
 * @param {boolean} warn 是否显示警告
 * @return {boolean} 是否有效的语言
 */
function available(lang, warn = false) {
  let valid = cc.durian.immutable.language.support.indexOf(lang) !== -1;
  !valid && warn && cc.warn("i18n不支持%s语言", lang);
  return valid;
}

/**
 * 获取当前使用语言
 * @return {string} 当前使用语言
 */
function language() {
  let l = cc.durian.storage.data.language;
  if (!l || !available(l)) {
    l = cc.durian.immutable.language.default;
    cc.durian.storage.data.language = l;
  }
  return l;
}

/**
 * 获取i18n国际化文本
 * @param {string} k i18n 索引键
 * @return {string} i18n 国际化文本
 */
function text(k) {
  let l = language();
  let t;
  if (i18n_lang.text[k] && i18n_lang.text[k][l]) {
    t = i18n_lang.text[k][l];
  } else {
    cc.warn("i18n lang:%s key:%s not found.", l, k);
    t = "i18n:unknown";
  }
  return t;
}

/**
 * 更换语言
 * @param {string} lang 语言
 */
function change(lang) {
  if (available(lang, true)) {
    if (language() === lang) return;
    cc.durian.storage.data.language = lang;
    cc.durian.event.emit(cc.durian.immutable.event.change_language, lang);
  }
}

/**
 * i18n 国际化方案
 * @file
 * @module
 */
export default {
  language,
  available,
  text,
  change
};

import weixin from "./weixin";

/**
 * 是否微信平台
 */
function is_wechat() {
  return cc.sys.platform === cc.sys.WECHAT_GAME;
}

/**
 * 检查授权
 * @param {function} cb 检查授权完成回调
 */
function check_authorization(cb) {
  if (is_wechat()) {
    return weixin.check_authorization(cb);
  }
}

/**
 * 提交数据
 */
function commit_data() {
  is_wechat() && weixin.commit_data(JSON.stringify(cc.durian.storage.data));
}

/**
 * 显示排行榜
 * @param {string} rank_mode single|couple
 */
function show_rank(rank_mode) {
  is_wechat() && weixin.show_rank(rank_mode);
}

/**
 * 隐藏子域
 */
function hide_sub_context() {
  is_wechat() && weixin.hide_sub_context();
}

/**
 * 主动分享
 */
function share(data) {
  is_wechat() && weixin.share(data);
}

/**
 * 设置被动分享
 */
function passive_share() {
  is_wechat() && weixin.passive_share();
}

export default {
  is_wechat,
  share,
  passive_share,
  commit_data,
  show_rank,
  hide_sub_context,
  check_authorization
};

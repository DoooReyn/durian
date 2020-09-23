/**检查session */
function check_session() {}

/**获取session */
function code2session() {}

/**登录 */
function sign_in() {}

/**登出 */
function sign_out() {}

/**检查授权 */
function check_authorization(cb) {
  if (window.wx !== undefined) {
    wx.getSetting({
      success(res) {
        if (res.authSetting["scope.userInfo"]) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo);
              wx.postMessage({
                msg_type: "user",
                user_info: res.userInfo
              });
              cb();
            }
          });
        } else {
          request_authorization(cb);
        }
      },
      fail(res) {
        request_authorization(cb);
      }
    });
  }
  return false;
}

/**
 * 请求授权
 */
function request_authorization(cb) {
  wx.getSystemInfo({
    success(res) {
      create_authorization_view(cb, res.screenWidth, res.screenHeight);
    },
    fail(res) {
      create_authorization_view(cb);
    }
  });
}

/**
 * 创建授权按钮
 * @param {number} width 宽
 * @param {number} height 高
 */
function create_authorization_view(cb, width, height) {
  width = width || window.screen.availWidth;
  height = height || window.screen.availHeight;
  let image_scale = 1;
  let image_width = 45 * image_scale;
  let image_height = 52 * image_scale;
  let left = (width - image_width) * 0.5;
  let top = (height - image_height) * 0.5;
  // let image = wx.createImage();
  // image.src = "btn_start.png";
  const button = wx.createUserInfoButton({
    type: "text",
    text: "在排行榜中显示您的名次? (点我)",
    // image: image.src,
    style: {
      left: left,
      top: top,
      width: image_width,
      height: image_height,
      fontSize: 28,
      color: "#ffff00"
    }
  });
  button.onTap((res) => {
    if (res.userInfo) {
      wx.postMessage({
        msg_type: "user",
        user_info: res.userInfo
      });
      cb();
      button.destroy();
    } else {
      wx.showModal({
        title: "提示",
        content: "在排行榜中显示名次需要您的授权。",
        showCancel: false
      });
    }
  });
}

/**提交数据 */
function commit_data(data) {
  if (window.wx !== undefined) {
    console.log("微信提交个人数据：", data);
    wx.postMessage({
      msg_type: "commit",
      data: data
    });
  }
}

/**
 * 显示排行榜
 * @param {string} rank_mode single|couple
 */
function show_rank(rank_mode) {
  if (window.wx !== undefined) {
    console.log("微信显示排行榜：", rank_mode);
    wx.postMessage({
      msg_type: "rank",
      rank_mode: rank_mode
    });
  }
}

/**
 * 隐藏子域
 */
function hide_sub_context() {
  if (window.wx !== undefined) {
    wx.postMessage({
      msg_type: "close"
    });
  }
}

/**
 * 分享
 */
function share(data) {
  if (window.wx !== undefined) {
    let title;
    let image_url = cc.url.raw(`resources/share_card_${Math.random_int(1, 3)}.png`);
    if (data.type === "score") {
      if (data.mode === cc.durian.immutable.game_mode.single) {
        title = `一个人也挺好的，${data.score}分就是最好的证明！快来试试吧！`;
      } else {
        title = `情比金坚！我们合力砍下了${data.score}分！召唤你的另一半测试一下你们的默契吧！`;
      }
    } else if (data.type === "skin") {
      title = "人靠衣装，美靠靓装！新皮肤助我增强实力，快来与我一决高下吧！";
    } else if (data.type === "none") {
      title = "这个游戏好好玩哦！快来与我一起玩耍吧！";
    }
    console.log(title, image_url);
    wx.shareAppMessage({
      title: title,
      imageUrl: image_url,
      success(res) {
        console.log("share success: ", res);
      },
      fail(res) {
        console.log("share failure: ", res);
      }
    });
  }
}

/**
 * 设置被动分享
 */
function passive_share() {
  // 监听小程序右上角菜单的「转发」按钮
  if (window.wx === undefined) {
    return;
  }

  // 显示当前页面的转发按钮
  wx.showShareMenu({
    success: (res) => {
      console.log("开启被动转发成功！", res);
    },
    fail: (res) => {
      console.log("开启被动转发失败！", res);
    }
  });

  wx.onShareAppMessage(() => {
    return {
      title: "这个游戏超好玩！快来与我对战吧！",
      imageUrl: cc.url.raw("resources/share_card_1.png")
    };
  });
}

export default {
  check_session,
  code2session,
  share,
  passive_share,
  sign_in,
  sign_out,
  show_rank,
  commit_data,
  hide_sub_context,
  check_authorization
};

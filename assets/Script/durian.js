/**常量 */
import assets from "./constant/assets";
import immutable from "./constant/immutable";
/**辅助 */
import "./utility/standard";
import identifier from "./utility/identifier";
import cocos from "./utility/cocos";
import audio from "./utility/audio";
import i18n from "./utility/i18n";
import http from "./utility/http";
import userdata from "./utility/userdata";
import storage from "./utility/storage";
import game_state from "./utility/game_state";
import platform from "./platform/platform";
/**默认不启用websocket，如果需要请取消注释相关代码 */
// import websocket from "./utility/websocket";
/**组件 */
import c_tag from "./component/c_tag";
import c_pools from "./component/c_pools";
import c_statics from "./component/c_statics";
import c_ui from "./component/c_ui";

/**
 * Durian 框架组件
 * - Durian 将框架模块挂载到 cc.durian
 * - 需要将此模块挂载到主场景的Canvas节点上
 *
 * @class Durian
 * @type {cc.Component}
 */
let Durian = cc.Class({
  extends: cc.Component,

  editor: {
    requireComponent: cc.Canvas,
    disallowMultiple: true
  },

  resetInEditor() {
    if (!CC_EDITOR) return;
    if (this.getComponent(cc.Canvas)) {
      cc.durian.cocos.get_or_add_component(this, c_statics.c_statics);
      cc.durian.cocos.get_or_add_component(this, c_pools);
    } else {
      cc.error("durian组件必须挂载在Canvas上");
      this.removeComponent(Durian);
      this.removeComponent(c_statics.c_statics);
      this.removeComponent(c_pools);
    }
    this.camera = this.camera || cc.find("Canvas/Main Camera").getComponent(cc.Camera);
  },

  properties: {
    /**主摄像机 */
    camera: {
      tooltip: "主摄像机",
      default: null,
      type: cc.Camera
    },

    /**原始设计分辨率 */
    origin_resolution: {
      tooltip: "原始设计分辨率",
      default: cc.size(640, 960),
      visible: false
    }
  },

  onLoad() {
    // 输出基本信息
    this.dump_basic_info();

    // 设置Durian的App组件
    cc.durian.app = this;

    // 设置Durian的Canvas组件
    cc.durian.canvas = this.getComponent(cc.Canvas);

    // 设置Durian的根节点
    cc.durian.root = this.node;

    // 设置Durian的唯一场景
    cc.durian.scene = cc.director.getScene();

    // 设置Durian主摄像机
    !this.camera && cc.warn("durian组件未配置主摄像机");
    cc.durian.camera = this.camera;

    // 初始化用户数据
    cc.durian.storage = storage.get_instance();

    // 设置Durian静态资源组件
    cc.durian.app.c_statics = this.getComponent(c_statics.c_statics);

    // 设置Durian c_pools组件
    cc.durian.app.c_pools = this.getComponent(c_pools);

    // 注册事件对象
    cc.durian.event = new cc.EventTarget();

    // 页面适配
    this.origin_resolution = cc.durian.canvas.designResolution;
    cc.view.setResizeCallback(this.adapt_screen.bind(this));
    this.adapt_screen();

    // 监听进入前台事件
    cc.game.on(cc.game.EVENT_SHOW, this.on_enter_foreground, this);

    // 监听进入后台事件
    cc.game.on(cc.game.EVENT_HIDE, this.on_enter_background, this);

    // 监听focus、blur事件(测试时使用，方便重复切换前后台)
    if (!cc.durian.immutable.env.release && cc.sys.isBrowser) {
      let game_canvas = document.getElementById("GameCanvas");
      game_canvas.onfocus = this.on_enter_foreground.bind(this);
      game_canvas.onblur = this.on_enter_background.bind(this);
    }
  },

  onDisable() {
    // 退出游戏时记得关闭 websocket
    // cc.durian.websocket.disconnect();
  },

  start() {
    // 切换到当前语言
    cc.durian.i18n.change(cc.durian.i18n.language());

    // 设置调试信息文本颜色
    cc.durian.cocos.set_color_for_display_status();

    // 对场景文本应用游戏位图字体
    cc.durian.cocos.load_game_fnt(cc.durian.scene, cc.durian.assets.game_font_x32);

    // 音频初始化
    cc.durian.audio.init();

    // 平台分享初始化
    cc.durian.platform.passive_share();

    // websocket 初始化连接
    // cc.durian.websocket.connect();

    // 设置Durian ui根节点
    cc.durian.c_statics.load(cc.durian.assets.ui_root, cc.Prefab, (prefab) => {
      let ui_root = cc.instantiate(prefab);
      this.node.addChild(ui_root);
      cc.durian.ui_root = ui_root;
      cc.durian.app.c_ui = ui_root.getComponent(c_ui);

      // 布局基础ui
      cc.durian.app.c_ui.open(cc.durian.assets.notifier_broadcast);
      cc.durian.app.c_ui.open(cc.durian.assets.notifier_bubble);
      cc.durian.app.c_ui.open(cc.durian.assets.notifier_float);
      cc.durian.app.c_ui.open(cc.durian.assets.layer_main);

      // 关闭全局禁用输入节点
      cc.durian.enable_block(false);
    });
  },

  /**输出基本信息 */
  dump_basic_info() {
    console.group("Durian INFO");
    console.log(
      `Durian version：%s\nCreator version: %s\nRelease status: %s\nGame version: %s`,
      cc.durian.builtin.framework_version,
      cc.durian.builtin.cocos_version,
      cc.durian.immutable.env.release,
      cc.durian.immutable.env.version
    );
    console.groupEnd();
  },

  /**页面适配: 根据屏幕大小决定适配策略*/
  adapt_screen() {
    let dr = this.origin_resolution;
    let fs = cc.view.getFrameSize();
    let rw = fs.width;
    let rh = fs.height;
    let fw = rw;
    let fh = rh;
    if (rw / rh > dr.width / dr.height) {
      /*!#zh: 定高模式，是否优先将设计分辨率高度撑满视图高度。*/
      fh = dr.height;
      fw = Math.ceil((fh * rw) / rh);
    } else {
      /*!#zh: 定宽模式，优先将设计分辨率宽度撑满视图宽度。*/
      fw = dr.width;
      fh = Math.ceil((rh / rw) * fw);
    }
    cc.view.setDesignResolutionSize(fw, fh, cc.ResolutionPolicy.UNKNOWN);
    cc.durian.root.width = fw;
    cc.durian.root.height = fh;
    cc._widgetManager.onResized();
    cc.durian.event && cc.durian.event.emit(immutable.event.window_resize);
    console.log("页面适配,原始设计分辨率：{0},当前设计分辨率:{1}".format(dr, cc.size(fw, fh)));
  },

  /**
   * App 进入前台事件处理
   * - 这里继续分发事件，以便在逻辑层进行深层处理
   */
  on_enter_foreground() {
    // 恢复音乐
    cc.durian.audio.resume_all();

    // 分发事件
    cc.durian.event.emit(cc.durian.immutable.event.app_enter_foreground);
  },

  /**
   * App 进入后台事件处理
   * - 这里继续分发事件，以便在逻辑层进行深层处理
   */
  on_enter_background() {
    // 暂停音乐
    cc.durian.audio.pause_all();

    // 分发事件
    cc.durian.event.emit(cc.durian.immutable.event.app_enter_background);
  }
});

/**
 * Durian 框架导出模块
 * - app 上挂载的组件是类实例
 * - durian 上挂载的组件是类实现
 */
cc.durian = {
  /**
   * 基础信息
   * @property information
   */
  builtin: {
    /**
     * cocos 版本号
     * @property cocos
     * @type {string}
     */
    cocos_version: "2.4.2",
    /**
     * 框架版本号
     * @property framework
     * @type {string}
     */
    framework_version: "0.0.1",
    /**
     * 作者列表
     * @property author
     * @type {string[]}
     */
    author: ["DoooReyn<jl88744653@gmail.com>"]
  },
  /**
   * Durian 框架组件实例
   * @instance
   * @type {Durian}
   * @property app
   */
  app: null,
  /**
   * Durian 场景根节点
   * @type {cc.Node}
   * @property root
   */
  root: null,
  /**
   * Durian 场景唯一画布
   * @type {cc.Canvas}
   * @property canvas
   */
  canvas: null,
  /**
   * Durian 当前场景
   * - Durian 使用单场景
   * - 也就是说 Durian 有且只有一个场景
   * @type {cc.Scene}
   * @property scene
   */
  scene: null,
  /**
   * Durian 主摄像机
   * @type {cc.Camera}
   * @property main_camera
   */
  camera: null,
  /**
   * Durian 资源路径
   * @property assets
   */
  assets,
  /**
   * Durian 常量定义
   * @property immutable
   */
  immutable,
  /**
   * 用户数据 常量定义
   * @property userdata
   */
  userdata,
  /**
   * Durian cocos 通用方法
   * @property cocos
   */
  cocos,
  /**
   * Durian 标识ID生成器
   * @property identifier
   */
  identifier,
  /**
   * Durian i18n国际化
   * @property i18n
   */
  i18n,
  /**
   * Durian 游戏状态管理
   * @property game_state
   */
  game_state,
  /**
   * Durian 标记组件和方法
   * @property c_tag
   */
  c_tag,
  /**
   * Durian 静态资源组件
   * @property c_statics
   */
  c_statics,
  /**
   * Durian http模块
   * @property http
   */
  http,
  /**
   * Durian audio模块
   * @property audio
   */
  audio,
  /**
   * Durian platform模块
   * @property platform
   */
  platform,
  /**
   * Durian 本地存储模块
   * @property storage
   * @type {storage}
   */
  storage: null,
  /**
   * 空调用，不作任何事情
   * @function
   */
  idle_call() {},
  /**
   * 开启或关闭全局禁用输入节点
   * @param {boolean} 开启/关闭
   */
  enable_block(enable) {
    cc.durian.app.c_ui.block.active = enable;
  }
  /**
   * Durian websocket模块
   * @property websocket
   */
  // websocket
};

import c_ui_base from "./c_ui_base";

/**
 * 滚动播报组件
 * @class
 */
export default cc.Class({
  extends: c_ui_base,

  properties: {
    ui_type: {
      type: c_ui_base.UI_TYPE,
      default: c_ui_base.UI_TYPE.notifier,
      override: true,
      readonly: true
    },
    background: {
      default: null,
      type: cc.Node
    },
    news_container: {
      default: null,
      type: cc.Node
    },
    news_template: {
      default: null,
      type: cc.Node
    },
    speed: {
      default: 320
    },
    opacity: {
      default: 64,
      type: cc.Integer,
      min: 0,
      max: 255
    }
  },

  ctor() {
    this.playing = false;
    this.news = [];
    this.to_play = [];
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.playing = false;
    this.news.length = 0;
    this.to_play.length = 0;
    this.background.opacity = 0;
    this.news_container.removeAllChildren();
    this.news_container.x = cc.durian.root.width;
    this.node.zIndex = cc.durian.immutable.z_index.notifier_broadcast;
    cc.durian.app.c_notifier_broadcast = this;
  },

  /**
   * 清空消息列表
   */
  clear() {
    this.news.length = 0;
  },

  /**
   * 消息内容
   * @typedef NewsInfo
   * @property {string} news 消息
   * @property {number} time 播报次数
   */
  /**
   * 推送消息
   * @param {NewsInfo} news_info 消息内容
   */
  push(news_info) {
    if (news_info && news_info.news && news_info.time > 0) {
      this.news.push(news_info);
      this.next();
    }
    return this;
  },

  /**
   * 播报下一个消息
   */
  next() {
    if (this.playing) return;
    let news_info = this.news.shift();
    if (!news_info) return;

    this.playing = true;

    /**
     * - 删除消息容器上的所有节点
     * - 添加消息节点
     * - 由于消息容器布局刷新存在延时，故放到延迟两帧后去展示滚动消息
     */
    this.news_container.removeAllChildren();
    for (let i = 0; i < news_info.time; i++) {
      let node = cc.instantiate(this.news_template);
      this.news_container.addChild(node);
      node.active = true;
      node.getComponent(cc.Label).string = news_info.news;
    }
    this.scheduleOnce(() => {
      // 将消息容器放到页面最右端
      this.news_container.x = cc.durian.root.width;

      // 计算消息容器需要移动的距离
      let distance = this.news_container.width + this.news_container.x;

      // 消息展示前
      let _news_before_show = () => {
        cc.tween(this.background).to(0.5, { opacity: this.opacity }).call(_news_to_show).start();
      };
      // 消息准备展示
      let _news_to_show = () => {
        cc.tween(this.news_container)
          .by(distance / this.speed, { x: -distance })
          .call(_news_after_show)
          .start();
      };
      // 消息显示完成后
      let _news_after_show = () => {
        this.news_container.removeAllChildren();
        this.news_container.x = cc.durian.root.width;
        cc.tween(this.background)
          .to(0.5, { opacity: 0 })
          .call(() => {
            this.playing = false;
            this.next();
          })
          .start();
      };
      // 准备一次消息轮播
      _news_before_show();
    }, cc.durian.cocos.time_for_frame(2));
  }
});

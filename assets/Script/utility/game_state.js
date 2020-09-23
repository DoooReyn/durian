/**游戏状态 */
const Game_State = cc.Enum({
  /**无状态 */
  None: 0,
  /**就绪 */
  Ready: 1,
  /**运行 */
  Running: 2,
  /**暂停 */
  Pause: 3,
  /**结束 */
  Over: 4
});

/**
 * 游戏状态管理
 * @class game_state
 */
class game_state {
  /**
   * 初始化
   */
  __init() {
    this.state = Game_State.None;
  }

  /**
   * 查看当前游戏状态是否与目标匹配
   * @param {Game_State} state 输入状态
   * @return {boolean} 匹配结果
   */
  is(state) {
    return this.state === state;
  }

  /**
   * 是否就绪
   * @return {boolean} 是否就绪
   */
  is_ready() {
    return this.is(Game_State.Ready);
  }

  /**
   * 是否运行中
   * @return {boolean} 是否运行中
   */
  is_running() {
    return this.is(Game_State.Running);
  }

  /**
   * 是否暂停中
   * @return {boolean} 是否暂停中
   */
  is_pause() {
    return this.is(Game_State.Pause);
  }

  /**
   * 是否已结束
   * @return {boolean} 是否已结束
   */
  is_over() {
    return this.is(Game_State.Over);
  }

  /**
   * 切换游戏状态到目标状态
   * @param {Game_State} state 输入状态
   */
  change(state) {
    switch (state) {
      case Game_State.Ready:
        this.on_change_to_ready();
        break;
      case Game_State.Running:
        this.on_change_to_running();
        break;
      case Game_State.Pause:
        this.on_change_to_pause();
        break;
      case Game_State.Over:
        this.on_change_to_over();
        break;
      default:
        cc.warn("不可预测的状态", state);
        break;
    }
  }

  /**
   * 尝试切换到就绪状态
   */
  on_change_to_ready() {
    if (this.is(Game_State.None) || this.is(Game_State.Over)) {
      this.state = Game_State.Ready;
      cc.durian.event.emit(cc.durian.immutable.event.game_state_ready);
      console.log("游戏状态已切换到%s", Game_State[this.state]);
    } else {
      cc.warn("尝试%s但失败，当前状态%s", Game_State[Game_State.Ready], Game_State[this.state]);
    }
  }

  /**
   * 尝试切换到运行状态
   */
  on_change_to_running() {
    if (this.is(Game_State.Ready) || this.is(Game_State.Pause)) {
      this.state = Game_State.Running;
      cc.durian.event.emit(cc.durian.immutable.event.game_state_running);
      console.log("游戏状态已切换到%s", Game_State[this.state]);
    } else {
      cc.warn("尝试%s但失败，当前状态%s", Game_State[Game_State.Running], Game_State[this.state]);
    }
  }

  /**
   * 尝试切换到暂停状态
   */
  on_change_to_pause() {
    if (this.is(Game_State.Running)) {
      this.state = Game_State.Pause;
      cc.durian.event.emit(cc.durian.immutable.event.game_state_pause);
      console.log("游戏状态已切换到%s", Game_State[this.state]);
    } else {
      cc.warn("尝试%s但失败，当前状态%s", Game_State[Game_State.Pause], Game_State[this.state]);
    }
  }

  /**
   * 尝试切换到结束状态
   */
  on_change_to_over() {
    if (this.is(Game_State.Running)) {
      this.state = Game_State.Over;
      cc.durian.event.emit(cc.durian.immutable.event.game_state_over);
      console.log("游戏状态已切换到%s", Game_State[this.state]);
    } else {
      cc.warn("尝试%s但失败，当前状态%s", Game_State[Game_State.Over], Game_State[this.state]);
    }
  }
}

/**挂载游戏状态类的单例对象 */
game_state.__instance = null;

/**
 * 获取游戏状态类单例
 * @return {game_state} 游戏状态类单例对象
 */
game_state.getInstance = function () {
  if (!game_state.__instance) {
    game_state.__instance = new game_state();
    game_state.__instance.__init();
  }
  return game_state.__instance;
};

/**
 * 导出游戏状态实例
 * @type {game_state}
 */
export default {
  Game_State,
  class: game_state,
  instance: game_state.getInstance()
};

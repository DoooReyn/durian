# Durian 框架

**Durian**是一个基于 Cocos Creator 2D 的自用框架。

## 框架说明

### 设计思想

- 框架与逻辑分开，框架只做基础的事情，需要逻辑参与的地方使用事件分发给逻辑层去做
- 单场景，UI 使用 Prefab 制作，动态加载和卸载（方便清理资源）
- UI 在框架注入时就划定分层以保证 UI 之间的独立性，不建议运行时去改变层级，比如窗口挂载在`layer`上，而弹窗则挂载在`popup`上，UI 之间；
- UI 之间通过事件传递消息；
- 资源
  - 静态资源
    - 需要放在 `assets/statics` 目录下
    - 需要将静态资源挂载到 `c_statics` 组件
  - 动态资源
    - 位于 `resources` 目录下

### 代码结构

- Script
  - component 组件：以`c_`开头
    - `c_animation` 简单的帧动画播放组件
    - `c_button` 按钮点击音效组件
    - `c_draggable` 节点拖动组件
    - `c_i18n` 国际化文本组件
    - `c_notifier_broadcast` 广播消息通知组件
    - `c_notifier_bubble` 气泡消息通知组件
    - `c_notifier_float` 飘字消息通知组件
    - `c_pools` 对象池管理组件
    - `c_popup` ui 弹窗组件，继承自 c_ui_base
    - `c_scroll_item` 优化的滑动 Item 组件
    - `c_scroll_view` 优化的 ScrollView 组件
    - `c_semi_transparent` 半透层组件，全局唯一，配合 c_popup，自动启用和禁用
    - `c_statics` 资源管理组件
    - `c_stretch` Canvas 适配组件
    - `c_tag` 标记组件
    - `c_trace_shadow` 精灵帧影子生成组件，自用
    - `c_ui_base` ui 基类组件
    - `c_ui` ui 管理组件
  - constant 常量定义与游戏配置
    - `assets` 自动生成的资源路径映射文件
    - `config` 自动生成的策划配置文件
    - `i18n_lang` 自动生成的国际化配置文件
    - `immutable` 游戏常量定义文件
  - library 第三方库
    - `base64` 支持 utf8 编码的 base64 库
  - logic 游戏逻辑控制（开发者在此目录下编写游戏逻辑）
    - ...
  - platform 平台相关代码
    - `platform` 平台整合脚本
    - `weixin` 微信小游戏接口
    - 未来增加更多平台
  - utility 管理器与工具方法集合
    - `audio` 音频控制管理器
    - `cocos` cocos 相关方法集合
    - `game_state` 游戏状态管理器
    - `http` http 简单封装
    - `i18n` i18n 国际化工具
    - `identifier` 全局标识 id 生成器
    - `pool` 对象池封装
    - `standard` 标准库扩展与通用方法集合
    - `storage` json 格式的本地用户数据管理器
    - `websocket` websocket 简单封装

### 习惯说明

- 导入模块不使用**Cocos Creator**官方 JS 版的`require`，改用**ES6**的`import`
- 类似地，导出模块也使用**ES6**的`export`或`export default`

### 为什么不用 TS？

- 我学过一段时间的 TS，也用 TS 做过一段时间的开发，不得不说，TS 静态类型在对代码质量的把控很好，毕竟写代码要循规蹈矩以符合预期，出错的几率就已经降低很多了；
- 但是相应的，静态类型也是一种限制，一个原因是 TS 要写大量的类型定义，一个完整的工程可能有 1/3 都是类型定义，用 TS 开发界的调侃的话来说就是**type 编程**；另一个原因是 TS 不方便在已有对象上挂载临时属性（要做也是可以的，但是这样做对 TSer 来说很傻又不好看，况且提示也不好），对习惯动态语言的开发者来说简直不要太痛苦；
- 以上两点是我使用 TS 以来感受最明显的，况且我觉得使用`jsdoc`就可以简单地达到类似 TS 的类型定义的效果，对代码提示和质量都是挺好的，这样就不需要拘谨于严格的类型定义，只要注意写好注释就可以了（当然，不要忘了判断数据类型，毕竟注释只能是注释，对于运行的代码没有任何实际的影响）；
- 还有一个重要的原因是，使用者只需要掌握 JS，不用特地去学习 TS，这样可以降低入门门槛，大家看代码也方便；
- 综合下来，还是选了 JS。

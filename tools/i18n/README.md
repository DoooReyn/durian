# i18n 工具使用说明

## 说明

- `i18n.xlsx`
  - i18n翻译配置
- `i18n.js`
  - i18n nodejs 脚本
    - 读取配置`i18n.xlsx`
    - 生成游戏可用的`i18n_lang.js`脚本
    - 提取国际化文本中的中文到文件`fnt-zh-auto.txt`
- `fnt-convert.py`
  - 将文本转换为位图字体文件的python脚本
  - 要求python3, 当前使用版本3.7.8，其他版本未测试
  - 需要安装**PIL**模块：`pip3 install pillow`
- `fnt-writer.py`
  - 将信息写入fnt的python脚本
- `fnt-words.ini`
  - 特殊字符转换字典的配置文件
- `fnt-target.ini`
  - 使用此文件指定需要转换的配置
- `fnt-game-font.ini`
  - 字符转换的配置文件
- `fnt-zh-auto.txt`
  - 由`i18n.js`自动生成的中文字符文件
- `fnt-zh-extra.txt`
  - 用户可以自定义的额外的中文字符文件
- `install.bat`
  - 安装必要的依赖
- `run.bat`
  - 运行脚本程序

## 使用

1. 双击运行 `install.bat`，安装必要依赖，成功后就不用再运行了
2. 双击运行 `run.bat`，生成国际化文本配置和位图字体

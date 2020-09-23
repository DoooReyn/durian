const path = require("path");
const file = require("fs");
const conf = {
  // 资源目录
  assets: {
    // 动态资源
    dynamic: path.resolve(__dirname, "../../assets/resources"),
    // 静态资源
    statics: path.resolve(__dirname, "../../assets/statics")
  },
  // 脚本保存路径
  save_at: path.resolve(__dirname, "../../assets/Script/constant/assets.js")
};

console.log("配置：", conf);

let resources = {};

// 遍历目录
function walk_dir(key, root, dir) {
  let files = file.readdirSync(dir);
  for (let i = 0; i < files.length; i++) {
    let file_path = path.join(dir, files[i]);
    let stat = file.statSync(file_path);
    if (stat.isDirectory()) {
      walk_dir(key, root, file_path);
    } else if (stat.isFile() && !file_path.endsWith(".meta") && files[i] !== ".DS_Store") {
      let paths = file_path
        .split(root + path.sep)
        .pop()
        .split(".")[0]
        .split(path.sep);
      let k = paths[paths.length - 1];
      key !== "dynamic" && paths.unshift(key);
      resources[k] = paths.join("/");
    }
  }
}

// 生成脚本
function run() {
  for (let key in conf.assets) {
    let path = conf.assets[key];
    walk_dir(key, path, path);
  }

  let content = `// 此脚本由程序自动生成，不要直接修改\nexport default ${JSON.stringify(
    resources,
    null,
    "  "
  )};\n`;
  file.writeFileSync(conf.save_at, content, { encoding: "utf8" });

  console.log("\n预览：");
  console.log(resources);
  console.log("\n保存：", conf.save_at);
}

run();

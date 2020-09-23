const fs = require("fs");
const path = require("path");
const xlsx = require("node-xlsx").default;

const RAW_PATH = path.resolve(__dirname, "i18n.xlsx");
const CHARS_PATH = path.resolve(__dirname, "fnt-zh-auto.txt");
const SAVE_PATH = path.resolve(__dirname, "../../assets/Script/constant/i18n_lang.js");

const workSheets = xlsx.parse(RAW_PATH);
for (let i = 0; i < workSheets.length; i++) {
  let sheet = workSheets[i];
  // let name = sheet.name;
  let data = sheet.data;
  let chars = "";
  let file = SAVE_PATH;
  if (data.length < 2) continue;

  // 组织 text
  let json = {};
  let enums = {};
  let keys = data[0];
  for (let j = 1; j < data.length; j++) {
    let item = data[j];
    let primary_key = item[0];
    json[primary_key] = {};
    keys.forEach((k, d) => {
      if (d > 0) {
        json[primary_key][k] = item[d] || `!!!error ${primary_key}`;
        item[d] && (chars += item[d]);
      }
    });
  }

  // 组织 key
  Object.keys(json).forEach((k, i) => {
    enums[k] = k;
  });

  // 写入脚本
  const enum_export = `const key = ${JSON.stringify(enums, null, 2)};\n\n`;
  const content = `const text = ${JSON.stringify(json, null, 2)};\n`;
  let text = enum_export + content + "export default {key, text};\n";
  fs.writeFileSync(file, text, { encoding: "utf8" });
  console.log("脚本预览：", text);

  // 写入字符集
  chars = chars.match(/[\u4e00-\u9fa5]/g).join("");
  chars = Array.from(new Set(chars.split(""))).join("");
  fs.writeFileSync(CHARS_PATH, chars, { encoding: "utf8" });
  console.log("中文字符集：", chars);

  break;
}

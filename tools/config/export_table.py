#!/usr/bin/python
# -*- coding: UTF-8 -*-

import os
import json

ROOT = "./"
EXT = ".csv"
SAVE = "../../assets/Script/constant/config.js"
ENCODING_CSV = "UTF-8-sig"
ENCODING_JSON = "UTF-8"
PREFIX_JSON = "export default "
PREFIX_LINES = 3
TABLES = {}


def save_as_json():
    """保存为配置文件
    """
    with open(SAVE, "w", encoding=ENCODING_JSON) as f:
        f.write(PREFIX_JSON + json.dumps(TABLES))


def convert_type(value, value_type):
    """转换数据类型
    """
    try:
        if value_type == "int":
            v = int(value)
        elif value_type == "number":
            v = float(value)
        else:
            v = value
    except ValueError as e:
        v = str(value)
    return v


def convert_file(file_path):
    """转换csv配置文件
    """
    table_sheet = {}
    table_name = os.path.splitext(os.path.basename(file_path))[0]
    with open(file_path, "r", encoding=ENCODING_CSV) as f:
        lines = [line.split(",") for line in f.read().split("\n")]
        if len(lines) <= PREFIX_LINES:
            print("err: " + file_path)
            return
        comments, fields, types, *lines = lines
        length = len(fields)
        for index in range(0, len(lines)):
            record = lines[index]
            primary_key = record[0]
            if len(record) == length:
                table_sheet[primary_key] = {}
                for i, v in enumerate(record):
                    cv = convert_type(v, types[i])
                    table_sheet[primary_key][fields[i]] = cv
        TABLES[table_name] = table_sheet


def walk_by_csv():
    """遍历csv配置文件
    """
    for root, dirs, files in os.walk(ROOT):
        for file_name in files:
            if file_name.endswith(EXT):
                convert_file(os.path.join(root, file_name))


if __name__ == "__main__":
    walk_by_csv()
    save_as_json()

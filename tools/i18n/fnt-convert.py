# -*- coding: utf-8 -*-

import codecs
import math
import os
import subprocess
from configparser import ConfigParser

from PIL import Image, ImageDraw, ImageFont

current_path = os.path.dirname(os.path.relpath(__file__))
output_path = os.path.realpath(os.path.join(current_path, "out"))
words_ini_path = os.path.join(current_path, "fnt-words.ini")
target_ini_path = os.path.join(current_path, "fnt-target.ini")
zh_auto_chars_path = os.path.join(current_path, "fnt-zh-auto.txt")
zh_extra_chars_path = os.path.join(current_path, "fnt-zh-extra.txt")
CONVERT_INFO = None


def get_one_char_width(o_text, o_font, o_size):
    tt_font = ImageFont.truetype(o_font, o_size)
    tt_size = o_font.getsize(o_text)
    return tt_size[0]


def chars(o_chars):
    return "".join(sorted(list(set(list(o_chars)))))


def get_target_conf():
    target_ini = ConfigParser()
    target_ini.read(target_ini_path, encoding="utf8")
    return [os.path.join(current_path, t[1]) for t in target_ini.items("target")]


def get_convert_conf(config_path):
    with open(zh_auto_chars_path, encoding="utf-8") as f:
        zh = f.read()
    with open(zh_extra_chars_path, encoding="utf-8") as f:
        zh += f.read()
    convert_ini = ConfigParser()
    convert_ini.read(config_path, encoding="utf8")
    return {
        "fonts": {
            "en": convert_ini.get("font", "en"),
            "cn": convert_ini.get("font", "cn"),
            "num": convert_ini.get("font", "num")
        },
        "stroke": {
            "width": int(convert_ini.get("stroke", "width")),
            "color": convert_ini.get("stroke", "color")
        },
        "output": convert_ini.get("output", "output"),
        "sizes": [int(s) for s in convert_ini.get("size", "size").split(",")],
        "characters": {
            "en": chars(convert_ini.get("characters", "en")),
            "cn": chars(convert_ini.get("characters", "cn") + zh),
            "num": chars(convert_ini.get("characters", "num"))
        }
    }


def get_words_conf():
    words_ini = ConfigParser()
    words_ini.read(words_ini_path, encoding="utf8")
    tt_words = {}
    tt_words.setdefault("space", " ")
    for item in words_ini.items("words"):
        tt_words.setdefault(item[0], item[1])
    return tt_words


def convert_texts_to_png(o_size: int):
    """字符转换成碎图

    :param o_size: int
    """
    o_fonts = CONVERT_INFO["conf"]["fonts"]
    o_texts = CONVERT_INFO["conf"]["characters"]
    o_output = CONVERT_INFO["conf"]["output"]
    o_stroke = CONVERT_INFO["conf"]["stroke"]
    o_words = CONVERT_INFO["words"]
    o_stroke_width = o_stroke.get("width")
    o_stroke_color = o_stroke.get("color")

    base_dir = os.path.join(
        output_path, "{0}_x{1}".format(o_output, str(o_size)))
    makedir(base_dir)
    tt_values = list(o_words.values())
    tt_keys = list(o_words.keys())
    space = o_words.get("space")

    for key in ["num", "en", "cn"]:
        text = o_texts[key]
        font = o_fonts[key]
        for char in text:
            tt_font = ImageFont.truetype(font, o_size)
            tt_size = tt_font.getsize(char, stroke_width=o_stroke_width)

            tt_key = char
            if char in tt_values:
                tt_key = tt_keys[tt_values.index(char)]
            out = os.path.join(base_dir, tt_key + ".png")

            im = Image.new("RGBA", tt_size, (255, 255, 255, 0))
            dr = ImageDraw.Draw(im)
            dr.text((0, 0), char, font=tt_font, fill="#ffffff",
                    stroke_width=o_stroke_width, stroke_fill=o_stroke_color)
            try:
                # print("converting %s '%s' in size %s" % (o_output, char, o_size))
                im.save(out)
            except ValueError as err:
                print(err, char)

    print("converted %s in size %s!" % (o_output, o_size))


def makedir(dir_path: str):
    subprocess.run(["rm", "-rf", dir_path])
    subprocess.run(["mkdir", "-p", dir_path])


def check_and_create(dir_path, files):
    """检查并创建

    :param dir_path: 碎图目录路径
    :param files: 碎图字典
    :return:
    """
    fnt_name = os.path.join(output_path, os.path.basename(dir_path) + ".fnt")
    png_name = os.path.join(output_path, os.path.basename(dir_path) + ".png")
    fnt_define = dict()
    max_width = 0
    max_height = 0
    col_count = 0
    row_cunt = 0
    index = 0
    x_offset = 0

    for key in files.keys():
        image = Image.open(key)
        max_width = max(max_width, image.size[0])
        max_height = max(max_height, image.size[1])

    total_count = len(files)
    col_count = int(
        math.ceil(math.sqrt(max_height * max_width * total_count * 1.0) / max_width))
    row_count = int(math.ceil(len(files) * 1.0 / col_count))
    # print("--- col:{0}, row:{1}, total:{2} ---".format(col_count, row_count, total_count))

    fnt_define_item = []
    for key in files.keys():
        image = Image.open(key)
        image_size = image.size
        fnt_define_item_data = dict()
        fnt_define_item_data["id"] = files[key]
        fnt_define_item_data["x"] = str((index % col_count) * max_width)
        fnt_define_item_data["y"] = str(int(index / col_count) * max_height)
        fnt_define_item_data["width"] = str(image_size[0])
        fnt_define_item_data["height"] = str(image_size[1])
        fnt_define_item_data["xoffset"] = str(0)
        fnt_define_item_data["yoffset"] = str(
            int((max_height - image_size[1])*0.5))  # str(0)
        fnt_define_item_data["xadvance"] = str(image_size[0])
        fnt_define_item_data["page"] = str(0)
        fnt_define_item_data["chnl"] = str(0)
        fnt_define_item_data["letter"] = chr(int(files[key]))
        fnt_define_item.append(fnt_define_item_data)
        index += 1
        x_offset += image_size[0]

    fnt_define["data"] = fnt_define_item
    fnt_define["size"] = str(max_width)
    fnt_define["lineHeight"] = str(max_height)
    fnt_define["base"] = str(max_width)
    fnt_define["scaleW"] = str(max_width * col_count)
    fnt_define["scaleH"] = str(max_height * row_count)
    fnt_define["file"] = os.path.basename(png_name)
    fnt_define["count"] = len(files)

    create_fnt_file(fnt_name, fnt_define)
    join_images(max_width, max_height, col_count, row_count, png_name, files)
    print("make %s fnt done!" % png_name)


def create_fnt_file(fnt_name, fnt_define):
    """ 创建fnt文件

    :param fnt_name: fnt文件路径
    :param fnt_define: fnt信息字典
    :return:
    """
    font_face = "Arial"
    write_file = open(fnt_name, "w")
    write_file = codecs.open(fnt_name, "w", "utf-8")
    # face="Arial”,字体为”Arial”
    # size=32:大小为32像素
    # bold=0 :不加粗
    # italic=0:不使用斜体
    # charset="": charset是编码字符集，这里没有填写值即使用默认，
    # unicode=0:不使用Unicode
    # stretchH=100:纵向缩放百分比
    # smooth=1 :开启平滑
    # aa=1:开启抗锯齿
    # padding=0,0,0,0:内边距，文字与边框的空隙。
    # spacing=1,1 :外边距，就是相临边缘的距离。
    head_msg1 = """info face="%s" size=%s bold=0 italic=0 charset="" unicode=0 stretchH=100 smooth=1 aa=1 padding=0,0,0,0 spacing=2,2 outline=0\n""" % (
        font_face, fnt_define["size"])
    write_file.write(head_msg1)
    # lineHeight=37：行高，如果遇到换行符时，绘制字的位置坐标的Y值在换行后增加的像素值。
    # base=28 :字的基本大小
    # scaleW=512 :图片大小
    # scaleH=512:图片大小
    # pages=1 :此种字体共用到几张图。
    # packed=0:图片不压缩
    head_msg2 = """common lineHeight=%s base=%s scaleW=%s scaleH=%s pages=1 packed=0 alphaChnl=0 redChnl=0 greenChnl=0 blueChnl=0\n""" % (
        fnt_define["lineHeight"], fnt_define["base"], fnt_define["scaleW"], fnt_define["scaleH"])
    write_file.write(head_msg2)
    # 第一页，文件名称是”bitmapFontChinese.png”
    # page id=0 file="bitmapFontChinese.png"
    head_msg3 = """page id=0 file="%s"\n""" % (fnt_define["file"])
    write_file.write(head_msg3)
    # 第四行是当前贴图中所容纳的文字数量
    head_msg4 = """chars count=%s\n""" % (fnt_define["count"])
    write_file.write(head_msg4)

    for i in range(0, int(fnt_define["count"])):
        data = fnt_define["data"][i]
        line = "char id=%s x=%s y=%s width=%s height=%s xoffset=%s yoffset=%s xadvance=%s page=%s chnl=%s " \
               "letter=\"%s\"\n" % (
                   data["id"], data["x"], data["y"], data["width"], data["height"], data["xoffset"], data["yoffset"],
                   data["xadvance"], data["page"], data["chnl"], data["letter"])
        write_file.write(line)


def join_images(max_width, max_height, col_count, row_count, image_file, files):
    """ 拼合图片

    :param max_width: 最大宽度
    :param max_height: 最大高度
    :param col_count: 列数
    :param row_count: 行数
    :param image_file: 图片保存路径
    :param files: 图片列表
    """
    out_w = max_width * col_count
    out_h = max_height * row_count

    print("out image size %dx%d" % (out_w, out_h))

    to_image = Image.new('RGBA', (out_w, out_h))

    x = 0
    index = 0
    for key in files.keys():
        from_image = Image.open(key)
        offset_x = (index % col_count) * max_width
        offset_y = int(int(index / col_count) * max_height)
        to_image.paste(from_image, (offset_x, offset_y))
        x += from_image.size[0]
        index += 1

    to_image.save(image_file)


def convert_to_fnt(o_words):
    """ 转换成fnt字体文件和位图图片

    :param o_words: 特殊字符转换字典
    """
    for root, dirs, filenames in os.walk(output_path):
        for dir_name in dirs:
            sub_dir = os.path.join(root, dir_name)
            convert_files = {}
            for filename in os.listdir(sub_dir):
                filepath = os.path.join(sub_dir, filename)
                if filepath.endswith(".png"):
                    basename = filename.split('.')[0]
                    o_value = o_words.get(basename)
                    basename = ord(o_value) if o_value else ord(basename)
                    convert_files.setdefault(filepath, basename)
            check_and_create(sub_dir, convert_files)


if __name__ == "__main__":
    target_conf = get_target_conf()
    for target in target_conf:
        CONVERT_INFO = dict(
            words=get_words_conf(),
            conf=get_convert_conf(target)
        )
        try:
            for size in CONVERT_INFO["conf"]["sizes"]:
                convert_texts_to_png(size)
            convert_to_fnt(CONVERT_INFO["words"])
        except RuntimeError as e:
            print(e)

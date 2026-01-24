#!/usr/bin/env python3
"""
将 PNG 图片转换成像素风格
保持原图细节的同时添加像素化效果
"""

from PIL import Image
import os


def pixelate_image(input_path, output_path, pixel_size=8):
    """
    将图片像素化处理

    Args:
        input_path: 输入图片路径
        output_path: 输出图片路径
        pixel_size: 像素块大小，越小细节保留越多
    """
    img = Image.open(input_path)
    original_size = img.size

    # 保持 RGBA 模式
    if img.mode != "RGBA":
        img = img.convert("RGBA")

    # 计算缩小后的尺寸
    small_size = (original_size[0] // pixel_size, original_size[1] // pixel_size)

    # 先缩小再放大，使用 NEAREST 采样保持像素锐利边缘
    small_img = img.resize(small_size, Image.Resampling.LANCZOS)
    pixelated = small_img.resize(original_size, Image.Resampling.NEAREST)

    # 保存
    pixelated.save(output_path, "PNG")
    print(
        f"✓ 已转换: {os.path.basename(input_path)} -> {os.path.basename(output_path)}"
    )


def main():
    public_dir = os.path.join(os.path.dirname(__file__), "..", "public")

    # 需要转换的 PNG 文件
    png_files = [
        "books.png",
        "chat.png",
        "home.png",
        "moon.png",
        "paper.png",
        "planet-earth.png",
        "statistics.png",
        "sun.png",
        "translate.png",
        "wrench.png",
    ]

    # 像素块大小，8 是一个平衡细节和像素感的好选择
    # 512 / 8 = 64 个像素块，保留足够细节
    pixel_size = 8

    print(f"开始像素化处理 (像素块大小: {pixel_size})...")
    print("-" * 40)

    for filename in png_files:
        input_path = os.path.join(public_dir, filename)
        output_path = os.path.join(public_dir, filename)  # 直接覆盖原文件

        if os.path.exists(input_path):
            pixelate_image(input_path, output_path, pixel_size)
        else:
            print(f"⚠ 文件不存在: {filename}")

    print("-" * 40)
    print("完成!")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
将 PNG 图片转换成 SVG 矢量图
使用 vtracer 进行高质量彩色矢量化
"""

import vtracer
import os


def convert_png_to_svg(input_path, output_path):
    """
    将 PNG 转换为 SVG

    使用优化参数以保留更多细节:
    - colormode: color 保留颜色
    - hierarchical: stacked 层叠模式
    - mode: polygon 多边形模式
    - filter_speckle: 4 过滤小噪点
    - color_precision: 8 颜色精度
    - layer_difference: 16 层差异
    - corner_threshold: 60 角落阈值
    - length_threshold: 4.0 长度阈值
    - splice_threshold: 45 拼接阈值
    - path_precision: 8 路径精度
    """
    vtracer.convert_image_to_svg_py(
        input_path,
        output_path,
        colormode="color",  # 彩色模式
        hierarchical="stacked",  # 层叠
        mode="polygon",  # 多边形模式，保留更多细节
        filter_speckle=4,  # 过滤小于4像素的噪点
        color_precision=8,  # 颜色精度
        layer_difference=16,  # 层差异
        corner_threshold=60,  # 角落阈值
        length_threshold=4.0,  # 长度阈值
        splice_threshold=45,  # 拼接阈值
        path_precision=8,  # 路径精度
    )
    print(
        f"✓ 转换完成: {os.path.basename(input_path)} -> {os.path.basename(output_path)}"
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

    print("开始 PNG -> SVG 矢量化转换...")
    print("-" * 50)

    for filename in png_files:
        input_path = os.path.join(public_dir, filename)
        output_filename = filename.replace(".png", ".svg")
        output_path = os.path.join(public_dir, output_filename)

        if os.path.exists(input_path):
            convert_png_to_svg(input_path, output_path)
        else:
            print(f"⚠ 文件不存在: {filename}")

    print("-" * 50)
    print("所有文件转换完成!")


if __name__ == "__main__":
    main()

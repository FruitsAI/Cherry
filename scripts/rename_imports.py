#!/usr/bin/env python3
"""
🍒 Cherry - 导入路径批量重命名脚本

将项目中的 PascalCase 组件导入路径批量替换为 kebab-case 格式。
用于代码风格迁移和文件命名规范统一。

使用方法:
    python scripts/rename_imports.py

注意事项:
    - 该脚本会直接修改 src/ 目录下的 .ts 和 .tsx 文件
    - 只替换导入路径中的文件名部分，不修改导入的符号名
    - 运行前建议先提交代码或备份
"""

import os
import re

# 重命名映射表：旧名称 (PascalCase) -> 新名称 (kebab-case)
# 键为组件文件名，值为转换后的 kebab-case 文件名
replacements = {
    "AdminHeader": "admin-header",
    "ConfigManager": "config-manager",
    "LinkManager": "link-manager",
    "LinkModal": "link-modal",
    "IconDisplay": "icon-display",
    "CommitCard": "commit-card",
    "ConfirmModal": "confirm-modal",
    "ThemeToggle": "theme-toggle",
    "CurrentTime": "current-time",
    "Dock": "dock",
    "Footer": "footer",
    "Header": "header",
    "BranchView": "branch-view",
    "HomeView": "home-view",
    "ClientApp": "client-app",
    "useCommands": "use-commands",
    "useKeyboardNavigation": "use-keyboard-navigation",
    "useLatest": "use-latest",
    "useStatistics": "use-statistics",
}


def process_file(filepath: str) -> None:
    """
    处理单个文件中的导入路径替换

    Args:
        filepath: 要处理的文件绝对路径

    算法说明:
        使用正则表达式匹配 "/OldName'" 或 "/OldName"" 格式的路径，
        将 OldName 替换为对应的 kebab-case 名称。
        只替换路径部分，不会影响导入的变量/组件名。
    """
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    new_content = content
    changes_made = False

    for old, new in replacements.items():
        # 正则模式说明：
        # /({old}) - 匹配斜杠后跟旧名称（捕获组用于验证）
        # (['"]) - 匹配引号（单引号或双引号）
        # 这确保只替换路径中的文件名，不影响代码中的变量引用
        pattern = re.compile(f"/({old})(['\"])")

        if pattern.search(new_content):
            # 替换为新的 kebab-case 名称，保留原引号
            new_content = pattern.sub(f"/{new}\\2", new_content)
            changes_made = True

    # 只有发生变更时才写回文件，避免无意义的文件修改
    if changes_made:
        print(f"Updating {filepath}")
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)


def walk_dir(directory: str) -> None:
    """
    递归遍历目录并处理所有 TypeScript 文件

    Args:
        directory: 要遍历的目录路径（相对或绝对）
    """
    for root, dirs, files in os.walk(directory):
        for file in files:
            # 只处理 TypeScript/TSX 文件
            if file.endswith(".tsx") or file.endswith(".ts"):
                process_file(os.path.join(root, file))


if __name__ == "__main__":
    # 从项目根目录运行，处理 src 目录下的所有文件
    walk_dir("src")

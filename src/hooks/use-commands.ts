/**
 * 🍒 Cherry Hooks - 命令执行 Hook
 *
 * 解析和执行终端风格的命令。
 * 支持内置命令和搜索功能。
 *
 * @file src/hooks/use-commands.ts
 *
 * @description
 * 支持的命令：
 * - help / ?: 显示帮助
 * - ls: 列出所有分支
 * - go <n>: 跳转到第 n 个链接
 * - g <query>: Google 搜索
 * - clear: 清空控制台
 * - 其他: 作为搜索关键词处理
 */

import { useCallback } from 'react';
import type { Branch, NavigationState, CommandResult } from '../types';

/** useCommands Hook 参数 */
interface UseCommandsProps {
  /** 所有分支数据 */
  branches: Branch[];
  /** 设置导航状态 */
  setNavigationState: React.Dispatch<React.SetStateAction<NavigationState>>;
  /** 显示帮助回调 */
  onShowHelp: () => void;
}

/**
 * 命令执行 Hook
 *
 * @returns executeCommand 函数
 */
export function useCommands({
  branches,
  setNavigationState,
  onShowHelp,
}: UseCommandsProps) {
  const executeCommand = useCallback(
    (input: string): CommandResult => {
      const parts = input.trim().toLowerCase().split(/\s+/);
      const command = parts[0];
      const args = parts.slice(1);

      let output: string[] = [];
      let success = true;
      let type: 'help' | 'ls' | 'go' | 'search' | 'clear' | 'unknown' = 'unknown';

      switch (command) {
        case 'help':
        case '?':
          type = 'help';
          onShowHelp();
          output = ['Showing help...'];
          break;

        case 'ls': {
          type = 'ls';
          // 列出所有 branches
          const branchList = branches
            .map((b, i) => `${i + 1}. ${b.icon} ${b.name}`)
            .join('\n');
          console.log('Branches:\n' + branchList);
          output = [`Found ${branches.length} branches`, branchList];
          break;
        }

        case 'go': {
          type = 'go';
          // 跳转到指定索引
          const index = parseInt(args[0], 10);
          if (isNaN(index) || index < 1) {
            success = false;
            output = ['Usage: go <number>'];
            break;
          }

          // 计算全局索引
          let count = 0;
          for (let bi = 0; bi < branches.length; bi++) {
            for (let ci = 0; ci < branches[bi].commits.length; ci++) {
              count++;
              if (count === index) {
                const commit = branches[bi].commits[ci];
                setNavigationState({
                  currentBranchIndex: bi,
                  currentCommitIndex: ci,
                });
                output = [`Opening: ${commit.message}`];
                window.open(commit.url, '_blank', 'noopener,noreferrer');
                break;
              }
            }
          }
          if (output.length === 0) {
            success = false;
            output = [`Link #${index} not found`];
          }
          break;
        }

        case 'g':
        case 'google': {
          type = 'search';
          // Google 搜索
          const query = args.join(' ');
          if (!query) {
            success = false;
            output = ['Usage: g <search query>'];
            break;
          }
          const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
          output = [`Searching: ${query}`];
          window.open(url, '_blank', 'noopener,noreferrer');
          break;
        }

        case 'clear':
          type = 'clear';
          console.clear();
          output = ['Console cleared'];
          break;

        default:
          // 尝试作为搜索处理
          if (input.length > 0) {
            type = 'search';
            // 在 commits 中搜索
            for (let bi = 0; bi < branches.length; bi++) {
              for (let ci = 0; ci < branches[bi].commits.length; ci++) {
                const commit = branches[bi].commits[ci];
                if (
                  commit.message.toLowerCase().includes(input.toLowerCase()) ||
                  commit.tags.some((t) => t.toLowerCase().includes(input.toLowerCase()))
                ) {
                  setNavigationState({
                    currentBranchIndex: bi,
                    currentCommitIndex: ci,
                  });
                  output = [`Found: ${commit.message}`];
                  break;
                }
              }
            }
            if (output.length === 0) {
              success = false;
              output = [`Command not found: ${command}. Type 'help' for available commands.`];
            }
          } else {
            success = false;
            output = ['Empty command'];
          }
      }

      return { type, output, success };
    },
    [branches, setNavigationState, onShowHelp]
  );

  return { executeCommand };
}


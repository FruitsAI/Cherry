import { useCallback } from 'react';
import type { Branch, NavigationState, CommandResult } from '../types';

interface UseCommandsProps {
  branches: Branch[];
  setNavigationState: React.Dispatch<React.SetStateAction<NavigationState>>;
  onShowHelp: () => void;
}

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

        case 'ls':
          type = 'ls';
          // 列出所有 branches
          const branchList = branches
            .map((b, i) => `${i + 1}. ${b.icon} ${b.name}`)
            .join('\n');
          console.log('Branches:\n' + branchList);
          output = [`Found ${branches.length} branches`, branchList];
          break;

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


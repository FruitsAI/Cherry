// 🍒 Project Cherry - 类型定义

export interface Commit {
  message: string;
  hash: string;
  url: string;
  tags: string[];
}

export interface Branch {
  name: string;
  icon: string;
  commits: Commit[];
}

export interface SiteConfig {
  user_name: string;
  theme: string;
  slogan: string;
}

export interface CherryData {
  site_config: SiteConfig;
  branches: Branch[];
}

// 导航状态
export interface NavigationState {
  currentBranchIndex: number;
  currentCommitIndex: number;
}

// 命令类型
export type CommandType = 'help' | 'ls' | 'go' | 'search' | 'clear' | 'unknown';

export interface CommandResult {
  type: CommandType;
  output: string[];
  success: boolean;
}


// 🍒 Cherry - 类型定义

export interface Commit {
  message: string;
  hash: string;
  url: string;
  tags: string[];
  isFavorite?: boolean;
  visitCount?: number;
  lastVisited?: string;
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
  version?: string;
}

export interface CherryData {
  site_config: SiteConfig;
  branches: Branch[];
}

export interface FavoriteItem {
  message: string;
  url: string;
  icon: string;
}

export interface VisitHistory {
  hash: string;
  message: string;
  url: string;
  branch: string;
  timestamp: string;
}

export interface CommandUsage {
  command: string;
  count: number;
  lastUsed: string;
}

export interface CategoryUsage {
  branch: string;
  icon: string;
  count: number;
}

export interface Statistics {
  totalVisits: number;
  visitHistory: VisitHistory[];
  commandUsage: CommandUsage[];
  categoryUsage: CategoryUsage[];
  topLinks: Array<{
    hash: string;
    message: string;
    url: string;
    count: number;
  }>;
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


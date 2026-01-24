/**
 * 🍒 Cherry - 类型定义
 *
 * 应用中使用的所有 TypeScript 类型和接口。
 *
 * @file src/types/index.ts
 *
 * @description
 * 类型分类：
 * - 数据模型：Commit, Branch, SiteConfig, CherryData
 * - 统计相关：VisitHistory, CommandUsage, Statistics
 * - 导航相关：NavigationState, CommandResult
 */

/**
 * 链接（Commit）数据
 * 对应数据库 commits 表
 */
export interface Commit {
  /** 链接标题 */
  message: string;
  /** 唯一标识符 */
  hash: string;
  /** 链接 URL */
  url: string;
  /** 标签数组 */
  tags: string[];
  /** 是否已收藏（客户端状态） */
  isFavorite?: boolean;
  /** 访问次数 */
  visitCount?: number;
  /** 最后访问时间 */
  lastVisited?: string;
}

/**
 * 分支数据
 * 对应数据库 branches 表
 */
export interface Branch {
  /** 分支名称 */
  name: string;
  /** 分支图标（路径或 Emoji） */
  icon: string;
  /** 该分支下的所有链接 */
  commits: Commit[];
}

/** 快捷链接配置 */
export interface Shortcut {
  name: string;
  url: string;
  icon: string;
}

/**
 * 站点配置
 * 存储在 users.siteConfig JSONB 字段中
 */
export interface SiteConfig {
  /** 用户名（显示在页头） */
  user_name: string;
  /** 主题（dark/light） */
  theme: string;
  /** 标语（显示在首页） */
  slogan: string;
  /** 应用版本号 */
  version?: string;
  /** 快捷链接列表 */
  shortcuts?: Shortcut[];
}

/**
 * 应用完整数据结构
 * getInitialData 返回类型
 */
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


import { useState, useCallback, useEffect } from 'react';
import type { Statistics, VisitHistory, CommandUsage, CategoryUsage, Branch } from '../types';

const STORAGE_KEYS = {
  VISIT_HISTORY: 'cherry-visit-history',
  COMMAND_USAGE: 'cherry-command-usage',
  CATEGORY_USAGE: 'cherry-category-usage',
  LINK_VISITS: 'cherry-link-visits',
};

const MAX_HISTORY_SIZE = 100; // 最多保留100条访问历史
const MAX_LINKS = 10; // 热门链接显示前10个

export function useStatistics(branches: Branch[] = []) {
  const [statistics, setStatistics] = useState<Statistics>({
    totalVisits: 0,
    visitHistory: [],
    commandUsage: [],
    categoryUsage: [],
    topLinks: [],
  });

  // 从 localStorage 加载统计数据
  useEffect(() => {
    loadStatistics();
  }, [branches]);

  const loadStatistics = useCallback(() => {
    try {
      const visitHistory = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.VISIT_HISTORY) || '[]'
      ) as VisitHistory[];
      
      const commandUsage = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.COMMAND_USAGE) || '[]'
      ) as CommandUsage[];
      
      const categoryUsage = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.CATEGORY_USAGE) || '[]'
      ) as CategoryUsage[];
      
      const linkVisits = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.LINK_VISITS) || '{}'
      ) as Record<string, number>;

      // 生成热门链接，从 branches 中查找对应的 commit 信息
      const topLinks = Object.entries(linkVisits)
        .sort(([, a], [, b]) => b - a)
        .slice(0, MAX_LINKS)
        .map(([hash, count]) => {
          // 从 branches 中查找对应的 commit
          for (const branch of branches) {
            const commit = branch.commits.find((c) => c.hash === hash);
            if (commit) {
              return {
                hash,
                message: commit.message,
                url: commit.url,
                count,
              };
            }
          }
          return {
            hash,
            message: '未知链接',
            url: '',
            count,
          };
        });

      setStatistics({
        totalVisits: visitHistory.length,
        visitHistory,
        commandUsage,
        categoryUsage,
        topLinks: topLinks as any,
      });
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  }, [branches]);

  // 记录链接访问
  const recordVisit = useCallback((hash: string, message: string, url: string, branch: string) => {
    try {
      // 更新访问历史
      const visitHistory: VisitHistory = {
        hash,
        message,
        url,
        branch,
        timestamp: new Date().toISOString(),
      };
      
      const currentHistory = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.VISIT_HISTORY) || '[]'
      ) as VisitHistory[];
      
      const newHistory = [visitHistory, ...currentHistory].slice(0, MAX_HISTORY_SIZE);
      localStorage.setItem(STORAGE_KEYS.VISIT_HISTORY, JSON.stringify(newHistory));

      // 更新链接访问次数
      const linkVisits = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.LINK_VISITS) || '{}'
      ) as Record<string, number>;
      
      linkVisits[hash] = (linkVisits[hash] || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.LINK_VISITS, JSON.stringify(linkVisits));

      // 更新分类使用次数
      const categoryUsage = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.CATEGORY_USAGE) || '[]'
      ) as CategoryUsage[];
      
      const categoryIndex = categoryUsage.findIndex((c) => c.branch === branch);
      if (categoryIndex >= 0) {
        categoryUsage[categoryIndex].count += 1;
      } else {
        categoryUsage.push({ branch, icon: '', count: 1 });
      }
      localStorage.setItem(STORAGE_KEYS.CATEGORY_USAGE, JSON.stringify(categoryUsage));

      // 重新加载统计数据
      loadStatistics();
    } catch (error) {
      console.error('Failed to record visit:', error);
    }
  }, [loadStatistics]);

  // 记录命令使用
  const recordCommand = useCallback((command: string) => {
    try {
      const commandUsage = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.COMMAND_USAGE) || '[]'
      ) as CommandUsage[];
      
      const commandIndex = commandUsage.findIndex((c) => c.command === command);
      if (commandIndex >= 0) {
        commandUsage[commandIndex].count += 1;
        commandUsage[commandIndex].lastUsed = new Date().toISOString();
      } else {
        commandUsage.push({
          command,
          count: 1,
          lastUsed: new Date().toISOString(),
        });
      }
      
      localStorage.setItem(STORAGE_KEYS.COMMAND_USAGE, JSON.stringify(commandUsage));
      
      // 重新加载统计数据
      loadStatistics();
    } catch (error) {
      console.error('Failed to record command:', error);
    }
  }, [loadStatistics]);

  // 清除所有统计数据
  const clearStatistics = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.VISIT_HISTORY);
      localStorage.removeItem(STORAGE_KEYS.COMMAND_USAGE);
      localStorage.removeItem(STORAGE_KEYS.CATEGORY_USAGE);
      localStorage.removeItem(STORAGE_KEYS.LINK_VISITS);
      
      setStatistics({
        totalVisits: 0,
        visitHistory: [],
        commandUsage: [],
        categoryUsage: [],
        topLinks: [],
      });
    } catch (error) {
      console.error('Failed to clear statistics:', error);
    }
  }, []);

  return {
    statistics,
    recordVisit,
    recordCommand,
    clearStatistics,
    loadStatistics,
  };
}
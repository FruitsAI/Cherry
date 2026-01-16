import type { Statistics } from '../types';

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  statistics: Statistics;
}

export function StatisticsModal({ isOpen, onClose, statistics }: StatisticsModalProps) {
  if (!isOpen) return null;

  // 格式化时间
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} 天前`;
    
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="terminal-card max-w-4xl w-full mx-4 p-6 border-[var(--cherry-red)] animate-fade-in-up flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题 */}
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <div>
            <h2 className="font-pixel text-2xl text-[var(--cherry-red)] glow-red mb-2">
              📊 使用统计
            </h2>
            <p className="text-sm text-[var(--cherry-muted)]">
              总访问次数: {statistics.totalVisits}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--cherry-muted)] hover:text-[var(--cherry-red)] transition-colors"
          >
            [ESC]
          </button>
        </div>

        {/* 内容区域 - 可滚动 */}
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 热门链接 */}
            <div>
              <h3 className="font-code text-sm text-[var(--cherry-amber)] mb-3">
                🔥 热门链接
              </h3>
              {statistics.topLinks.length > 0 ? (
                <div className="space-y-2">
                  {statistics.topLinks.map((link, index) => (
                    <div
                      key={link.hash}
                      className="flex items-center justify-between p-2 bg-[var(--cherry-bg)] rounded text-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[var(--cherry-amber)] font-code">
                            #{index + 1}
                          </span>
                          <span className="text-[var(--cherry-text)] truncate">
                            {link.message || '未知链接'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[var(--cherry-green)] font-code ml-2">
                        {link.count} 次
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--cherry-muted)]">暂无数据</p>
              )}
            </div>

            {/* 访问历史 */}
            <div>
              <h3 className="font-code text-sm text-[var(--cherry-amber)] mb-3">
                📜 访问历史
              </h3>
              {statistics.visitHistory.length > 0 ? (
                <div className="space-y-2">
                  {statistics.visitHistory.slice(0, 10).map((visit, index) => (
                    <div
                      key={`${visit.hash}-${index}`}
                      className="flex items-center justify-between p-2 bg-[var(--cherry-bg)] rounded text-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-[var(--cherry-text)] truncate">
                          {visit.message}
                        </div>
                        <div className="text-xs text-[var(--cherry-muted)]">
                          {visit.branch} · {formatTime(visit.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--cherry-muted)]">暂无数据</p>
              )}
            </div>

            {/* 常用命令 */}
            <div>
              <h3 className="font-code text-sm text-[var(--cherry-amber)] mb-3">
                💻 常用命令
              </h3>
              {statistics.commandUsage.length > 0 ? (
                <div className="space-y-2">
                  {statistics.commandUsage.slice(0, 5).map((usage) => (
                    <div
                      key={usage.command}
                      className="flex items-center justify-between p-2 bg-[var(--cherry-bg)] rounded text-sm"
                    >
                      <code className="text-[var(--cherry-green)]">
                        /{usage.command}
                      </code>
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--cherry-green)] font-code">
                          {usage.count} 次
                        </span>
                        <span className="text-xs text-[var(--cherry-muted)]">
                          {formatTime(usage.lastUsed)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--cherry-muted)]">暂无数据</p>
              )}
            </div>

            {/* 常用分类 */}
            <div>
              <h3 className="font-code text-sm text-[var(--cherry-amber)] mb-3">
                📁 常用分类
              </h3>
              {statistics.categoryUsage.length > 0 ? (
                <div className="space-y-2">
                  {statistics.categoryUsage.slice(0, 5).map((category) => (
                    <div
                      key={category.branch}
                      className="flex items-center justify-between p-2 bg-[var(--cherry-bg)] rounded text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span className="text-[var(--cherry-text)]">
                          {category.branch}
                        </span>
                      </div>
                      <span className="text-[var(--cherry-green)] font-code">
                        {category.count} 次
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--cherry-muted)]">暂无数据</p>
              )}
            </div>
          </div>
        </div>

        {/* 底部提示 */}
        <div className="pt-4 mt-6 border-t border-[var(--cherry-green)]/30 flex-shrink-0">
          <p className="text-sm text-[var(--cherry-muted)] text-center">
            按 <kbd className="text-[var(--cherry-green)]">ESC</kbd> 或点击外部关闭
          </p>
        </div>
      </div>
    </div>
  );
}
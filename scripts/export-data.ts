/**
 * 数据导出脚本：从数据库导出数据到 JSON 文件
 * 用于静态部署前的数据准备
 * 
 * 使用方法: npx tsx scripts/export-data.ts
 */

import { db } from '../src/db';
import { users, branches, commits } from '../src/db/schema';
import { version } from '../package.json';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { asc } from 'drizzle-orm';

dotenv.config();

async function exportData() {
  console.log('📦 Exporting data from database...');

  try {
    // 1. 获取用户配置
    const [user] = await db.select().from(users).limit(1);
    const siteConfig = user?.siteConfig || {
      user_name: 'user',
      theme: 'dark_matrix',
      slogan: 'Cherry-pick the web',
      shortcuts: []
    };

    // 2. 获取所有分支和提交
    const allBranches = await db.select().from(branches).orderBy(asc(branches.sortOrder));
    const allCommits = await db.select().from(commits);

    // 3. 格式化数据结构
    const formattedBranches = allBranches.map((branch) => {
      const branchCommits = allCommits.filter((c) => c.branchId === branch.id);
      return {
        name: branch.name,
        icon: branch.icon,
        commits: branchCommits.map((c) => ({
          message: c.message,
          hash: c.hash,
          url: c.url,
          tags: c.tags || [],
        }))
      };
    });

    const exportedData = {
      site_config: {
        ...siteConfig,
        version: version, // 使用 package.json 版本
      },
      branches: formattedBranches
    };

    // 4. 写入 JSON 文件
    const outputPath = path.join(process.cwd(), 'src', 'data', 'data.json');
    fs.writeFileSync(outputPath, JSON.stringify(exportedData, null, 2), 'utf-8');

    console.log(`✅ Data exported to ${outputPath}`);
    console.log(`   - ${formattedBranches.length} branches`);
    console.log(`   - ${allCommits.length} commits`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  }
}

exportData();

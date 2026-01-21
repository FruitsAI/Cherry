import { db } from '../src/db';
import { users, branches, commits } from '../src/db/schema';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';


dotenv.config();

async function seed() {
  console.log('Seeding database...');

  try {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'data.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(rawData);

    // 1. Seed User & Site Config
    console.log('Seeding site config...');
    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.username, data.site_config.user_name));
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    if (existingUser.length === 0) {
      await db.insert(users).values({
        username: data.site_config.user_name,
        name: data.site_config.user_name, // Map username to name for OAuth compatibility
        email: `${data.site_config.user_name}@example.com`, // Dummy email
        passwordHash: hashedPassword,
        siteConfig: data.site_config,
        role: 'admin',
      });
    } else {
        // Update password for existing user
        await db.update(users)
            .set({ 
                passwordHash: hashedPassword,
                siteConfig: data.site_config,
                role: 'admin', // Enforce admin role
            })
            .where(eq(users.username, data.site_config.user_name));
        console.log('Updated existing user password.');
    }

    // 2. Seed Branches and Commits
    console.log('Seeding branches and commits...');
    for (const [index, branchData] of data.branches.entries()) {
      // Check if branch exists
      let branchId: number;
      const existingBranch = await db.select().from(branches).where(eq(branches.name, branchData.name));
      
      if (existingBranch.length > 0) {
        branchId = existingBranch[0].id;
      } else {
        const [newBranch] = await db.insert(branches).values({
          name: branchData.name,
          icon: branchData.icon,
          sortOrder: index,
        }).returning();
        branchId = newBranch.id;
      }

      // Insert commits for this branch
      for (const commitData of branchData.commits) {
        const existingCommit = await db.select().from(commits).where(eq(commits.hash, commitData.hash));
        if (existingCommit.length === 0) {
          await db.insert(commits).values({
            hash: commitData.hash,
            message: commitData.message,
            url: commitData.url,
            tags: commitData.tags || [],
            branchId: branchId,
          });
        }
      }
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();

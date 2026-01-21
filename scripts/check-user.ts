import "dotenv/config";
import { db } from "../src/db";
import { users } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Checking user 'willxue'...");
  const user = await db.query.users.findFirst({
    where: eq(users.username, "willxue"),
  });

  if (user) {
    console.log("User found:");
    console.log("ID:", user.id);
    console.log("Username:", user.username);
    console.log("Role:", user.role);
  } else {
    console.log("User 'willxue' NOT found.");
  }
}

main().catch(console.error).finally(() => process.exit(0));

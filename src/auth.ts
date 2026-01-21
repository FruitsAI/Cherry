import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google"; // Import Google Provider
import { authConfig } from "./auth.config";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db),
  providers: [
    GitHub,
    Google,
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsedCredentials = z
          .object({ username: z.string(), password: z.string() })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data;
          
          const user = await db.query.users.findFirst({
            where: eq(users.username, username),
          });

          if (!user || null) return null;
          
          // Password check only if user has password (might be OAuth user without password)
           if (user.passwordHash) {
             const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
             if (passwordsMatch) {
               return {
                 ...user,
                 id: user.id.toString(),
                 role: user.role || 'user',
               };
             }
           }
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});


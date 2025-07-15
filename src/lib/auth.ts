import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getOrCreateUser } from "./database";
import { prisma } from "./db";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }: any) {
      if (user.email) {
        try {
          // Create or update user in our database
          const dbUser = await getOrCreateUser(
            user.email,
            user.name || undefined,
            user.image || undefined
          );
          // Add the database user ID to the user object
          user.id = dbUser.id; 
          user.familyId = dbUser.familyId;
          return true;
        } catch (error) {
          console.error("Error creating/updating user:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }: any) {
      if (user) {
        // Store the database user ID in the token
        token.dbUserId = user.id;
        token.familyId = user.familyId;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (!session?.user) {
        return session;
      }
      session.user.id = token.dbUserId;
      session.user.familyId = token.familyId;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

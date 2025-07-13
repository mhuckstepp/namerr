import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getOrCreateUser } from "./database";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }: any) {
      console.log("@@@ IN SIGN IN");
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
          return true;
        } catch (error) {
          console.error("Error creating/updating user:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }: any) {
      console.log("@@@ IN JWT");
      if (user) {
        // Store the database user ID in the token
        token.dbUserId = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      console.log("@@@ IN SESSION");
      if (session?.user) {
        session.user.id = token.dbUserId;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

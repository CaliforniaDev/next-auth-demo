import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import db from './db/drizzle';
import { users } from './db/usersSchema';
import { eq } from 'drizzle-orm';
import { compare } from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async credentials => {
        // Check if credentials are provided
        if (!credentials) {
          throw new Error('No credentials provided');
        }

        // Fetch the user from the database
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string));

        // Check if user exists
        if (!user) {
          throw new Error('Incorrect credentials');
        }

        // Compare the provided password with the stored hashed password
        const passwordCorrect = await compare(
          credentials.password as string,
          user.password!,
        );
        if (!passwordCorrect) {
          throw new Error('Incorrect credentials');
        }

        // Return the user object
        return {
          id: user.id.toString(),
          email: user.email,
        };
      },
    }),
  ],
});

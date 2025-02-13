'use server';
import { z } from 'zod';
import db from '@/db/drizzle';
import { eq } from 'drizzle-orm';
import { users } from '@/db/usersSchema';

import { signIn } from '@/auth';
import { compare } from 'bcryptjs';
import { passwordSchema } from '@/validation/passwordSchema';

interface LoginUser {
  email: string;
  password: string;
  token?: string;
}

const loginSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

export const loginWithCredentials = async ({
  email,
  password,
  token,
}: LoginUser) => {
  const loginValidation = loginSchema.safeParse({
    email,
    password,
  });
  if (!loginValidation.success) {
    return {
      error: true,
      message: loginValidation.error?.issues[0]?.message ?? 'An error occurred',
    };
  }
  try {
    const response = await signIn('credentials', {
      email,
      password,
      token,
      redirect: false,
    });

    if (response?.error) {
      return {
        error: true,
        message: response.error,
      };
    }
  } catch (e) {
    return {
      error: true,
      message: 'Incorrect email or password',
    };
  }
};

export const preLoginCheck = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  // Fetch the user from the database
  const [user] = await db.select().from(users).where(eq(users.email, email));

  // Check if user exists
  if (!user) {
    return {
      error: true,
      message: 'Incorrect credentials',
    };
  }

  // Compare the provided password with the stored hashed password
  const passwordCorrect = await compare(password as string, user.password!);
  if (!passwordCorrect) {
    return {
      error: true,
      message: 'Incorrect credentials',
    };
  }

  return {
    twoFactorActivated: user.twoFactorActivated,
  };
};

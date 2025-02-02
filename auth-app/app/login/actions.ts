'use server';

import { signIn } from '@/auth';
import { passwordSchema } from '@/validation/passwordSchema';
import { z } from 'zod';

interface LoginUser {
  email: string;
  password: string;
}

const loginSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

export const loginWithCredentials = async ({ email, password }: LoginUser) => {
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
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
  } catch (e) {}
};

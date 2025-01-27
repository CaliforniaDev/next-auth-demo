'use server';

import { z } from 'zod';
import { passwordMatchSchema } from '@/validation/passwordMatchSchema';

interface RegisterUser {
  email: string;
  password: string;
  passwordConfirm: string;
}

export const registerUser = async ({
  email,
  password,
  passwordConfirm,
}: RegisterUser) => {
  const newUserScheme = z
    .object({
      email: z.string().email(),
    })
    .and(passwordMatchSchema);

  const newUserValidation = newUserScheme.safeParse({
    email,
    password,
    passwordConfirm,
  });

  if (!newUserValidation.success) {
    return {
      error: true,
      message:
        newUserValidation.error.issues[0]?.message ?? 'An error occurred',
    };
  }
};

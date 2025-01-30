'use server';

import { z } from 'zod';
import { hash } from 'bcryptjs';
import db from '@/db/drizzle';
import { users } from '@/db/usersSchema';
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
  const result = await db.select();
  // Check if the email already exists in the database
  const newUserScheme = z
    .object({
      email: z.string().email(),
    })
    .and(passwordMatchSchema);
  // Validate the input data
  const newUserValidation = newUserScheme.safeParse({
    email,
    password,
    passwordConfirm,
  });
  // If validation fails, return an error response
  if (!newUserValidation.success) {
    return {
      error: true,
      message:
        newUserValidation.error.issues[0]?.message ?? 'An error occurred',
    };
  }

  // Hash the password
  const hashedPassword = await hash(password, 12);
  await db.insert(users).values({
    email,
    password: hashedPassword,
  })
};

'use server';

import { z } from 'zod';
import { hash } from 'bcryptjs';
import db from '@/db/drizzle';
import { users } from '@/db/usersSchema';
import { passwordMatchSchema } from '@/validation/passwordMatchSchema';

// Define a custom error type that extends the built-in Error type
interface CustomError extends Error {
  code?: string;
}
interface RegisterUser {
  email: string;
  password: string;
  passwordConfirm: string;
}

// Function to handle errors
const handleError = (error: unknown) => {
  const customError = error as CustomError;
  if (customError.code === '23505') {
    return {
      error: true,
      message: 'An account is already registered with this email address',
    };
  }
  return {
    error: true,
    message: 'An error occurred',
  };
};

// Server-side function to register a new user
export const registerUser = async ({
  email,
  password,
  passwordConfirm,
}: RegisterUser) => {
  const result = await db.select();
  try {
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
    });
  } catch (error) {
    return handleError(error);
  }
};

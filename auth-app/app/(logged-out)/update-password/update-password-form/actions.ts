'use server';

import { auth } from '@/auth';

import db from '@/db/drizzle';
import { eq } from 'drizzle-orm';
import { hash } from 'bcryptjs';

import { users } from '@/db/usersSchema';
import { passwordMatchSchema } from '@/validation/passwordMatchSchema';
import { passwordResetTokensSchema } from '@/db/passwordResetTokensSchema';

/**
 * Queries the database for a password reset token.
 * @param token - The reset token to query.
 * @returns The password reset token record if found, otherwise null.
 */
export const getResetToken = async (token: string) => {
  try {
    const [resetTokenRecord] = await db
      .select()
      .from(passwordResetTokensSchema)
      .where(eq(passwordResetTokensSchema.token, token));
    return resetTokenRecord;
  } catch (error) {
    console.error('Error querying reset token:', error);
    return null;
  }
};

/**
 * Validates whether a given reset token is still valid based on its expiration time.
 * @param token - The reset token to validate.
 * @returns True if the token is valid, otherwise false.
 */

export const validateToken = async (token: string) => {
  try {
    // Query the password reset token record
    const resetTokenRecord = await getResetToken(token);
    const now = Date.now();
    // Check if the token is valid or not expired
    return (
      resetTokenRecord?.tokenExpiration &&
      now < resetTokenRecord.tokenExpiration?.getTime()
    );
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

interface UpdatePasswordFormData {
  token: string;
  password: string;
  passwordConfirm: string;
}
/**
 * Updates the user's password using a valid reset token.
 * @param {UpdatePasswordFormData} data - The data containing token and new password.
 * @returns An object with an error flag and a message if an issue occurs.
 */
export const updatePassword = async ({
  token,
  password,
  passwordConfirm,
}: UpdatePasswordFormData) => {
  // 🛠 Validate password match using Zod schema
  const passwordValidation = passwordMatchSchema.safeParse({
    password,
    passwordConfirm,
  });
  if (!passwordValidation.success) {
    return {
      error: true,
      message:
        passwordValidation.error.issues[0]?.message ?? 'An error occurred',
    };
  }

  // 🚫 Prevent logged-in users from resetting passwords
  const session = await auth();
  if (session?.user?.id) {
    return {
      error: true,
      message:
        'You are already logged in. Please log out to update your password.',
    };
  }

  // 🔍 Validate the reset token
  const isTokenValid = token ? await validateToken(token) : false;
  if (!isTokenValid) {
    return {
      error: true,
      message: 'Your token is invalid or has expired',
      tokenInvalid: true,
    };
  }

  // 🔄 Retrieve the reset token record from the database
  const resetTokenRecord = await getResetToken(token);
  if (!resetTokenRecord) {
    return {
      error: true,
      message: 'Invalid password reset token',
    };
  }

  // 🔑 Hash the new password before saving
  const hashedPassword = await hash(password, 10);

  // 📝 Update the user's password in the database
  await db
    .update(users)
    .set({
      password: hashedPassword,
    })
    .where(eq(users.id, resetTokenRecord.userId!));
};

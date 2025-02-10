'use server';

import { auth } from '@/auth';
import db from '@/db/drizzle';
import { passwordResetTokensSchema } from '@/db/passwordResetTokensSchema';
import { users } from '@/db/usersSchema';
import { mailer } from '@/lib/email';
import { randomBytes } from 'crypto';
import { eq } from 'drizzle-orm';

// Get the current user by email address from the database
const getCurrentUser = async (emailAddress: string) => {
  const [user] = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(eq(users.email, emailAddress));
  return user;
};

// Generate a token expiration date
const generateTokenExpiration = () => {
  const oneHour = 3600000; // 1 hour in milliseconds
  return new Date(Date.now() + oneHour); // Current time + 1 hour
};

export const passwordReset = async (emailAddress: string) => {
  // Check if the user is already logged in
  const session = await auth();
  if (!!session?.user?.id) {
    return {
      error: true,
      message: 'You are already logged in.',
    };
  }
  // Get the user by email address
  const user = await getCurrentUser(emailAddress);

  // ! If the user doesn't exist, empty response due to security reasons
  if (!user) {
    return;
  }

  const passwordResetToken = randomBytes(32).toString('hex');
  const tokenExpiration = generateTokenExpiration();

  await db
    .insert(passwordResetTokensSchema)
    .values({
      userId: user.id,
      token: passwordResetToken,
      tokenExpiration,
    })

    // If the user already has a token, update the existing token
    .onConflictDoUpdate({
      target: [passwordResetTokensSchema.userId],
      set: {
        token: passwordResetToken,
        tokenExpiration,
      },
    });

  const resetLink = `${process.env.SITE_BASE_URL}/update-password?token=${passwordResetToken}`;

  await mailer.sendMail({
    from: 'test@resend.dev',
    subject: 'Your password reset request',
    to: emailAddress,
    html: `Hey, ${emailAddress}! You requested to reset your password.
Here's your password reset link. This link will expire in 1 hour:
<a href="${resetLink}">${resetLink}</a>`,
  });
};

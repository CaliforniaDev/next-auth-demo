'use server';

import { auth } from '@/auth';

import db from '@/db/drizzle';
import { eq } from 'drizzle-orm';
import { authenticator } from 'otplib';

import { users } from '@/db/usersSchema';

export const get2faSecret = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: true, message: 'Unauthorized' };
  }

  const userId = session.user.id;
  const userEmail = session.user.email ?? '';

  // Fetch user's existing 2FA secret
  const [user] = await db
    .select({ twoFactorSecret: users.twoFactorSecret })
    .from(users)
    .where(eq(users.id, parseInt(userId)));

  // Explicitly check if the user exists
  if (!user) {
    return { error: true, message: 'User not found' };
  }

  let twoFactorSecret = user.twoFactorSecret;

  // Generate and store a new 2FA secret if none exists
  if (!twoFactorSecret) {
    twoFactorSecret = authenticator.generateSecret();
    await db
      .update(users)
      .set({ twoFactorSecret })
      .where(eq(users.id, parseInt(userId)));
  }
  return {
    twoFactorSecret: authenticator.keyuri(
      userEmail,
      process.env.APP_NAME ?? 'NextAuth Course',
      twoFactorSecret,
    ),
  };
};

export const activate2fa = async (token: string) => {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: true, message: 'Unauthorized' };
  }

  const userId = session.user.id;

  // Fetch user's existing 2FA secret
  const [user] = await db
    .select({ twoFactorSecret: users.twoFactorSecret })
    .from(users)
    .where(eq(users.id, parseInt(userId)));

  // Explicitly check if the user exists
  if (!user) {
    return { error: true, message: 'User not found' };
  }

  if (user.twoFactorSecret) {
    const isTokenValid = authenticator.check(token, user.twoFactorSecret);

    if (!isTokenValid) {
      return { error: true, message: 'Invalid OTP' };
    }

    await db
      .update(users)
      .set({ twoFactorActivated: true })
      .where(eq(users.id, parseInt(userId)));
  }
};

export const disable2fa = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: true, message: 'Unauthorized' };
  }
  const userSessionId = session.user.id;

  await db
    .update(users)
    .set({ twoFactorActivated: false })
    .where(eq(users.id, parseInt(userSessionId)));
};

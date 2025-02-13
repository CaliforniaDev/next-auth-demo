import { auth } from '@/auth';
import db from '@/db/drizzle';
import { eq } from 'drizzle-orm';
import { users } from '@/db/usersSchema';

import TwoFactorAuthForm from './two-factor-auth-form';

import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Retrieves the user's two-factor authentication status from the database.
 * @param sessionUserId - The ID of the user from the session.
 * @returns A boolean indicating whether two-factor authentication is enabled.
 */
const getUserTwoFactorStatus = async (sessionUserId: number) => {
  const [user] = await db
    .select({
      twoFactorActivated: users.twoFactorActivated, // Using the actual database column
    })
    .from(users)
    .where(eq(users.id, sessionUserId));

  // Convert database column to a more readable prop name
  return user?.twoFactorActivated ?? false; // Ensure it defaults to false if undefined
};

export default async function MyAccount() {
  const session = await auth();
  const userId = parseInt(session?.user?.id!);

  // Fetch user's 2FA status
  const twoFactorEnabled = await getUserTwoFactorStatus(userId);

  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>My Account</CardTitle>
      </CardHeader>
      <CardContent>
        <Label className='font-semibold'>Email Address</Label>
        <div className='text-muted-foreground'>{session?.user?.email}</div>
        <TwoFactorAuthForm twoFactorEnabled={twoFactorEnabled} />
      </CardContent>
    </Card>
  );
}

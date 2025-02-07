import Link from 'next/link';
import db from '@/db/drizzle';
import { eq } from 'drizzle-orm';

import { passwordResetTokensSchema } from '@/db/passwordResetTokensSchema';
import UpdatePasswordForm from './update-password-form';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UpdatePasswordProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

// Query the password reset token with error handling
const queryResetToken = async (token: string) => {
  try {
    const [passwordResetToken] = await db
      .select()
      .from(passwordResetTokensSchema)
      .where(eq(passwordResetTokensSchema.token, token));
    return passwordResetToken;
  } catch (error) {
    console.error('Error querying reset token:', error);
    return null;
  }
};

// Validate the token expiration date with error handling
const validateToken = async (token: string) => {
  try {
    const passwordResetToken = await queryResetToken(token);
    const now = Date.now();

    if (
      !!passwordResetToken?.tokenExpiration &&
      now < passwordResetToken.tokenExpiration?.getTime()
    ) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

export default async function UpdatePassword({
  searchParams,
}: UpdatePasswordProps) {
  // Extract the token from the URL query parameters
  const { token } = await searchParams;
  // Check if the token is valid
  const isTokenValid = token ? await validateToken(token) : false;
  return (
    <main className='flex min-h-screen items-center justify-center'>
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle>
            {isTokenValid
              ? 'Update password'
              : 'Your password reset link is invalid or has expired.'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isTokenValid ? (
            <UpdatePasswordForm token={token ?? ''} />
          ) : (
            <Link href='/password-reset' className='underline'>
              Request another password reset link
            </Link>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

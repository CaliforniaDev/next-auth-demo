import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import db from '@/db/drizzle';
import { passwordResetTokensSchema } from '@/db/passwordResetTokensSchema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';

interface UpdatePasswordProps {
  searchParams: Promise <{
    token?: string;
  }>;
}

const queryResetToken = async (token: string) => {
  const [passwordResetToken] = await db
    .select()
    .from(passwordResetTokensSchema)
    .where(eq(passwordResetTokensSchema.token, token));
  return passwordResetToken;
};

export default async function UpdatePassword({
  searchParams,
}: UpdatePasswordProps) {
  const { token } = await searchParams;
  let isValidToken = false;

  if (token) {
    const passwordResetToken = await queryResetToken(token);

    const now = Date.now();

    if (
      !!passwordResetToken?.tokenExpiration &&
      now < passwordResetToken.tokenExpiration?.getTime()
    ) {
      isValidToken = true;
    }
  }
  return (
    <main className='flex min-h-screen items-center justify-center'>
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle>
            {isValidToken
              ? 'Update password'
              : 'Your password reset link is invalid or has expired.'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isValidToken ? (
            <div>update password form</div>
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

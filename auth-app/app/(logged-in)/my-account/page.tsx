import { auth } from '@/auth';
import TwoFactorAuthForm from './two-factor-auth-form';

import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';



export default async function MyAccount() {
  const session = await auth();
  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>My Account</CardTitle>
      </CardHeader>
      <CardContent>
        <Label className='font-semibold'>Email Address</Label>
        <div className='text-muted-foreground'>{session?.user?.email}</div>
        <TwoFactorAuthForm />
      </CardContent>
    </Card>
  );
}

import ChangePasswordForm from './change-password-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ChangePassword() {
  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        <ChangePasswordForm />
      </CardContent>
    </Card>
  );
}

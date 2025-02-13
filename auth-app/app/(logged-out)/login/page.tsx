'use client';

import { z } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordSchema } from '@/validation/passwordSchema';
import { loginWithCredentials, preLoginCheck } from './actions';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});
type FormData = z.infer<typeof formSchema>;

enum Steps {
  INITIAL = 1,
  REQUIRE_OTP = 2,
  CONFIRM_CODE = 3,
}

export default function Login() {
  const { toast } = useToast();
  const [step, setStep] = useState(Steps.INITIAL);
  const [otp, setOtp] = useState('');

  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = async (data: FormData) => {
    const preLoginCheckResponse = await preLoginCheck({
      email: data.email,
      password: data.password,
    });

    if (preLoginCheckResponse.error) {
      form.setError('root', {
        message: preLoginCheckResponse.message,
      });
      return;
    }

    if (preLoginCheckResponse.twoFactorActivated) {
      setStep(2);
    } else {
      const response = await loginWithCredentials({
        email: data.email,
        password: data.password,
      });

      if (response?.error) {
        form.setError('root', {
          message: response.message,
        });
      } else {
        router.push('/my-account');
      }
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await loginWithCredentials({
      email: form.getValues('email'),
      password: form.getValues('password'),
      token: otp,
    });
    console.log("🚀 ~ handleOTPSubmit ~ response:", response)

    if (response?.error) {
      toast({
        title: response.message,
        variant: 'destructive',
      });
    } else {
      router.push('/my-account');
    }
  };

  // Helper function to generate the password reset URL with the email query parameter
  const generatePasswordResetUrl = (email: string) => {
    const baseUrl = 'password-reset';
    return email ? `${baseUrl}?email=${encodeURIComponent(email)}` : baseUrl;
  };
  return (
    <main className='flex min-h-screen items-center justify-center'>
      {step === 1 && (
        <Card className='w-[350px]'>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Login to your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className='flex flex-col gap-2'
                onSubmit={form.handleSubmit(handleSubmit)}
              >
                <fieldset
                  disabled={form.formState.isSubmitting}
                  className='flex flex-col gap-2'
                >
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type='email' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input {...field} type='password' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {!!form.formState.errors.root?.message && (
                    <FormMessage>
                      {form.formState.errors.root.message}
                    </FormMessage>
                  )}
                  <Button type='submit'>Login</Button>
                </fieldset>
              </form>
            </Form>
          </CardContent>
          <CardFooter className='flex-col gap-2'>
            <div className='text-muted-foreground text-sm'>
              Don't have an account?{' '}
              <Link href='/register' className='underline'>
                Register
              </Link>
            </div>
            <div className='text-muted-foreground text-sm'>
              Forgot your password?{' '}
              <Link
                href={generatePasswordResetUrl(form.getValues('email'))}
                className='underline'
              >
                Reset my password
              </Link>
            </div>
          </CardFooter>
        </Card>
      )}
      {step === 2 && (
        <Card className='w-[350px]'>
          <CardHeader>
            <CardTitle>One-Time Passcode</CardTitle>
            <CardDescription>
              {`Enter the one-time passcode for ${process.env.APP_NAME} displayed in your Google Authenticator app`}
            </CardDescription>
            <CardContent>
              <form onSubmit={handleOTPSubmit} className='flex flex-col gap-2'>
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <Button type='submit' disabled={otp.length !== 6}>
                  Verify OTP
                </Button>
              </form>
            </CardContent>
          </CardHeader>
        </Card>
      )}
    </main>
  );
}

'use client';

import { z } from 'zod';
import Link from 'next/link';

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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { passwordReset } from './actions';

const formSchema = z.object({
  email: z.string().email(),
});

type FormData = z.infer<typeof formSchema>;

export default function PasswordReset() {
  const searchParams = useSearchParams();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: decodeURIComponent(searchParams.get('email') ?? ''),
    },
  });

  const handleSubmit = async (data: FormData) => {
    await passwordReset(data.email);
  };
  return (
    <main className='flex min-h-screen items-center justify-center'>
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle>Password Reset</CardTitle>
          <CardDescription>
            Enter your email address to reset your password.
          </CardDescription>
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

                {!!form.formState.errors.root?.message && (
                  <FormMessage>
                    {form.formState.errors.root.message}
                  </FormMessage>
                )}
                <Button type='submit'>Submit</Button>
              </fieldset>
            </form>
          </Form>
        </CardContent>
        <CardFooter className='text-muted-foreground flex-col gap-2 text-sm'>
          <div>
            Remember your password?{' '}
            <Link href='/login' className='underline'>
              Login
            </Link>
          </div>
          <div>
            Don't have an account?{' '}
            <Link href='/register' className='underline'>
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}

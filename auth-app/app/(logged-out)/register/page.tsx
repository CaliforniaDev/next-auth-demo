'use client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { registerUser } from './actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordMatchSchema } from '@/validation/passwordMatchSchema';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
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
import Link from 'next/link';

const formSchema = z
  .object({
    email: z.string().email(),
  })
  .and(passwordMatchSchema);

type FormData = z.infer<typeof formSchema>;

export default function Register() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const handleSubmit = async (data: FormData) => {
    const response = await registerUser({
      email: data.email,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    });

    if (response?.error) {
      form.setError('email', {
        message: response?.message,
      });
    }
    console.log(response);
  };

  return (
    <main className='flex min-h-screen items-center justify-center'>
      {form.formState.isSubmitSuccessful ? (
        <Card className='w-[350px]'>
          <CardHeader className='w-full text-center'>
            <CardTitle>Your account has been created</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild className='w-full'>
              <Link href='/login'>Login to your account</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className='w-[350px]'>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Register for a new account</CardDescription>
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
                  <FormField
                    control={form.control}
                    name='passwordConfirm'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password confirm</FormLabel>
                        <FormControl>
                          <Input {...field} type='password' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type='submit'>Register</Button>
                </fieldset>
              </form>
            </Form>
          </CardContent>
          <CardFooter className='flex-col gap-2'>
            <div className='text-muted-foreground text-sm'>
              Already have an account?{' '}
              <Link href='/login' className='underline'>
                Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      )}
    </main>
  );
}

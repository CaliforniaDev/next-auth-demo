'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5, 'Password must be at least 5 characters'),
  passwordConfirm: z.string(),
});

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

  const submitHandler = async (data: FormData) => {};
  return (
    <main className='flex min-h-screen items-center justify-center'>
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Register for a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submitHandler)}></form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}

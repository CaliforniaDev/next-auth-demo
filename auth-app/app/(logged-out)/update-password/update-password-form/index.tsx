'use client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';

import { passwordMatchSchema } from '@/validation/passwordMatchSchema';
import { updatePassword } from './actions';

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


const formSchema = passwordMatchSchema;

type FormData = z.infer<typeof formSchema>;

interface UpdatePasswordFormProps {
  token: string;
}

export default function UpdatePasswordForm({token}: UpdatePasswordFormProps) {
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
  });
  const handleSubmit = async (data: FormData) => {
    const response = await updatePassword({
      token,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    });

    if (response?.error) {
      form.setError('root', {
        message: response.message,
      });
    } else {
      toast({
        title: 'Password changed.',
        description: 'Your password has been successfully updated.',
        className: 'bg-green-500 text-white',
      });
      form.reset();
    }
  };
  return (
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
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
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
                <FormLabel>New Password Confirm</FormLabel>
                <FormControl>
                  <Input {...field} type='password' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!!form.formState.errors.root?.message && (
            <FormMessage>{form.formState.errors.root?.message}</FormMessage>
          )}
          <Button type='submit'>Update Password</Button>
        </fieldset>
      </form>
    </Form>
  );
}

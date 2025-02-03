import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function LoggedOutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // If the user is logged in, redirect them to the my-account page
  if (!!session?.user?.id) {
    redirect('/my-account');
  }
  return children;
}

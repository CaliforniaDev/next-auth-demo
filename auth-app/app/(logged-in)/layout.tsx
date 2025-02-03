import Link from 'next/link';
import LogoutButton from './logout-button';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function LoggedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  // If the user is not logged in, redirect them to the login page
  if (!session?.user?.id) {
    redirect('/login');
  }
  return (
    <div className='flex min-h-screen flex-col'>
      <nav className='flex items-center justify-between bg-gray-200 p-4 font-medium'>
        <ul className='flex gap-4'>
          <li>
            <Link href={'/my-account'}>My Account</Link>
          </li>
          <li>
            <Link href={'/change-password'}>Change Password</Link>
          </li>
        </ul>
        <div>
          <LogoutButton />
        </div>
      </nav>
      <div className='flex flex-1 items-center justify-center'>{children}</div>
    </div>
  );
}

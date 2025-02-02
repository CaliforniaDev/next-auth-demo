'use client';
import { Button } from '@/components/ui/button';
import { logOut } from './actions';

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      await logOut();
    } catch (e) {
      console.error('Failed to log out:', e);
    }
  };
  return (
    <Button size='sm' onClick={handleLogout}>
      Logout
    </Button>
  );
}

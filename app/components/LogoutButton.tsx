'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <button onClick={handleLogout} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600">
      Logout
    </button>
  );
}
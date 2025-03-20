import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import LogoutButton from './components/LogoutButton';

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return null;

  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Contacts</h1>
        <LogoutButton />
      </div>
      {error && <p className="text-red-500">{error.message}</p>}
      <ul className="space-y-4">
        {contacts?.map((contact) => (
          <li key={contact.id} className="p-4 bg-gray-100 rounded flex justify-between items-center">
            <Link href={`/contacts/${contact.id}`} className="text-blue-500 hover:underline">
              {contact.name}
            </Link>
            <form action={async () => {
              'use server';
              const supabase = createServerComponentClient({ cookies });
              await supabase.from('contacts').delete().eq('id', contact.id);
            }}>
              <button type="submit" className="text-red-500 hover:text-red-700">Delete</button>
            </form>
          </li>
        ))}
      </ul>
      <Link href="/new-contact" className="mt-6 inline-block bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Add New Contact
      </Link>
    </div>
  );
}
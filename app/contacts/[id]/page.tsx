import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import AddNoteForm from './AddNoteForm';
import { type NextPage } from 'next';

interface ContactPageProps {
  params: Promise<{ id: string }>;  // params is now a Promise
}

const ContactPage: NextPage<ContactPageProps> = async ({ params }) => {
  const resolvedParams = await params;  // Resolve the Promise
  const { id } = resolvedParams;

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: contact, error: contactError } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single();

  const { data: notes, error: notesError } = await supabase
    .from('notes')
    .select('*')
    .eq('contact_id', id)
    .order('created_at', { ascending: false });

  if (contactError) return <div className="text-red-500">Error: {contactError.message}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-4">{contact.name}</h1>
      <p>Email: {contact.email || 'N/A'}</p>
      <p>Phone: {contact.phone || 'N/A'}</p>
      <h2 className="text-2xl font-semibold mt-6 mb-4">Notes</h2>
      {notesError && <p className="text-red-500">{notesError.message}</p>}
      <ul className="space-y-4">
        {notes?.map((note) => (
          <li key={note.id} className="p-4 bg-gray-100 rounded flex justify-between items-center">
            <span>{note.note_text}</span>
            <form action={async () => {
              'use server';
              const cookieStore = cookies();
              const supabase = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                  cookies: {
                    get(name) {
                      return cookieStore.get(name)?.value;
                    },
                  },
                }
              );
              await supabase.from('notes').delete().eq('id', note.id);
            }}>
              <button type="submit" className="text-red-500 hover:text-red-700">Delete</button>
            </form>
          </li>
        ))}
      </ul>
      <AddNoteForm contactId={id} />
    </div>
  );
};

export default ContactPage;
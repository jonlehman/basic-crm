'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AddNoteForm({ contactId }: { contactId: string }) {
  const [noteText, setNoteText] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('notes').insert([{ contact_id: contactId, note_text: noteText }]);
    if (error) setMessage(error.message);
    else {
      setMessage('Note added successfully');
      setNoteText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <textarea
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        placeholder="Add a note"
        className="w-full p-2 border rounded mb-4"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Add Note
      </button>
      {message && <p className="mt-2 text-green-500">{message}</p>}
    </form>
  );
}
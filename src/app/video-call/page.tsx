'use client';

import { useState } from 'react';
import { Account, Client } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

const account = new Account(client);

export default function VideoCallPage() {
  const [receiverId, setReceiverId] = useState('');
  const [offer, setOffer] = useState('');

  const startCall = async () => {
    try {
      const session = await account.get();
      const callerId = session.$id; // Get the logged-in user as the caller

      // Make API call to create the call in Appwrite
      const res = await fetch('/api/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callerId,
          receiverId,
          offer,
        }),
      });

      const data = await res.json();
      console.log('Call created:', data);
    } catch (err) {
      console.error('Failed to start call:', err);
      alert('Error creating call. Please make sure you are logged in.');
    }
  };

  return (
    <div className="p-4">
      <input
        className="border px-2 py-1 mr-2"
        placeholder="Receiver ID"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
      />
      <input
        className="border px-2 py-1 mr-2"
        placeholder="Offer (SDP or dummy)"
        value={offer}
        onChange={(e) => setOffer(e.target.value)}
      />
      <button onClick={startCall} className="bg-blue-600 text-white px-4 py-2 rounded">
        Start Call
      </button>
    </div>
  );
}

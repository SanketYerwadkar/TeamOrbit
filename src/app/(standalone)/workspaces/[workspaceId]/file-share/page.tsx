'use client';

import { useState } from 'react';
import { ID, Storage, Client } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

const storage = new Storage(client);

export default function FileSharePage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleUpload = async () => {
    if (!file) return;

    try {
      const response = await storage.createFile(
        process.env.NEXT_PUBLIC_APPWRITE_FILES_BUCKET_ID!,
        ID.unique(),
        file
      );
      setUploadStatus('✅ File uploaded successfully: ' + response.$id);
    } catch (error) {
      console.error(error);
      setUploadStatus('❌ Upload failed.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Upload File</h2>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Upload
      </button>
      <p className="mt-2">{uploadStatus}</p>
    </div>
  );
}

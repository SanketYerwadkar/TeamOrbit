import { Client, Databases, ID } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

const databases = new Databases(client);

const CALLS_ID = process.env.NEXT_PUBLIC_APPWRITE_CALLS_COLLECTION_ID!;

export const createCall = async (callerId: string, receiverId: string, offer: string) => {
  try {
    const response = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,           // Database ID
      CALLS_ID,                                               // Collection ID
      ID.unique(),                                            // Unique document ID
      {
        callerId,                                             // Caller ID
        receiverId,                                           // Receiver ID
        offer,                                                // Offer (SDP or dummy)
        status: 'pending',                                    // Initial status
      }
    );
    return response;  // Return response from Appwrite (call document)
  } catch (error) {
    console.error('Error creating call:', error);  // Log errors
    throw error;  // Rethrow error for further handling
  }
};

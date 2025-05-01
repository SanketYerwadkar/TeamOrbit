// src/lib/appwrite.ts
import { cookies } from 'next/headers';
import { Account, Client, Databases, Storage, Users } from 'node-appwrite';
import 'server-only';

import { AUTH_COOKIE } from '@/features/auth/constants';

// Function to create the authenticated user session client
export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // Set the endpoint
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!); // Set the project ID

  // Get session from cookies
  const session = cookies().get(AUTH_COOKIE);

  if (!session || !session.value) throw new Error('Unauthorized.');

  // Set session for the client
  client.setSession(session.value);

  return {
    get account() {
      return new Account(client); // Use the Account service
    },
    get databases() {
      return new Databases(client); // Use the Databases service
    },
    get storage() {
      return new Storage(client); // Use the Storage service
    },
  };
}

// Function to create the admin client
export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // Set the endpoint
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY); // Set admin API key

  return {
    get account() {
      return new Account(client); // Use the Account service
    },
    get users() {
      return new Users(client); // Use the Users service
    },
  };
}

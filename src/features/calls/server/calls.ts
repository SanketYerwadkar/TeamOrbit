// src/features/calls/server/call.ts
import { Hono } from 'hono';

import { createCall } from '@/lib/callService';

// Import the createCall function

const callRouter = new Hono();

// Handle creating a call
callRouter.post('/', async (ctx) => {
  const { callerId, receiverId, offer } = await ctx.req.json();

  try {
    await createCall(callerId, receiverId, offer); // Call the function to create a call in Appwrite
    return ctx.json({ message: 'Call created successfully' }, 200);
  } catch (error) {
    return ctx.json({ message: 'Error creating call' }, 500);
  }
});

export default callRouter;

import { Hono } from 'hono';
import { createCall } from '@/lib/callService';

const callRoutes = new Hono();

callRoutes.post('/', async (c) => {
  const body = await c.req.json();
  const { callerId, receiverId, offer } = body;

  if (!callerId || !receiverId || !offer) {
    return c.json({ error: 'Missing fields' }, 400);
  }

  try {
    const call = await createCall(callerId, receiverId, offer); // Create the call using the correct collection ID
    return c.json({
      call: {
        callerId,
        receiverId,
        offer,
        status: 'pending',
        id: call.$id,  // Appwrite generates a unique ID for the call document
      },
    }, 200);
  } catch {
    return c.json({ error: 'Failed to create call' }, 500);
  }
});

export default callRoutes;

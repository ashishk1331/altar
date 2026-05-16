import { useMutation } from 'convex/react';

import { api } from '@/convex/_generated/api';

export default function useAddPoem() {
  return useMutation(api.poems.writePoem);
}

import { useMutation } from 'convex/react';

import { api } from '@/convex/_generated/api';

export default function useAddComment() {
  return useMutation(api.comments.writeComment);
}

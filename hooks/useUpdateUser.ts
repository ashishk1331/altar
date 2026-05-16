import { useMutation } from 'convex/react';

import { api } from '@/convex/_generated/api';

export default function useUpdateUser() {
  return useMutation(api.users.updateUser);
}

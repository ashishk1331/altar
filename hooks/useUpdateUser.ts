import { supabase } from "@/util/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type DataType = {
  userId: string;
  name?: string;
  bio?: string;
};

const updateUser = async (data: DataType) => {
  const { userId, ...rest } = data;
  return supabase.from("authors").update(rest).eq("id", userId).select();
};

export default function useUpdateUser(id: string) {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationKey: ["author", id],
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["author", id] });
    },
  });

  return mutate;
}

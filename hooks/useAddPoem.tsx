import { supabase } from "@/util/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type PseudoPostType = {
  author_id: string;
  title: string;
  content: string;
};

const addPoem = async (data: PseudoPostType) => {
  return supabase.from("posts").insert([data]);
};

export default function useAddPoem() {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationKey: ["posts"],
    mutationFn: addPoem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return mutate;
}

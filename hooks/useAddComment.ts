import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/util/supabase";

export type PseudoCommentType = {
  message: string;
  author_id: string;
  post_id: string;
};

const addComment = async (data: PseudoCommentType) => {
  return supabase.from("comments").insert([data]);
};

export default function useAddComment(id: string) {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationKey: ["comments", id],
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
    },
  });

  return mutate;
}

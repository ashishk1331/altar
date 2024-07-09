import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/util/supabase";
import { Tables } from "@/types/database.types";

const getComments = async (id: string) => {
  return supabase.from("comments").select("*").eq("post_id", id);
};

export default function useFetchCommentsForPost(id: string) {
  const postsQuery = useQuery({
    queryKey: ["comments", id],
    queryFn: () => getComments(id),
  });

  return postsQuery;
}

export type CommentType = Tables<"comments">;

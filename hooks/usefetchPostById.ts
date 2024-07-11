import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/util/supabase";

const getAllPostById = async (postId: string) => {
  return supabase
    .from("posts")
    .select("*, authors ( name )")
    .eq("id", postId)
    .single();
};

export default function useFetchPostById(postId: string) {
  const postsQuery = useQuery({
    queryKey: ["posts", postId],
    queryFn: () => getAllPostById(postId),
  });

  return postsQuery;
}

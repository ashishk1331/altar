import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/util/supabase";

const getAllPostsByUser = async (id: string) => {
  return supabase
    .from("posts")
    .select("*, authors ( name )")
    .eq("author_id", id)
    .order("created_at", { ascending: false });
};

export default function useFetchPostsByUser(id: string) {
  const postsQuery = useQuery({
    queryKey: ["posts", id],
    queryFn: () => getAllPostsByUser(id),
  });

  return postsQuery;
}

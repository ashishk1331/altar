import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/util/supabase";

const getDraftsByUser = async (id: string) => {
  return supabase
    .from("posts")
    .select("*")
    .eq("author_id", id)
    .eq("is_draft", true)
    .order("created_at", { ascending: false });
};

export default function useFetchDraftsByUser(id: string) {
  const postsQuery = useQuery({
    queryKey: ["drafts", id],
    queryFn: () => getDraftsByUser(id),
  });

  return postsQuery;
}

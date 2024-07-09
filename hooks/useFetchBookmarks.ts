import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/util/supabase";
import { Tables } from "@/types/database.types";

const getBookmarks = async (id: string) => {
  return supabase
    .from("bookmarks")
    .select()
    .eq("author_id", id)
    .order("created_at", { ascending: false });
};

export default function useFetchBookmarks(id: string) {
  const postsQuery = useQuery({
    queryKey: ["bookmarks", id],
    queryFn: () => getBookmarks(id),
  });

  return postsQuery;
}

export type CommentType = Tables<"bookmarks">;

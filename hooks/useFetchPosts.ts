import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/util/supabase";
import { Tables } from "@/types/database.types";
import { AuthorType } from "./useFetchUser";

const getAllPosts = async () => {
  return supabase
    .from("posts")
    .select("*, authors ( name )")
    .order("created_at", { ascending: false });
};

export default function useFetchPosts() {
  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });

  return postsQuery;
}

export type PostType = Tables<"posts"> & {
  authors: Partial<AuthorType>;
};

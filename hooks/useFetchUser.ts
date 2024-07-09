import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/util/supabase";
import { Tables } from "@/types/database.types";

const getAuthor = async (id: string) => {
  return supabase.from("authors").select("*").eq("id", id).single();
};

export default function useFetchUser(id: string) {
  const postsQuery = useQuery({
    queryKey: ["author", id],
    queryFn: () => getAuthor(id),
  });

  return postsQuery;
}

export type AuthorType = Tables<"authors">;

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/util/supabase";

const getPostsByRange = async (index: number) => {
  return supabase
    .from("posts")
    .select("*, authors ( name )")
    .order("created_at", { ascending: false })
    .range(index * 12, (index + 1) * 12);
};

export default function useFetchPostsByRange(index: number) {
  const postsQuery = useQuery({
    queryKey: ["posts", "range", index],
    queryFn: () => getPostsByRange(index),
  });

  return postsQuery;
}

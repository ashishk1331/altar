import { supabase } from "@/util/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type PseudoBookmarkType = {
  author_id: string;
  post_id: string;
};

const updateBookmark = async (data: PseudoBookmarkType) => {
  const { author_id, post_id } = data;

  // Check if the bookmark exists
  const { data: existingBookmark, error: selectError } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("author_id", author_id)
    .eq("post_id", post_id)
    .single();

  if (selectError && selectError.code !== "PGRST116") {
    // Handle error if it's not "No rows found"
    console.error("Error checking bookmark:", selectError);
    return;
  }

  if (existingBookmark) {
    // Bookmark exists, delete it
    const { error: deleteError } = await supabase
      .from("bookmarks")
      .delete()
      .eq("author_id", author_id)
      .eq("post_id", post_id);

    if (deleteError) {
      console.error("Error deleting bookmark:", deleteError);
    } else {
      console.log("Bookmark deleted");
    }
  } else {
    // Bookmark doesn't exist, insert it
    const { error: insertError } = await supabase
      .from("bookmarks")
      .insert([data]);

    if (insertError) {
      console.error("Error inserting bookmark:", insertError);
    } else {
      console.log("Bookmark added");
    }
  }
};

export default function useUpdateBookmark(id: string) {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationKey: ["bookmarks", id],
    mutationFn: updateBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks", id] });
    },
  });

  return mutate;
}

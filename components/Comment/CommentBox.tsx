// Library
import React from "react";
import { SendDiagonal } from "iconoir-react-native";
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// Components
import { InputBoxClean } from "../ui/InputBox";
import Flex from "../ui/Flex";

// Constants
import { Icon } from "@/constants/Icon";
import { Colors } from "@/constants/Colors";
import { useSession } from "@/wrapper/SessionWrapper";
import useAddComment, { PseudoCommentType } from "@/hooks/useAddComment";

type CommentBoxProps = {
  postId: string;
};

export default function CommentBox({ postId }: CommentBoxProps) {
  const { session } = useSession();
  const userId = session?.user.id ?? "";
  const { mutate, isPending } = useAddComment(postId);

  const [commentText, setCommentText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  function handleSubmit() {
    try {
      setIsLoading(true);

      const payload = {} as PseudoCommentType;

      if (commentText.trim().length > 0) {
        payload["message"] = commentText.trim();
      } else {
        return;
      }

      payload["author_id"] = userId;
      payload["post_id"] = postId;

      mutate(payload);
      setCommentText("");
      Keyboard.dismiss();
    } catch {
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.conatiner}>
      <Flex p={16}>
        <InputBoxClean
          value={commentText}
          setValue={setCommentText}
          placeholder="type your comment here"
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSubmit}
          disabled={isPending || isLoading}
        >
          {isLoading || isPending ? (
            <ActivityIndicator />
          ) : (
            <SendDiagonal {...Icon} />
          )}
        </TouchableOpacity>
      </Flex>
    </View>
  );
}

const styles = StyleSheet.create({
  conatiner: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.lightGray,

    shadowColor: Colors.light.grayed,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 1,
  },
  sendButton: {
    padding: 10,
  },
});

// Library
import { MoreHoriz } from "iconoir-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";

// Components
import Flex from "../ui/Flex";
// import ImageContainer from "../ui/ImageContainer";
import { Footnote, Paragraph } from "../ui/Text";
import { IconButton } from "../ui/Button";

// Constants
import { Colors } from "@/constants/Colors";
import { Icon } from "@/constants/Icon";
import { jumpToProfile } from "@/util/jumpTo";
import { CommentType } from "@/hooks/useFetchCommentsForPost";
import { formatDistanceToNow } from "date-fns";
import useFetchUser from "@/hooks/useFetchUser";
import { emailToName } from "@/util/handy";
import Avatar from "../ui/Avatar";

type PostProps = {
  comment: CommentType;
  isEditable?: boolean;
};

export default function Comment({ comment, isEditable }: PostProps) {
  const { data, isPending } = useFetchUser(comment.author_id || "");

  return (
    <View style={styles.container}>
      <Flex direction="column" gap={10} p={10} w="100%">
        <TouchableOpacity
          onPress={() => jumpToProfile(comment.author_id || "")}
        >
          <Flex gap={10} items="center" justify="space-between" w="100%">
            <Flex gap={10} items="center">
              <Avatar
                width={28}
                name={
                  !isPending && data?.data
                    ? emailToName(data.data.name || "")
                    : ""
                }
              />
              <Footnote>
                {!isPending && data?.data
                  ? emailToName(data.data.name || "")
                  : ""}
              </Footnote>
              <Footnote color={Colors.light.grayed}>
                {formatDistanceToNow(new Date(comment.created_at))}
              </Footnote>
            </Flex>
            {isEditable && (
              <IconButton>
                <MoreHoriz {...Icon} />
              </IconButton>
            )}
          </Flex>
        </TouchableOpacity>
        <View style={styles.content}>
          <Paragraph>{comment.message}</Paragraph>
        </View>
      </Flex>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  content: {
    paddingLeft: 28 + 10,
  },
});

// Library
import {
  Bookmark,
  ChatBubbleEmpty,
  Heart,
  MoreHoriz,
} from "iconoir-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

// Components
import Flex from "../ui/Flex";
import ImageContainer from "../ui/ImageContainer";
import { Caption, Footnote, LargeBody, Paragraph } from "../ui/Text";
import { IconButton } from "../ui/Button";

// Constants
import { Colors } from "@/constants/Colors";
import { Icon } from "@/constants/Icon";

type PostProps = {
  id: string;
  isEditable?: boolean;
};

export default function Post({ id, isEditable }: PostProps) {
  function goToPost(id: string) {
    router.push(`/poem/${id}`);
  }

  function goToProfile(id: string) {
    router.push(`/profile/${id}`);
  }

  return (
    <View style={styles.container}>
      <Flex direction="column" gap={16} p={10} w="100%">
        <Flex gap={10} items="center" justify="space-between" w="100%">
          <TouchableOpacity onPress={() => goToProfile("abc")}>
            <Flex gap={10} items="center">
              <ImageContainer width={28} />
              <Footnote>Boring Mule</Footnote>
              <Footnote color={Colors.light.grayed}>4m</Footnote>
            </Flex>
          </TouchableOpacity>
          {isEditable && (
            <IconButton>
              <MoreHoriz {...Icon} />
            </IconButton>
          )}
        </Flex>
        <TouchableOpacity style={styles.content} onPress={() => goToPost(id)}>
          <Flex w="100%" direction="column" gap={10}>
            <LargeBody>Title to the poem</LargeBody>
            <Paragraph>
              Military-grade warehouse wonton soup car courier tiger-team 8-bit
              sub-orbital numinous dome rebar realism rain camera semiotics.
              Apophenia rebar numinous otaku...
            </Paragraph>
          </Flex>
        </TouchableOpacity>
        <Flex items="center" w="100%" justify="space-between">
          <Flex gap={24}>
            <Flex gap={0} items="center">
              <IconButton>
                <Heart {...Icon} />
              </IconButton>
              <Caption>122</Caption>
            </Flex>
            <Flex gap={0} items="center">
              <IconButton>
                <ChatBubbleEmpty {...Icon} />
              </IconButton>
              <Caption>8</Caption>
            </Flex>
          </Flex>

          <IconButton>
            <Bookmark {...Icon} />
          </IconButton>
        </Flex>
      </Flex>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  content: {
    marginVertical: 10,
  },
});

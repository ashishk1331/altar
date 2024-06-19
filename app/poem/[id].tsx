// Library
import { StyleSheet, ScrollView, View, TouchableOpacity } from "react-native";
import { Bookmark, ChatBubbleEmpty, Heart } from "iconoir-react-native";
import { router } from "expo-router";

// Components
import Navbar from "@/components/ui/Navbar";
import Separator from "@/components/ui/Separator";
import { IconButton } from "@/components/ui/Button";
import Flex from "@/components/ui/Flex";
import ImageContainer from "@/components/ui/ImageContainer";
import Comment from "@/components/Comment";
import { Caption, Footnote, LargeBody, Paragraph } from "@/components/ui/Text";

// Constants
import { Icon } from "@/constants/Icon";
import { Colors } from "@/constants/Colors";

export default function Poem() {
  function goToProfile(id: string) {
    router.push(`/profile/${id}`);
  }

  return (
    <ScrollView style={[styles.container, styles.outer]}>
      <Navbar title="" />
      <Flex w="100%" direction="column" gap={10} p={10}>
        <LargeBody>Title to the poem</LargeBody>
        <Paragraph>
          Military-grade warehouse wonton soup car courier tiger-team 8-bit
          sub-orbital numinous dome rebar realism rain camera semiotics.
          Apophenia rebar numinous otaku...
        </Paragraph>
      </Flex>
      <Separator />
      <TouchableOpacity onPress={() => goToProfile("abc")}>
        <Flex gap={10} items="center" justify="flex-start" w="100%" p={10}>
          <ImageContainer width={28} />
          <Footnote>Boring Mule</Footnote>
          <Footnote color={Colors.light.grayed}>4m</Footnote>
        </Flex>
      </TouchableOpacity>
      <Flex items="center" w="100%" justify="space-between" p={10}>
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
      <Separator />
      <View style={styles.bottomPadding}>
        <Flex direction="column" w="100%">
          {Array(12)
            .fill("")
            .map((_, index) => (
              <Comment key={index} />
            ))}
        </Flex>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    gap: 10,
  },
  outer: {
    padding: 10,
  },
  list: {
    paddingVertical: 10,
  },
  bottomPadding: {
    paddingBottom: 64,
  },
});

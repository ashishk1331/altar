import { Colors } from "@/constants/Colors";
import Flex from "../ui/Flex";
import ImageContainer from "../ui/ImageContainer";
import { Footnote, Paragraph } from "../ui/Text";
import { IconButton } from "../ui/Button";
import { MoreHoriz } from "iconoir-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Icon } from "@/constants/Icon";

type PostProps = {
  isEditable?: boolean;
};

export default function Comment({ isEditable }: PostProps) {
  function goToProfile(id: string) {
    router.push(`/profile/${id}`);
  }

  return (
    <View style={styles.container}>
      <Flex direction="column" gap={10} p={10} w="100%">
        <TouchableOpacity onPress={() => goToProfile("abc")}>
          <Flex gap={10} items="center" justify="space-between" w="100%">
            <Flex gap={10} items="center">
              <ImageContainer width={28} />
              <Footnote>Boring Mule</Footnote>
              <Footnote color={Colors.light.grayed}>4m</Footnote>
            </Flex>
            {isEditable && (
              <IconButton>
                <MoreHoriz {...Icon} />
              </IconButton>
            )}
          </Flex>
        </TouchableOpacity>
        <View style={styles.content}>
          <Paragraph>
            I loved the poem. Also, when is your next poem coming out. Waiting
            eagerly for it.
          </Paragraph>
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

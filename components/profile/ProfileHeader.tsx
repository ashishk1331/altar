import { StyleSheet, View } from "react-native";

import Flex from "../ui/Flex";
import ImageContainer from "../ui/ImageContainer";
import { Caption, Paragraph } from "../ui/Text";

export default function ProfileHeader() {
  return (
    <View style={styles.container}>
      <Flex gap={16}>
        <ImageContainer width={120} />
        <Flex direction="column">
          <Paragraph>Ashish Khare</Paragraph>
          <Caption>@ashuzon</Caption>
          <Caption>Let's run away to Milan!</Caption>

          <View style={styles.bar}>
            <Flex justify="space-between" gap={24}>
              <Caption>134 followers</Caption>
              <Caption>32 following</Caption>
            </Flex>
          </View>
        </Flex>
      </Flex>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  bar: {
    marginTop: 24,
  },
});

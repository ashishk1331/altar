// Library
import React from "react";
import { PeaceHand } from "iconoir-react-native";
import { router } from "expo-router";

// Components
import Container from "@/components/ui/Container";
import { Paragraph } from "@/components/ui/Text";
import Flex from "@/components/ui/Flex";

// Constants
import { Colors } from "@/constants/Colors";

export default function Page() {
  React.useEffect(() => {
    async function logout() {
      // implement logic

      router.replace("/");
    }

    logout();
  }, []);

  return (
    <Container>
      <Flex direction="column" gap={16} items="center">
        <PeaceHand
          color={Colors.light.text}
          height={42}
          width={42}
          strokeWidth={1.2}
        />
        <Paragraph>logging you out...</Paragraph>
      </Flex>
    </Container>
  );
}

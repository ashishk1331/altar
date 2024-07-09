// Library
import React from "react";
import { PeaceHand } from "iconoir-react-native";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";

// Components
import Container from "@/components/ui/Container";
import { Paragraph } from "@/components/ui/Text";
import Flex from "@/components/ui/Flex";
import ErrorBox from "@/components/ui/ErrorBox";
import Button from "@/components/ui/Button";

// Constants
import { Colors } from "@/constants/Colors";
import { signOut } from "@/util/auth";
import { jumpToHome } from "@/util/jumpTo";
import { useSession } from "@/wrapper/SessionWrapper";

export default function Page() {
  const { session, resetSession } = useSession();
  const userId = session?.user.id ?? "";

  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function logout() {
      const { ok, ...rest } = await signOut();
      if (!ok) {
        if (rest.message) {
          setErrorMessage(rest.message);
          return;
        }
      }
      queryClient.invalidateQueries({ queryKey: ["author", userId] });
      resetSession();
      router.replace("/");
    }

    logout();
  }, [queryClient, userId]);

  return (
    <Container>
      <Flex direction="column" gap={16} items="center">
        {errorMessage ? (
          <>
            <ErrorBox message={errorMessage} />
            <Button onPress={jumpToHome}>Head Back</Button>
          </>
        ) : (
          <>
            <PeaceHand
              color={Colors.light.text}
              height={42}
              width={42}
              strokeWidth={1.2}
            />
            <Paragraph>logging you out...</Paragraph>
          </>
        )}
      </Flex>
    </Container>
  );
}

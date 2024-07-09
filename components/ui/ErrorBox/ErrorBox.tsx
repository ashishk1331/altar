// Library
import { WarningTriangle } from "iconoir-react-native";

// Components
import { Caption } from "../Text";
import Flex from "../Flex";

// Contants
import { Colors } from "@/constants/Colors";

type ErrorBoxProps = {
  message: string;
};

export default function ErrorBox({ message }: ErrorBoxProps) {
  if (!message) {
    return null;
  }
  return (
    <Flex w="100%" justify="flex-start" items="center" gap={8}>
      <WarningTriangle color={Colors.light.wrong} width={16} height={16} />
      <Caption color={Colors.light.wrong}>{message}</Caption>
    </Flex>
  );
}

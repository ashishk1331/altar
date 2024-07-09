// Library
import { CheckCircle } from "iconoir-react-native";

// Components
import { Caption } from "../Text";
import Flex from "../Flex";

// Contants
import { Colors } from "@/constants/Colors";

type SuccessBoxProps = {
  message: string;
};

export default function SuccessBox({ message }: SuccessBoxProps) {
  if (!message) {
    return null;
  }
  return (
    <Flex w="100%" justify="flex-start" items="center" gap={8}>
      <CheckCircle color={Colors.light.success} width={16} height={16} />
      <Caption color={Colors.light.text}>{message}</Caption>
    </Flex>
  );
}

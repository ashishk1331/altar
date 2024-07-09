import Container from "../ui/Container";
import Flex from "../ui/Flex";
import { Paragraph } from "../ui/Text";

type EmptyFeedProps = {
  message?: string;
};

export default function EmptyFeed({ message = "" }: EmptyFeedProps) {
  return (
    <Container>
      <Flex justify="space-around" items="center" w="100%">
        <Paragraph>{message ?? "No Posts yet"}</Paragraph>
      </Flex>
    </Container>
  );
}

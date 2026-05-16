import GoogleSignInButton from '@/components/logIn/GoogleSignInButton';
import Container from '@/components/ui/Container';
import Flex from '@/components/ui/Flex';
import { LargeTitle } from '@/components/ui/Text';

export default function Page() {
  return (
    <Container>
      <Flex items='center' direction="column" gap={36}>
        <LargeTitle>altar</LargeTitle>
        <GoogleSignInButton />
      </Flex>
    </Container>
  );
}

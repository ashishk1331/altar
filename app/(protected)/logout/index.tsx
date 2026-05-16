import React from 'react';
import { PeaceHand } from 'iconoir-react-native';
import { router } from 'expo-router';

import Container from '@/components/ui/Container';
import { Paragraph } from '@/components/ui/Text';
import Flex from '@/components/ui/Flex';
import ErrorBox from '@/components/ui/ErrorBox';
import Button from '@/components/ui/Button';

import { Colors } from '@/constants/Colors';
import { jumpToHome } from '@/util/jumpTo';
import { useSession } from '@/wrapper/SessionWrapper';

export default function Page() {
  const { signOut } = useSession();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function logout() {
      try {
        await signOut();
        router.replace('/');
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : 'Logout failed');
      }
    }
    logout();
  }, [signOut]);

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
            <PeaceHand color={Colors.light.text} height={42} width={42} strokeWidth={1.2} />
            <Paragraph>logging you out...</Paragraph>
          </>
        )}
      </Flex>
    </Container>
  );
}

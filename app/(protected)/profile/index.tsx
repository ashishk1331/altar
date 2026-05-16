import Navbar from '@/components/ui/Navbar';
import Flex from '@/components/ui/Flex';
import ProfileHeader from '@/components/profile/ProfileHeader';
import Setting from '@/components/profile/Setting';
import { Paragraph } from '@/components/ui/Text';
import { useSession } from '@/wrapper/SessionWrapper';

export default function Index() {
  const { isLoading, user } = useSession();

  function getContent() {
    if (isLoading) {
      return (
        <Flex w="100%">
          <Paragraph>Loading Session.</Paragraph>
        </Flex>
      );
    }

    if (!user) {
      return (
        <Flex w="100%">
          <Paragraph>No active session found.</Paragraph>
        </Flex>
      );
    }

    return (
      <>
        <ProfileHeader id={user._id} />
        <Setting />
      </>
    );
  }

  return (
    <Flex direction="column" p={16}>
      <Navbar title="" />
      {getContent()}
    </Flex>
  );
}

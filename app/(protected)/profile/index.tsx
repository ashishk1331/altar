import Navbar from "@/components/ui/Navbar";
import Flex from "@/components/ui/Flex";
import ProfileHeader from "@/components/profile/ProfileHeader";
import Setting from "@/components/profile/Setting";
import { useSession } from "@/wrapper/SessionWrapper";
import { Paragraph } from "@/components/ui/Text";

export default function Index() {
  const { isLoading, session } = useSession();

  function getContent() {
    if (isLoading) {
      return (
        <Flex w="100%">
          <Paragraph>Loading Session.</Paragraph>
        </Flex>
      );
    }

    if (!session) {
      return (
        <Flex w="100%">
          <Paragraph>No active session found.</Paragraph>
        </Flex>
      );
    }

    return (
      <>
        <ProfileHeader id={session.user.id} />
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

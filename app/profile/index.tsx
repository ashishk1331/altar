import Navbar from "@/components/ui/Navbar";
import Flex from "@/components/ui/Flex";
import ProfileHeader from "@/components/profile/ProfileHeader";
import Setting from "@/components/profile/Setting";

export default function Index() {
  return (
    <Flex direction="column" p={16}>
      <>
        <Navbar title="" />
        <ProfileHeader />
        <Setting />
      </>
    </Flex>
  );
}

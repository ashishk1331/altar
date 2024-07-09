import Navbar from "@/components/ui/Navbar";
import Flex from "@/components/ui/Flex";
import ProfileHeader from "@/components/profile/ProfileHeader";
import Setting from "@/components/profile/Setting";
import { useSession } from "@/wrapper/SessionWrapper";
import React from "react";

export default function Index() {
  const { isLoading, session } = useSession();

  return (
    !isLoading &&
    session && (
      <Flex direction="column" p={16}>
        <Navbar title="" />
        <ProfileHeader id={session.user.id} />
        <Setting />
      </Flex>
    )
  );
}

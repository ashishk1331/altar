import Container from "@/components/ui/Container";
import { LargeTitle } from "@/components/ui/Text";
import Flex from "@/components/ui/Flex";
import Login from "@/components/logIn/Login";
import SignUp from "@/components/logIn/SignUp";
import React from "react";

export default function Page() {
  const [loginPage, setLoginPage] = React.useState(true);

  return (
    <Container>
      <Flex direction="column" gap={36}>
        <LargeTitle>altar</LargeTitle>
        {loginPage ? (
          <Login setLoginPage={setLoginPage} />
        ) : (
          <SignUp setLoginPage={setLoginPage} />
        )}
      </Flex>
    </Container>
  );
}

// Library
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

// Components
import Flex from "../ui/Flex";
import InputBox from "../ui/InputBox";
import Button from "../ui/Button";

// Constants
import { Colors } from "@/constants/Colors";

type SignUpProps = {
  setLoginPage: (newValue: boolean) => void;
};

export default function SignUp({ setLoginPage }: SignUpProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  function handleSubmit() {
    // implement

    router.replace("/home");
  }

  return (
    <Flex direction="column" w={264} gap={24} items="center">
      <InputBox value={email} setValue={setEmail} placeholder="Email" />
      <InputBox
        value={password}
        setValue={setPassword}
        placeholder="Password"
      />
      <InputBox
        value={confirmPassword}
        setValue={setConfirmPassword}
        placeholder="Confirm Password"
      />
      <Button fill onPress={handleSubmit}>
        Sign Up
      </Button>
      <TouchableOpacity onPress={() => setLoginPage(true)}>
        <Text style={styles.underline}>or Log In here</Text>
      </TouchableOpacity>
    </Flex>
  );
}

const styles = StyleSheet.create({
  underline: {
    textDecorationLine: "underline",
    color: Colors.light.active,
    fontSize: 13,
    lineHeight: 16,
  },
});

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

type LoginProps = {
  setLoginPage: (newValue: boolean) => void;
};

export default function Login({ setLoginPage }: LoginProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  function handleSubmit() {
    // implement logic

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
      <Button fill onPress={handleSubmit}>
        Log In
      </Button>
      <TouchableOpacity onPress={() => setLoginPage(false)}>
        <Text style={styles.underline}>or Sign Up here</Text>
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

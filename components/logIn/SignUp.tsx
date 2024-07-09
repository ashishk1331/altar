// Library
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";

// Components
import Flex from "../ui/Flex";
import InputBox from "../ui/InputBox";
import Button from "../ui/Button";
import ErrorBox from "../ui/ErrorBox";

// Constants
import { Colors } from "@/constants/Colors";
import { isValidEmail } from "@/util/validation";
import { createUser } from "@/util/auth";

type SignUpProps = {
  setLoginPage: (newValue: boolean) => void;
};

export default function SignUp({ setLoginPage }: SignUpProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  async function handleSubmit() {
    setIsLoading(true);
    setErrorMessage(null);
    const { ok, message } = isValidEmail(email);
    if (!ok) {
      if (message) {
        setErrorMessage(message);
      }
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match.");
      setIsLoading(false);
      return;
    }

    const { ok: isValidUser, ...rest } = await createUser(email, password);

    if (!isValidUser) {
      if (rest.message) {
        setErrorMessage(rest.message);
      }
      setIsLoading(false);
      return;
    }

    router.replace("/home");
  }

  return (
    <Flex direction="column" w={264} gap={24} items="center">
      {errorMessage && <ErrorBox message={errorMessage} />}
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
        {isLoading ? <ActivityIndicator /> : "Sign Up"}
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

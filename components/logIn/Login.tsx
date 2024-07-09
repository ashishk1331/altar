// Library
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";

// Components
import Flex from "../ui/Flex";
import InputBox from "../ui/InputBox";
import Button from "../ui/Button";

// Constants
import { Colors } from "@/constants/Colors";
import { isValidEmail } from "@/util/validation";
import { loginUser } from "@/util/auth";
import ErrorBox from "../ui/ErrorBox";

type LoginProps = {
  setLoginPage: (newValue: boolean) => void;
};

export default function Login({ setLoginPage }: LoginProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
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

    const { ok: isValidUser, ...rest } = await loginUser(email, password);

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
      <Button fill onPress={handleSubmit}>
        {isLoading ? <ActivityIndicator /> : "Log In"}
      </Button>
      <TouchableOpacity
        onPress={() => setLoginPage(false)}
        disabled={isLoading}
      >
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

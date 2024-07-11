// import ImageSelection from "@/components/ImageSelection";
import Button from "@/components/ui/Button";
import ErrorBox, { SuccessBox } from "@/components/ui/ErrorBox";
import Flex from "@/components/ui/Flex";
import InputBox from "@/components/ui/InputBox";
import Navbar from "@/components/ui/Navbar";
import useFetchUser from "@/hooks/useFetchUser";
import useUpdateUser, { DataType } from "@/hooks/useUpdateUser";
import { resetPassword } from "@/util/auth";
import { useSession } from "@/wrapper/SessionWrapper";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function EditProfile() {
  const { session } = useSession();
  const userId = session?.user.id || "";
  const { data, isPending } = useFetchUser(userId);
  const {
    mutate: userMutation,
    isPending: isMutationPending,
    isSuccess: isMutationSuccess,
    isError: isMutationError,
    error: mutationError,
  } = useUpdateUser(userId);

  const placeholder = {
    name: "your name",
    bio: "write about yourself",
    password: "Password",
    confirmPassword: "Confirm Password",
  };

  const [name, setName] = React.useState(data?.data?.name || "");
  const [bio, setBio] = React.useState(data?.data?.bio || "");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  // const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [passwordChanged, setPasswordChanged] = React.useState<string | null>(
    null,
  );

  if (isPending) {
    return null;
  }

  async function handleSubmit() {
    setErrorMessage(null);
    setPasswordChanged(null);
    const payload: DataType = {
      userId,
    };

    if (name !== data?.data?.name) {
      payload.name = name;
    }

    if (bio !== data?.data?.bio) {
      payload.bio = bio;
    }

    if (Object.keys(payload).length > 1) {
      userMutation(payload);
    }

    if (password && confirmPassword) {
      if (password === confirmPassword) {
        let { ok } = await resetPassword(password);
        if (ok) {
          setPasswordChanged("password changed.");
        } else {
          setErrorMessage("unable to change password");
        }
      } else {
        setErrorMessage("passwords don't match");
      }
    }
  }

  return (
    <View style={[styles.container, styles.outer]}>
      <Navbar
        title="Edit Profile"
        right={
          <Button onPress={handleSubmit}>
            {isMutationPending ? <ActivityIndicator /> : "Save"}
          </Button>
        }
      />
      <Flex direction="column" p={10} gap={24}>
        {(isMutationSuccess || passwordChanged) && (
          <SuccessBox
            message={
              isMutationSuccess ? "profile saved." : passwordChanged ?? ""
            }
          />
        )}
        {(isMutationError || errorMessage) && (
          <ErrorBox
            message={
              isMutationError ? mutationError.message : errorMessage ?? ""
            }
          />
        )}
        {/*<ImageSelection
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />*/}
        <View style={styles.outer} />
        <InputBox
          value={name}
          setValue={setName}
          placeholder={placeholder.name}
        />
        <InputBox value={bio} setValue={setBio} placeholder={placeholder.bio} />
        <InputBox
          value={password}
          setValue={setPassword}
          placeholder={placeholder.password}
        />
        <InputBox
          value={confirmPassword}
          setValue={setConfirmPassword}
          placeholder={placeholder.confirmPassword}
        />
      </Flex>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
  },
  outer: {
    padding: 10,
  },
  list: {
    paddingVertical: 10,
  },
});

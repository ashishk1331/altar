// Library
import React from "react";
import { StyleSheet, ScrollView, View, ActivityIndicator } from "react-native";
import { FloppyDisk } from "iconoir-react-native";

// Components
import Navbar from "@/components/ui/Navbar";
import Separator from "@/components/ui/Separator";
import Flex from "@/components/ui/Flex";
import { InputBoxClean } from "@/components/ui/InputBox";
import Button, { IconButton } from "@/components/ui/Button";

// Constants
import { Colors } from "@/constants/Colors";
import { useSession } from "@/wrapper/SessionWrapper";
import useAddPoem, { PseudoPostType } from "@/hooks/useAddPoem";
import ErrorBox from "@/components/ui/ErrorBox";
import { jumpToHome } from "@/util/jumpTo";

export default function AddPoem() {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const { mutate } = useAddPoem();

  const { session } = useSession();
  const userId = session?.user.id ?? "";

  function handleSubmit() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      let payload = {} as PseudoPostType;

      if (title) {
        payload["title"] = title;
      } else {
        throw new Error("Title not defined.");
      }

      if (content) {
        payload["content"] = content;
      } else {
        throw new Error("Write the inner text first.");
      }

      if (userId) {
        payload["author_id"] = userId;
      } else {
        throw new Error("There is a problem while adding the poem.");
      }

      mutate(payload);
      jumpToHome();
    } catch (err: any) {
      console.log(err);
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  function SaveAndPublish() {
    return (
      <Flex gap={24}>
        {/*<View>
          <IconButton>
            <FloppyDisk color={Colors.light.text} width={24} height={24} />
          </IconButton>
          <View style={styles.update} />
        </View>*/}
        <Button onPress={handleSubmit}>
          {isLoading ? <ActivityIndicator /> : "Publish"}
        </Button>
      </Flex>
    );
  }

  return (
    <ScrollView style={[styles.container, styles.outer]}>
      <Navbar title="Add Poem" right={<SaveAndPublish />} />
      {errorMessage && (
        <View style={styles.outer}>
          <ErrorBox message={errorMessage} />
        </View>
      )}
      <Flex direction="column" p={10}>
        <InputBoxClean
          placeholder="write title here"
          value={title}
          setValue={setTitle}
        />
        <Separator />
        <InputBoxClean
          placeholder="and the poem goes here"
          value={content}
          setValue={setContent}
          multiline
        />
      </Flex>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    marginBottom: 24,
  },
  outer: {
    padding: 10,
  },
  list: {
    paddingVertical: 10,
  },
  update: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: Colors.light.wrong,
  },
});

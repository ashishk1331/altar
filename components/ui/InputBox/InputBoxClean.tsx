import React, { useState } from "react";
import { StyleSheet, TextInput } from "react-native";

type InputBoxCleanProps = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  multiline?: boolean;
};

export function InputBoxClean({
  value,
  setValue,
  placeholder,
  multiline = false,
}: InputBoxCleanProps) {
  const [height, setHeight] = useState(500);

  return (
    <TextInput
      value={value}
      onChangeText={setValue}
      multiline={multiline}
      style={[styles.inputBox, { height }]}
      placeholder={placeholder}
      textAlignVertical="top"
      onContentSizeChange={(event) => {
        setHeight(event.nativeEvent.contentSize.height);
      }}
    />
  );
}

const styles = StyleSheet.create({
  inputBox: {
    fontSize: 17,
    lineHeight: 24,
    padding: 4,
    paddingHorizontal: 8,
    width: "100%",
  },
});

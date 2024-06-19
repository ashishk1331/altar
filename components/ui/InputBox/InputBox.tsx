import { Colors } from "@/constants/Colors";
import React from "react";
import { TextInput, StyleSheet } from "react-native";

type InputBoxProps = {
  value: string;
  setValue: (newValue: string) => void;
  placeholder: string;
};

export default function InputBox({
  value,
  setValue,
  placeholder,
}: InputBoxProps) {
  return (
    <TextInput
      style={styles.inputBox}
      value={value}
      onChangeText={setValue}
      placeholder={placeholder}
    />
  );
}

const styles = StyleSheet.create({
  inputBox: {
    width: "100%",
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.grayed + "40",
    fontSize: 17,
  },
});

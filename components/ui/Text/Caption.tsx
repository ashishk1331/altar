import { Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import React from "react";

type CaptionProps = {
  children: React.ReactNode;
  bold?: boolean;
  italic?: boolean;
  color?: string;
};

export function Caption({ bold, italic, children, color }: CaptionProps) {
  return (
    <Text
      style={[
        styles.caption,
        bold && styles.bold,
        italic && styles.italic,
        color
          ? {
              color,
            }
          : null,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  caption: {
    color: Colors.light.text,
    fontSize: 12,
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
});

import { Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import React from "react";

type FootnoteProps = {
  children: React.ReactNode;
  bold?: boolean;
  italic?: boolean;
  color?: string;
};

export function Footnote({ bold, italic, children, color }: FootnoteProps) {
  return (
    <Text
      style={[
        styles.footnote,
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
  footnote: {
    color: Colors.light.text,
    fontSize: 13,
    lineHeight: 16,
  },
  bold: {
    fontWeight: "semibold",
  },
  italic: {
    fontStyle: "italic",
  },
});

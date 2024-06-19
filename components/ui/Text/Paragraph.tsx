import { Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import React from "react";

type ParagraphProps = {
  children: React.ReactNode;
  bold?: boolean;
  italic?: boolean;
  color?: string;
};

export function Paragraph({ bold, italic, children, color }: ParagraphProps) {
  return (
    <Text
      style={[
        styles.paragraph,
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
  paragraph: {
    color: Colors.light.text,
    fontSize: 17,
    lineHeight: 24,
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
});

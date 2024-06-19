import { Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import React from "react";

type HeadlineProps = {
  children: React.ReactNode;
  italic?: boolean;
  color?: string;
};

export function Headline({ italic, children, color }: HeadlineProps) {
  return (
    <Text
      style={[
        styles.headline,
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
  headline: {
    color: Colors.light.text,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
});

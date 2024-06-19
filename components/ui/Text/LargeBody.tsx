import { Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import React from "react";

type LargeBodyProps = {
  children: React.ReactNode;
  bold?: boolean;
  color?: string;
};

export function LargeBody({ bold, children, color }: LargeBodyProps) {
  return (
    <Text
      style={[
        styles.largeBody,
        bold && styles.bold,
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
  largeBody: {
    color: Colors.light.text,
    fontSize: 34,
    lineHeight: 40,
  },
  bold: {
    fontWeight: "semibold",
  },
});

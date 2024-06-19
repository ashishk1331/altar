import { Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import React from "react";

type LargeTitleProps = {
  children: React.ReactNode;
  bold?: boolean;
  color?: string;
};

export function LargeTitle({ bold, children, color }: LargeTitleProps) {
  return (
    <Text
      style={[
        styles.largeTitle,
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
  largeTitle: {
    color: Colors.light.text,
    fontSize: 34,
    lineHeight: 40,
  },
  bold: {
    fontWeight: "semibold",
  },
});

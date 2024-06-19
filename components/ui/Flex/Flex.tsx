import React from "react";
import { StyleSheet, View } from "react-native";

type FlexProps = {
  direction?: "row" | "row-reverse" | "column" | "column-reverse";
  gap?: number;
  p?: number;
  w?: number | "100%";
  items?: "center";
  justify?:
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly"
    | "flex-start";
  children: React.ReactNode;
};

export default function Flex({
  children,
  direction,
  gap,
  p,
  w,
  justify,
  items,
}: FlexProps) {
  return (
    <View
      style={[
        styles.flex,
        {
          flexDirection: direction ?? "row",
          gap: gap ?? 2,
          width: w ?? "auto",
          alignItems: items ?? "flex-start",
          justifyContent: justify ?? "center",
          padding: p ?? 0,
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    display: "flex",
  },
});

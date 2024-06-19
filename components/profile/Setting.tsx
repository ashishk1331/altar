// Libraru
import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { router } from "expo-router";

// Components
import Flex from "../ui/Flex";
import { Paragraph } from "../ui/Text";
import Separator from "../ui/Separator";

// Constants
import { Colors } from "@/constants/Colors";

const items = [
  {
    label: "Edit Profile",
    href: "/profile/edit-profile",
  },
  {
    label: "Posts",
    href: "/profile/posts",
  },
  {
    label: "Drafts",
    href: "/profile/drafts",
  },
  {
    label: "Bookmarks",
    href: "/profile/bookmarks",
  },
  {
    label: "Log Out",
    href: "/logout",
  },
];

export default function Setting() {
  function goTo(href: string) {
    router.push(href);
  }

  return (
    <View style={styles.container}>
      <Flex direction="column" w="100%">
        {items.map(({ label, href }) => (
          <React.Fragment key={href}>
            <TouchableOpacity style={styles.button} onPress={() => goTo(href)}>
              {label === "Log Out" ? (
                <Text style={styles.logout}>{label}</Text>
              ) : (
                <Paragraph>{label}</Paragraph>
              )}
            </TouchableOpacity>
            <Separator />
          </React.Fragment>
        ))}
      </Flex>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  button: {
    padding: 6,
  },
  logout: {
    color: Colors.light.wrong,
    fontSize: 17,
    lineHeight: 24,
  },
});

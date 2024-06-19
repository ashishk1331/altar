// Library
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

// Components
import Navbar from "@/components/home/Navbar";
import FeedTabs from "@/components/home/FeedTabs";
import Post from "@/components/post";
import Separator from "@/components/ui/Separator";

export default function Home() {
  const list: string[] = ["Recent", "Following"];
  const [activeTab, setActiveTab] = React.useState(list[0]);

  const data = Array(12)
    .fill("")
    .map((_, id) => ({ id: String(id) }));

  return (
    <View style={[styles.container, styles.outer]}>
      <Navbar />
      <FeedTabs list={list} activeTab={activeTab} setActiveTab={setActiveTab} />
      <FlatList
        data={data}
        renderItem={(data) => (
          <>
            <Post id={data.item.id} />
            <Separator />
          </>
        )}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
  },
  outer: {
    padding: 10,
  },
  list: {
    paddingVertical: 10,
  },
});

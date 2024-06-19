import Navbar from "@/components/ui/Navbar";
import Post from "@/components/post";
import { FlatList, StyleSheet, View } from "react-native";
import Separator from "@/components/ui/Separator";

export default function Bookmarks() {
  const data = Array(12)
    .fill("")
    .map((_, id) => ({ id: String(id) }));

  return (
    <View style={[styles.container, styles.outer]}>
      <Navbar title="Bookmarks" />
      <FlatList
        data={data}
        renderItem={({ item: { id } }) => (
          <>
            <Post id={id} />
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

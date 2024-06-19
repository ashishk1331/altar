import Navbar from "@/components/ui/Navbar";
import Post from "@/components/post";
import { FlatList, StyleSheet, View } from "react-native";
import Separator from "@/components/ui/Separator";

export default function Drafts() {
  const data = Array(12)
    .fill("")
    .map((_, id) => ({ id: String(id) }));

  return (
    <View style={[styles.container, styles.outer]}>
      <Navbar title="Drafts" />
      <FlatList
        data={data}
        renderItem={({ item: { id } }) => (
          <>
            <Post id={id} isEditable />
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

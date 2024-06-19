import { Colors } from "@/constants/Colors";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Flex from "../ui/Flex";

type TabsProps = {
  list: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function Tabs({ list, activeTab, setActiveTab }: TabsProps) {
  return (
    <View style={styles.container}>
      <Flex gap={0} justify="center" items="center" w="100%">
        {list.map((title, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setActiveTab(title)}
            style={[styles.tab, title === activeTab && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabTitle,
                title === activeTab && styles.activeText,
              ]}
            >
              {title}
            </Text>
          </TouchableOpacity>
        ))}
      </Flex>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: Colors.light.lightGray,
    padding: 6,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: "center",
  },
  tabTitle: {
    fontSize: 12,
    lineHeight: 16,
    color: Colors.light.grayed,
  },
  activeTab: {
    backgroundColor: Colors.light.background,
  },
  activeText: {
    color: Colors.light.text,
    fontWeight: "bold",
  },
});

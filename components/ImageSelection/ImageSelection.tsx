// Library
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { EditPencil } from "iconoir-react-native";
import * as ImagePicker from "expo-image-picker";

// Components
import Flex from "../ui/Flex";
import ImageContainer from "../ui/ImageContainer";

// Constants
import { Colors } from "@/constants/Colors";

type ImageSelectionProps = {
  selectedImage: string | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function ImageSelection({
  selectedImage,
  setSelectedImage,
}: ImageSelectionProps) {
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert("You did not select any image.");
    }
  };

  return (
    <Flex justify="space-around" w="100%" p={16}>
      <TouchableOpacity style={styles.container} onPress={pickImageAsync}>
        <ImageContainer src={selectedImage} width={128} />
        <View style={styles.cover}>
          <EditPencil color="#fff" width={36} height={36} />
        </View>
      </TouchableOpacity>
    </Flex>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: (30 / 120) * 128 + 6,
    overflow: "hidden",
  },
  cover: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 128,
    height: 128,
    backgroundColor: Colors.light.text + "80",

    alignItems: "center",
    justifyContent: "space-around",
  },
});

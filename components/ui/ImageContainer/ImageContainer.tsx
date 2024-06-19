import { Image } from "react-native";

type ImageContainerProps = {
  src?: string;
  width: number;
};

export default function ImageContainer({ src, width }: ImageContainerProps) {
  let source;
  if (src) {
    source = { uri: src };
  } else {
    // fallback to default avatar
    source = require("../../../assets/images/avatar.png");
  }

  return (
    <Image
      source={source}
      style={{
        width: width,
        height: width,
        borderRadius: (36 / 120) * width,
        aspectRatio: 1 / 1,
      }}
    />
  );
}

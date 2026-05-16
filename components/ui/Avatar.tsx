import { Image, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/Colors';

type AvatarProps = {
  width: number;
  name: string;
  src?: string;
};

export default function Avatar({ width, name, src }: AvatarProps) {
  const squareSize = {
    width,
    height: width,
    borderRadius: (36 / 120) * width,
  };
  const fontStyles = {
    fontSize: width / 1.8,
  };

  if (src) {
    return <Image source={{ uri: src }} style={[styles.avatar, squareSize]} />;
  }

  return (
    <View style={[styles.avatar, squareSize]}>
      <Text style={[styles.avatarText, fontStyles]}>
        {name && name.length > 1 ? name.charAt(0).toUpperCase() : 'M'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.light.active,
  },
  avatarText: {
    color: Colors.light.background,
  },
});

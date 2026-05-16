import { View, StyleSheet, TextInput } from 'react-native';
import { ArrowLeft, Search } from 'iconoir-react-native';
import { router } from 'expo-router';

import Flex from '../ui/Flex';
import { IconButton } from '../ui/Button';

type NavbarProps = {
  value: string;
  onChange: (next: string) => void;
};

export default function Navbar({ value, onChange }: NavbarProps) {
  function goBack() {
    router.back();
  }

  return (
    <View style={styles.navbar}>
      <Flex w="100%" justify="space-between" items="center">
        <IconButton onPress={goBack}>
          <ArrowLeft color="black" height={24} width={24} />
        </IconButton>

        <TextInput
          style={styles.textInput}
          placeholder="search something"
          value={value}
          onChangeText={onChange}
          autoFocus
        />

        <IconButton onPress={() => {}}>
          <Search color="black" height={24} width={24} />
        </IconButton>
      </Flex>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    paddingHorizontal: 6,
    paddingVertical: 16,
  },
  textInput: {
    flex: 1,
    padding: 6,
    fontSize: 17,
    lineHeight: 24,
  },
});

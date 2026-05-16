import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import Flex from '@/components/ui/Flex';
import Navbar from '@/components/ui/Navbar';
import { Paragraph } from '@/components/ui/Text';

export default function UserList() {
  const { isFollowerList } = useLocalSearchParams();

  return (
    <View style={[styles.container, styles.outer]}>
      <Navbar title={isFollowerList ? 'Followers' : 'Following'} />
      <Flex p={24}>
        <Paragraph>List view coming soon.</Paragraph>
      </Flex>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', flexDirection: 'column' },
  outer: { padding: 10 },
});

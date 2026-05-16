import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell, Search } from 'iconoir-react-native';
import { type Href, router } from 'expo-router';
import { useQuery } from 'convex/react';

import Flex from '../ui/Flex';
import { Caption, Headline } from '../ui/Text';
import { IconButton } from '../ui/Button';
import Avatar from '../ui/Avatar';

import { Colors } from '@/constants/Colors';
import { api } from '@/convex/_generated/api';
import { useSession } from '@/wrapper/SessionWrapper';

export default function Navbar() {
  const { user } = useSession();
  const unreadCount = useQuery(api.notifications.getUnreadCount, user ? {} : 'skip');

  function goToProfile() {
    router.push('/profile');
  }
  function goToSearch() {
    router.push('/search');
  }
  function goToNotifications() {
    router.push('/notifications' as Href);
  }

  return (
    <View style={styles.navbar}>
      <Flex items="center" justify="space-between" w="100%">
        <TouchableOpacity onPress={goToProfile}>
          <Avatar width={42} name={user?.name || ''} src={user?.picture || undefined} />
        </TouchableOpacity>
        <Headline>Altar</Headline>
        <Flex items="center" gap={8}>
          <View style={styles.bellWrap}>
            <IconButton onPress={goToNotifications}>
              <Bell color={Colors.light.text} height={24} width={24} />
            </IconButton>
            {!!unreadCount && unreadCount > 0 && (
              <View style={styles.badge}>
                <Caption color={Colors.light.background}>
                  {unreadCount > 9 ? '9+' : String(unreadCount)}
                </Caption>
              </View>
            )}
          </View>
          <IconButton onPress={goToSearch}>
            <Search color={Colors.light.text} height={24} width={24} />
          </IconButton>
        </Flex>
      </Flex>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    padding: 12,
    paddingVertical: 16,
  },
  bellWrap: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 0,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: Colors.light.wrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

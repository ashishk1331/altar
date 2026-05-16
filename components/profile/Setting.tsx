import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { type Href, router } from 'expo-router';

import Flex from '../ui/Flex';
import { Paragraph } from '../ui/Text';
import Separator from '../ui/Separator';

import { Colors } from '@/constants/Colors';
import { useSession } from '@/wrapper/SessionWrapper';

export default function Setting() {
  const { user } = useSession();
  const items = [
    { label: 'Visit Profile', href: `/user/${user?._id ?? ''}` },
    { label: 'Edit Profile', href: '/profile/edit-profile' },
    { label: 'Posts', href: '/profile/posts' },
    { label: 'Drafts', href: '/profile/drafts' },
    { label: 'Bookmarks', href: '/profile/bookmarks' },
    { label: 'Notifications', href: '/notifications' },
    { label: 'Log Out', href: '/logout' },
  ];

  function goTo(href: string) {
    router.push(href as Href);
  }

  return (
    <View style={styles.container}>
      <Flex direction="column" w="100%">
        {items.map(({ label, href }) => (
          <React.Fragment key={href}>
            <TouchableOpacity style={styles.button} onPress={() => goTo(href)}>
              {label === 'Log Out' ? (
                <Text style={styles.logout}>{label}</Text>
              ) : (
                <Paragraph>{label}</Paragraph>
              )}
            </TouchableOpacity>
            <Separator />
          </React.Fragment>
        ))}
      </Flex>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 24 },
  button: { padding: 6 },
  logout: {
    color: Colors.light.wrong,
    fontSize: 17,
    lineHeight: 24,
  },
});

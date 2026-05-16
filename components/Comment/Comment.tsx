import { MoreHoriz } from 'iconoir-react-native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { formatDistanceToNow } from 'date-fns';

import Flex from '../ui/Flex';
import { Footnote, Paragraph } from '../ui/Text';
import { IconButton } from '../ui/Button';
import Avatar from '../ui/Avatar';

import { Colors } from '@/constants/Colors';
import { Icon } from '@/constants/Icon';
import type { CommentType } from '@/hooks/useFetchCommentsForPost';
import { jumpToProfile } from '@/util/jumpTo';

type CommentProps = {
  comment: CommentType;
  isEditable?: boolean;
};

export default function Comment({ comment, isEditable }: CommentProps) {
  const author = comment.author;
  const name = author?.name || author?.firstName || 'anonymous';
  const picture = author?.picture || '';

  return (
    <View style={styles.container}>
      <Flex direction="column" gap={10} p={10} w="100%">
        <TouchableOpacity onPress={() => jumpToProfile(comment.authorId)}>
          <Flex gap={10} items="center" justify="space-between" w="100%">
            <Flex gap={10} items="center">
              <Avatar width={28} name={name} src={picture} />
              <Footnote>{name}</Footnote>
              <Footnote color={Colors.light.grayed}>
                {formatDistanceToNow(new Date(comment._creationTime))}
              </Footnote>
            </Flex>
            {isEditable && (
              <IconButton>
                <MoreHoriz {...Icon} />
              </IconButton>
            )}
          </Flex>
        </TouchableOpacity>
        <View style={styles.content}>
          <Paragraph>{comment.body}</Paragraph>
        </View>
      </Flex>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  content: {
    paddingLeft: 28 + 10,
  },
});

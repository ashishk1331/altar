import React from 'react';
import { SendDiagonal } from 'iconoir-react-native';
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import Avatar from '@/components/ui/Avatar';
import Flex from '@/components/ui/Flex';

import { Colors } from '@/constants/Colors';
import { Icon } from '@/constants/Icon';
import type { Id } from '@/convex/_generated/dataModel';
import { useSession } from '@/wrapper/SessionWrapper';
import useAddComment from '@/hooks/useAddComment';

type CommentBoxProps = {
  poemId: Id<'poems'>;
  poemAuthorId: Id<'users'> | null;
};

export default function CommentBox({ poemId, poemAuthorId }: CommentBoxProps) {
  const { user } = useSession();
  const writeComment = useAddComment();

  const [commentText, setCommentText] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleSubmit() {
    if (!user || !poemAuthorId) return;
    const body = commentText.trim();
    if (!body) return;
    try {
      setIsLoading(true);
      await writeComment({ poemId, body });
      setCommentText('');
      Keyboard.dismiss();
    } finally {
      setIsLoading(false);
    }
  }

  const isDisabled = isLoading || !commentText.trim();

  return (
    <View style={styles.container}>
      <Flex items="flex-end" gap={8} p={12}>
        <Avatar width={36} name={user?.name || ''} src={user?.picture || undefined} />
        <View style={styles.inputWrap}>
          <TextInput
            value={commentText}
            onChangeText={setCommentText}
            placeholder="comment here..."
            placeholderTextColor={Colors.light.grayed}
            multiline
            style={styles.input}
            textAlignVertical="top"
          />
        </View>
        <TouchableOpacity
          style={[styles.sendButton, isDisabled && styles.sendButtonDisabled]}
          onPress={handleSubmit}
          disabled={isDisabled}
        >
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <SendDiagonal {...Icon} color={Colors.light.text} />
          )}
        </TouchableOpacity>
      </Flex>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  inputWrap: {
    flex: 1,
    backgroundColor: Colors.light.lightGray,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  input: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.light.text,
    maxHeight: 120,
    minHeight: 24,
    padding: 0,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
});

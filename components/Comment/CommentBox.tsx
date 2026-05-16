import React from 'react';
import { SendDiagonal } from 'iconoir-react-native';
import { ActivityIndicator, Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native';

import { InputBoxClean } from '../ui/InputBox';
import Flex from '../ui/Flex';

import { Icon } from '@/constants/Icon';
import { Colors } from '@/constants/Colors';
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
      await writeComment({
        poemId,
        body,
        authorId: user._id,
        poemAuthorId,
      });
      setCommentText('');
      Keyboard.dismiss();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.conatiner}>
      <Flex p={16}>
        <InputBoxClean
          value={commentText}
          setValue={setCommentText}
          placeholder="type your comment here"
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? <ActivityIndicator /> : <SendDiagonal {...Icon} />}
        </TouchableOpacity>
      </Flex>
    </View>
  );
}

const styles = StyleSheet.create({
  conatiner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.lightGray,

    shadowColor: Colors.light.grayed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 1,
  },
  sendButton: {
    padding: 10,
  },
});

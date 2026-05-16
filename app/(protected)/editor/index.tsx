import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import Navbar from '@/components/ui/Navbar';
import Separator from '@/components/ui/Separator';
import Flex from '@/components/ui/Flex';
import { InputBoxClean } from '@/components/ui/InputBox';
import Button from '@/components/ui/Button';
import ErrorBox from '@/components/ui/ErrorBox';

import { useSession } from '@/wrapper/SessionWrapper';
import useAddPoem from '@/hooks/useAddPoem';
import { jumpToHome } from '@/util/jumpTo';

export default function AddPoem() {
  const [title, setTitle] = React.useState('');
  const [body, setBody] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const writePoem = useAddPoem();
  const { user } = useSession();

  async function handleSubmit() {
    setErrorMessage('');
    if (!title) return setErrorMessage('Title not defined.');
    if (!body) return setErrorMessage('Write the inner text first.');
    if (!user) return setErrorMessage('Not signed in.');

    try {
      setIsLoading(true);
      await writePoem({
        title,
        body,
        isDraft: false,
      });
      jumpToHome();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to publish.');
    } finally {
      setIsLoading(false);
    }
  }

  function SaveAndPublish() {
    return (
      <Flex gap={24}>
        <Button onPress={handleSubmit}>{isLoading ? <ActivityIndicator /> : 'Publish'}</Button>
      </Flex>
    );
  }

  return (
    <ScrollView style={[styles.container, styles.outer]}>
      <Navbar title="Add Poem" right={<SaveAndPublish />} />
      {errorMessage ? (
        <View style={styles.outer}>
          <ErrorBox message={errorMessage} />
        </View>
      ) : null}
      <Flex direction="column" p={10}>
        <InputBoxClean placeholder="write title here" value={title} setValue={setTitle} />
        <Separator />
        <InputBoxClean
          placeholder="and the poem goes here"
          value={body}
          setValue={setBody}
          multiline
        />
      </Flex>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    marginBottom: 24,
  },
  outer: {
    padding: 10,
  },
});

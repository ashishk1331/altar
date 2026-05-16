import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import Button from '@/components/ui/Button';
import ErrorBox, { SuccessBox } from '@/components/ui/ErrorBox';
import Flex from '@/components/ui/Flex';
import InputBox from '@/components/ui/InputBox';
import Navbar from '@/components/ui/Navbar';

import type { Id } from '@/convex/_generated/dataModel';
import useFetchUser from '@/hooks/useFetchUser';
import useUpdateUser from '@/hooks/useUpdateUser';
import { useUserStore } from '@/store/userStore';
import { useSession } from '@/wrapper/SessionWrapper';

export default function EditProfile() {
  const { user } = useSession();
  if (!user) return null;
  return <EditProfileForm userId={user._id} />;
}

function EditProfileForm({ userId }: { userId: Id<'users'> }) {
  const { user: profile, isPending } = useFetchUser(userId, userId);
  const updateUser = useUpdateUser();
  const patchLocalUser = useUserStore((s) => s.patchUser);

  const [firstName, setFirstName] = React.useState(profile?.firstName ?? '');
  const [lastName, setLastName] = React.useState(profile?.lastName ?? '');
  const [bio, setBio] = React.useState(profile?.bio ?? '');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setBio(profile.bio);
    }
  }, [profile]);

  if (isPending || !profile) {
    return null;
  }

  async function handleSubmit() {
    setErrorMessage(null);
    setIsSuccess(false);
    try {
      setIsSaving(true);
      await updateUser({ firstName, lastName, bio });
      patchLocalUser({ firstName, lastName, bio });
      setIsSuccess(true);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to save.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <View style={[styles.container, styles.outer]}>
      <Navbar
        title="Edit Profile"
        right={<Button onPress={handleSubmit}>{isSaving ? <ActivityIndicator /> : 'Save'}</Button>}
      />
      <Flex direction="column" p={10} gap={24}>
        {isSuccess && <SuccessBox message="profile saved." />}
        {errorMessage && <ErrorBox message={errorMessage} />}
        <View style={styles.outer} />
        <InputBox value={firstName} setValue={setFirstName} placeholder="first name" />
        <InputBox value={lastName} setValue={setLastName} placeholder="last name" />
        <InputBox value={bio} setValue={setBio} placeholder="write about yourself" />
      </Flex>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', flexDirection: 'column' },
  outer: { padding: 10 },
});

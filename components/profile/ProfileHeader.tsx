// Library
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

// Components
import Flex from "../ui/Flex";
import { Caption, Paragraph } from "../ui/Text";
import useFetchUser from "@/hooks/useFetchUser";
import { emailToName } from "@/util/handy";
import Avatar from "../ui/Avatar";

type ProfileHeaderProps = {
  isAtProfilePage?: boolean;
  id?: string;
};

export default function ProfileHeader({
  isAtProfilePage = false,
  id,
}: ProfileHeaderProps) {
  const { isPending, data } = useFetchUser(id ?? "");
  function jumpToFollowers(isFollowerList: boolean) {
    router.push(`/profile/user-list?isFollowerList=${isFollowerList}`);
  }

  if (isPending && !data) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Flex gap={16}>
        <Avatar width={120} name={emailToName(data?.data?.name || "Maya")} />
        <Flex direction="column" justify="space-between">
          <Paragraph>{emailToName(data?.data?.name || "Maya")}</Paragraph>
          {data?.data && <Caption>{data.data.bio}</Caption>}

          <View style={styles.bar}>
            <Flex justify="space-between" gap={24}>
              {isAtProfilePage ? (
                <TouchableOpacity onPress={() => jumpToFollowers(true)}>
                  <Caption>{data?.data?.followers} followers</Caption>
                </TouchableOpacity>
              ) : (
                <Caption>{data?.data?.followers} followers</Caption>
              )}

              {isAtProfilePage ? (
                <TouchableOpacity onPress={() => jumpToFollowers(false)}>
                  <Caption>{data?.data?.following} following</Caption>
                </TouchableOpacity>
              ) : (
                <Caption>{data?.data?.following} following</Caption>
              )}
            </Flex>
          </View>
        </Flex>
      </Flex>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  bar: {
    marginTop: 10,
  },
});

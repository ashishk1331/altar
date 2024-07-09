import { router } from "expo-router";

export function jumpToProfile(id: string) {
  router.push(`/user/${id}`);
}

export function jumpToPost(id: string) {
  router.push(`/poem/${id}`);
}

export function jumpToHome() {
  router.replace("/home");
}

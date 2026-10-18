import type { Post } from "../interfaces/post";

export const privacyConfig: Record<
  Post["privacy"],
  { label: string; icon: string }
> = {
  public: { label: "Public", icon: "fa-solid fa-earth-americas" },
  following: { label: "Followers", icon: "fa-solid fa-users" },
  only_me: { label: "Only me", icon: "fa-solid fa-lock" },
};
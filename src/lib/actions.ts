"use client";
import { api } from "@/trpc/react";

// get user basic info
export default function getUserBasicInfo({ username }: { username: string }) {
  return api.user.getUserBasicData.useQuery({ username });
}

export function getUserIdgivenUsername({ username }: { username: string }) {
  return api.user.getUidByUsername.useQuery({ username });
}

export function getUserProjects({ username }: { username: string }) {
  const uid = getUserIdgivenUsername({ username });
  return api.user.getUserProjects.useQuery({ uid: uid.data ?? "" });
}

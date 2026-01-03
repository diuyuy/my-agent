"use client";

import { useIsCreatingNewConversation } from "@/hooks/use-is-creating-new-conversation";
import { useConversationsQuery } from "@/hooks/useConversationsQuery";
import { MessageCircleMoreIcon } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "../ui/sidebar";
import { Spinner } from "../ui/spinner";
import AppSidebarMenuItem from "./app-sidebar-menu-item";

export default function AppSidebarHistoryMenu() {
  const { data, isPending, isError } = useConversationsQuery();
  const { isCreating } = useIsCreatingNewConversation();

  if (isPending) {
    return (
      <div className="flex justify-center my-4">
        <Spinner className="size-4" />
      </div>
    );
  }

  if (isError) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="text-destructive text-sm px-2 py-1">
            대화 목록을 불러오는 중 오류가 발생했습니다.
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const conversations = data.data?.items ?? [];

  return (
    <SidebarMenu>
      {isCreating && <SidebarMenuSkeleton />}
      {conversations.map(({ id, title, isFavorite }) => (
        <AppSidebarMenuItem
          key={id}
          conversationId={id}
          title={title}
          isFavorite={isFavorite}
        />
      ))}
      <SidebarMenuItem className="group-data-[collapsible=icon]:opacity-0">
        <SidebarMenuButton>
          <MessageCircleMoreIcon />
          모든 채팅 보기
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

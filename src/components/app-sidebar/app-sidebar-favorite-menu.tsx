"use client";

import { useFavoriteConversationsQuery } from "@/hooks/use-favorite-conversations-query";
import { SidebarMenu, SidebarMenuItem } from "../ui/sidebar";
import { Spinner } from "../ui/spinner";
import AppSidebarMenuItem from "./app-sidebar-menu-item";

export default function AppSidebarFavoritesMenu() {
  const { data, isPending, isError } = useFavoriteConversationsQuery();

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
          <p className="text-xs text-destructive p-2 overflow-hidden group-data-[collapsible=icon]:opacity-0 duration-200">
            즐겨찾기를 불러오는데 실패했습니다
          </p>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const favorites = data?.data ?? [];

  return (
    <SidebarMenu>
      {favorites.length > 0 ? (
        favorites.map(({ id, title, isFavorite }) => (
          <AppSidebarMenuItem
            key={id}
            conversationId={id}
            title={title}
            isFavorite={isFavorite}
          />
        ))
      ) : (
        <SidebarMenuItem>
          <p className="text-xs text-muted-foreground p-2 overflow-hidden group-data-[collapsible=icon]:opacity-0 duration-200">
            즐겨찾기 페이지를 추가해보세요
          </p>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}

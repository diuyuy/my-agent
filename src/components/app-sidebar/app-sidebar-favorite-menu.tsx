import { CACHE_TAG } from "@/constants/cache-tag";
import { ROUTER_PATH } from "@/constants/router-path";
import { auth } from "@/lib/auth";
import { findFavorites } from "@/server/features/conversations/conversation.service";
import { cacheTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarMenu, SidebarMenuItem } from "../ui/sidebar";
import AppSidebarMenuItem from "./app-sidebar-menu-item";

export default async function AppSidebarFavoritesMenu() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(ROUTER_PATH.LOGIN);
  }

  const favorites = await (async () => {
    "use cache";
    cacheTag(CACHE_TAG.getFavoriteCacheTag(session.user.id));
    return await findFavorites(session.user.id);
  })();

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

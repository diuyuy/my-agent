import { CACHE_TAG } from "@/constants/cache-tag";
import { ROUTER_PATH } from "@/constants/router-path";
import { auth } from "@/lib/auth";
import { findFavorites } from "@/server/features/conversations/conversation.service";
import { EllipsisIcon } from "lucide-react";
import { cacheTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

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
      {favorites.map((favorite) => (
        <SidebarMenuItem key={favorite.id}>
          <SidebarMenuButton>{favorite.title}</SidebarMenuButton>
          <SidebarMenuAction>
            <EllipsisIcon />
          </SidebarMenuAction>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

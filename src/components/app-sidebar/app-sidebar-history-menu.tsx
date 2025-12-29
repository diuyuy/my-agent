import { CACHE_TAG } from "@/constants/cache-tag";
import { ROUTER_PATH } from "@/constants/router-path";
import { auth } from "@/lib/auth";
import { findAllConversations } from "@/server/features/conversations/conversation.service";
import { MessageCircleMoreIcon } from "lucide-react";
import { cacheTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import AppSidebarMenuItem from "./app-sidebar-menu-item";

export default async function AppSidebarHistoryMenu() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(ROUTER_PATH.LOGIN);
  }

  const conversations = await (async () => {
    "use cache";
    cacheTag(CACHE_TAG.getHistoryCacheTag(session.user.id));

    const result = await findAllConversations(session.user.id, {
      limit: 20,
      cursor: undefined,
    });

    return result.items;
  })();

  return (
    <SidebarMenu>
      {conversations.map(({ id, title }) => (
        <AppSidebarMenuItem key={id} title={title} />
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

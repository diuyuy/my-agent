import { ROUTER_PATH } from "@/constants/router-path";
import { ComputerIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Spinner } from "../ui/spinner";
import AppSidebarFavoritesMenu from "./app-sidebar-favorite-menu";
import AppSidebarHeader from "./app-sidebar-header";
import AppSidebarHistoryMenu from "./app-sidebar-history-menu";

export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <AppSidebarHeader />
      <SidebarContent className="whitespace-nowrap">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={ROUTER_PATH.SEARCH}>
                  <SearchIcon /> 검색
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <ComputerIcon /> 워크스페이스
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>즐겨찾기</SidebarGroupLabel>
          <Suspense
            fallback={
              <div className="flex justify-center">
                <Spinner className="size-4" />
              </div>
            }
          >
            <AppSidebarFavoritesMenu />
          </Suspense>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>채팅 기록</SidebarGroupLabel>
          <AppSidebarHistoryMenu />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem>
          <div className="flex items-center gap-2 overflow-hidden">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="whitespace-nowrap">
              <p className="text-sm">Nickname</p>
              <p className="text-xs text-gray-500">{"example@example.com"}</p>
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}

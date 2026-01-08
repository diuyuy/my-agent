"use client";

import { ROUTER_PATH } from "@/constants/router-path";
import { cn } from "@/lib/utils";
import { ComputerIcon, EditIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import AppSidebarTrigger from "./app-sidebar-trigger";

export default function AppSidebarHeader() {
  const { open } = useSidebar();
  return (
    <SidebarHeader>
      <div className="space-y-4">
        <div
          className={cn("flex items-center justify-between", "overflow-hidden")}
        >
          <div
            className={cn(
              "overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out",
              open ? "w-auto opacity-100 mr-2" : "w-0 opacity-0 mr-0"
            )}
          >
            <p className="text-lg font-semibold">My Agent</p>
          </div>

          <AppSidebarTrigger />
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="whitespace-nowrap" asChild>
              <Link href={ROUTER_PATH.CONVERSATION}>
                <EditIcon /> 새 채팅
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="whitespace-nowrap">
              <Link href={ROUTER_PATH.SEARCH}>
                <SearchIcon /> 검색
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="whitespace-nowrap">
              <Link href={ROUTER_PATH.WORKSPACE}>
                <ComputerIcon /> 워크스페이스
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </SidebarHeader>
  );
}

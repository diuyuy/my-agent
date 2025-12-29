"use client";

import { cn } from "@/lib/utils";
import { EditIcon } from "lucide-react";
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
          className={cn(
            `flex ${open ? "justify-between" : "justify-center"} items-center`,
            "items-center"
          )}
        >
          {open && (
            <p className="whitespace-nowrap text-lg font-semibold">
              {"My Agent"}
            </p>
          )}
          <AppSidebarTrigger />
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="whitespace-nowrap">
              <EditIcon /> 새 채팅
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </SidebarHeader>
  );
}

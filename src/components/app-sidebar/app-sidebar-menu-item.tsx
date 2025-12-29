"use client";

import { EllipsisIcon } from "lucide-react";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

type Props = {
  title: string;
};

export default function AppSidebarMenuItem({ title }: Props) {
  return (
    <SidebarMenuItem className="group/item group-data-[collapsible=icon]:opacity-0">
      <SidebarMenuButton className="overflow-x-hidden">
        {title}
      </SidebarMenuButton>
      <SidebarMenuAction className="opacity-0 group-hover/item:opacity-100 transition-opacity duration-100">
        <EllipsisIcon />
      </SidebarMenuAction>
    </SidebarMenuItem>
  );
}

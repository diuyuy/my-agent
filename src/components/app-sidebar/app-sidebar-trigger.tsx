"use client";

import { PanelLeftIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";

export default function AppSidebarTrigger() {
  const { toggleSidebar } = useSidebar();
  return (
    <Button size={"icon-sm"} variant={"ghost"} onClick={toggleSidebar}>
      <PanelLeftIcon className="text-foreground" />
    </Button>
  );
}

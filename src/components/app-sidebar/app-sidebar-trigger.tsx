"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { PanelLeftIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";

export default function AppSidebarTrigger() {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  return (
    <Button
      size={"icon-sm"}
      variant={"ghost"}
      onClick={toggleSidebar}
      className={cn(isMobile && "hidden")}
    >
      <PanelLeftIcon className="text-foreground" />
    </Button>
  );
}

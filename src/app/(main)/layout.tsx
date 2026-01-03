import AppSidebar from "@/components/app-sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { PropsWithChildren } from "react";

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger className="md:hidden ml-2 mt-2" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}

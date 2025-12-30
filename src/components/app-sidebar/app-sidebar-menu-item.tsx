"use client";

import {
  addConversationToFavorites,
  deleteConversation,
  removeConversationFromFavorites,
} from "@/client-services/conversation";
import { EllipsisIcon, PencilIcon, StarIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

type Props = {
  conversationId: string;
  title: string;
  isFavorite: boolean;
};

export default function AppSidebarMenuItem({
  conversationId,
  title,
  isFavorite,
}: Props) {
  const router = useRouter();

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeConversationFromFavorites(conversationId);
        toast.success("즐겨찾기에서 제거되었습니다.", {
          duration: 1000,
        });
      } else {
        await addConversationToFavorites(conversationId);
        toast.success("즐겨찾기에 추가되었습니다.", {
          duration: 1000,
        });
      }
      router.refresh();
    } catch (error) {
      toast.error("즐겨찾기 처리에 실패했습니다.");
      console.error("Failed to toggle favorite:", error);
    }
  };

  const handleRename = async () => {
    // TODO: 이름 변경 API 구현 필요
    toast.info("이름 변경 기능은 준비 중입니다.");
  };

  const handleDelete = async () => {
    try {
      await deleteConversation(conversationId);
      toast.success("대화가 삭제되었습니다.", {
        duration: 1000,
      });
      router.refresh();
    } catch (error) {
      toast.error("대화 삭제에 실패했습니다.");
      console.error("Failed to delete conversation:", error);
    }
  };

  return (
    <SidebarMenuItem className="group/item group-data-[collapsible=icon]:opacity-0 duration-200">
      <SidebarMenuButton className="overflow-x-hidden">
        {title}
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction className="opacity-0 group-hover/item:opacity-100 transition-opacity duration-200">
            <EllipsisIcon />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItem onClick={handleToggleFavorite}>
            <StarIcon className="text-foreground" />
            {isFavorite ? "즐겨찾기 제거" : "즐겨찾기 추가"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleRename}>
            <PencilIcon className="text-foreground" />
            이름 변경
          </DropdownMenuItem>
          <Separator />
          <DropdownMenuItem onClick={handleDelete}>
            <TrashIcon className="text-destructive " />
            <p className="text-destructive hover:text-destructive ">삭제</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}

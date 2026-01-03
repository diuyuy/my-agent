"use client";

import {
  addConversationToFavorites,
  deleteConversation,
  removeConversationFromFavorites,
  updateConversationTitle,
} from "@/client-services/conversation.api";
import DeleteConfirmDialog from "@/components/delete-confirm-dialog";
import EditTitleDialog from "@/components/edit-title-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ROUTER_PATH } from "@/constants/router-path";
import { QUERY_KEYS } from "@/lib/utils";
import type { Conversation } from "@/schemas/conversation.schema";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import {
  EllipsisIcon,
  ExternalLinkIcon,
  PencilIcon,
  StarIcon,
  TrashIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function ConversationItem({ conversation }: { conversation: Conversation }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleToggleFavorite = async () => {
    try {
      if (conversation.isFavorite) {
        await removeConversationFromFavorites(conversation.id);
        toast.success("즐겨찾기에서 제거되었습니다.", {
          duration: 1500,
        });
      } else {
        await addConversationToFavorites(conversation.id);
        toast.success("즐겨찾기에 추가되었습니다.", {
          duration: 1500,
        });
      }
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.getConversationQueryKeys(),
      });
      queryClient.invalidateQueries({
        queryKey: ["conversations", "infinite"],
      });
    } catch (error) {
      toast.error("즐겨찾기 처리에 실패했습니다.");
      console.error("Failed to toggle favorite:", error);
    }
  };

  const handleRename = () => {
    setIsEditDialogOpen(true);
  };

  const handleSubmitEditTitle = async (data: { title: string }) => {
    try {
      await updateConversationTitle(conversation.id, data);
      toast.success("제목이 변경되었습니다.", {
        duration: 1500,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.getConversationQueryKeys(),
      });
      queryClient.invalidateQueries({
        queryKey: ["conversations", "infinite"],
      });
    } catch (error) {
      toast.error("제목 변경에 실패했습니다.");
      console.error("Failed to update conversation title:", error);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteConversation(conversation.id);
      toast.success("대화가 삭제되었습니다.", {
        duration: 1000,
      });
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.getConversationQueryKeys(),
      });
      queryClient.invalidateQueries({
        queryKey: ["conversations", "infinite"],
      });
    } catch (error) {
      toast.error("대화 삭제에 실패했습니다.");
      console.error("Failed to delete conversation:", error);
    }
  };

  const handleNavigate = () => {
    router.push(`${ROUTER_PATH.CONVERSATION}/${conversation.id}`);
  };

  return (
    <>
      <div
        className="group relative border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
        onClick={handleNavigate}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{conversation.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {formatDistanceToNow(new Date(conversation.updatedAt), {
                addSuffix: true,
                locale: ko,
              })}
            </p>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate();
              }}
            >
              <ExternalLinkIcon className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                onClick={(e) => e.stopPropagation()}
              >
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <EllipsisIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite();
                  }}
                >
                  <StarIcon className="text-foreground" />
                  {conversation.isFavorite
                    ? "즐겨찾기 제거"
                    : "즐겨찾기 추가"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRename();
                  }}
                >
                  <PencilIcon className="text-foreground" />
                  이름 변경
                </DropdownMenuItem>
                <Separator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick();
                  }}
                >
                  <TrashIcon className="text-destructive" />
                  <p className="text-destructive hover:text-destructive">
                    삭제
                  </p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <EditTitleDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        initialTitle={conversation.title}
        onSubmit={handleSubmitEditTitle}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </>
  );
}

"use client";

import {
  addConversationToFavorites,
  deleteConversation,
  removeConversationFromFavorites,
  updateConversationTitle,
} from "@/client-services/conversation.api";
import { ROUTER_PATH } from "@/constants/router-path";
import { useUpdateTitleForm } from "@/hooks/useUpdateTitleForm";
import { QUERY_KEYS } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { EllipsisIcon, PencilIcon, StarIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { toast } from "sonner";
import DeleteConfirmDialog from "../delete-confirm-dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
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
  const { conversationId: currentId } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const form = useUpdateTitleForm(title);

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeConversationFromFavorites(conversationId);
        toast.success("즐겨찾기에서 제거되었습니다.", {
          duration: 1500,
        });
      } else {
        await addConversationToFavorites(conversationId);
        toast.success("즐겨찾기에 추가되었습니다.", {
          duration: 1500,
        });
      }
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.getConversationQueryKeys(),
      });
    } catch (error) {
      toast.error("즐겨찾기 처리에 실패했습니다.");
      console.error("Failed to toggle favorite:", error);
    }
  };

  const handleRename = () => {
    form.reset({ title });
    setIsEditDialogOpen(true);
  };

  const handleSubmitEditTitle = async (data: { title: string }) => {
    try {
      await updateConversationTitle(conversationId, data);
      toast.success("제목이 변경되었습니다.", {
        duration: 1500,
      });
      setIsEditDialogOpen(false);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.getConversationQueryKeys(),
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
      await deleteConversation(conversationId);
      toast.success("대화가 삭제되었습니다.", {
        duration: 1000,
      });
      setIsDeleteDialogOpen(false);
      if (conversationId === currentId) {
        router.replace(ROUTER_PATH.CONVERSATION);
      }
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.getConversationQueryKeys(),
      });
    } catch (error) {
      toast.error("대화 삭제에 실패했습니다.");
      console.error("Failed to delete conversation:", error);
    }
  };

  return (
    <>
      <SidebarMenuItem className="group/item group-data-[collapsible=icon]:opacity-0 duration-200">
        <SidebarMenuButton
          isActive={conversationId === currentId}
          className="overflow-x-hidden"
          asChild
        >
          <Link href={`${ROUTER_PATH.CONVERSATION}/${conversationId}`}>
            {title}
          </Link>
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
            <DropdownMenuItem onClick={handleDeleteClick}>
              <TrashIcon className="text-destructive " />
              <p className="text-destructive hover:text-destructive ">삭제</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      <AlertDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>제목 변경</AlertDialogTitle>
          </AlertDialogHeader>
          <form onSubmit={form.handleSubmit(handleSubmitEditTitle)}>
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-input-title">
                    새로운 제목
                  </FieldLabel>
                  <Input
                    id="form-input-title"
                    placeholder="제목을 입력하세요..."
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel type="button">취소</AlertDialogCancel>
              <Button type="submit">저장</Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </>
  );
}

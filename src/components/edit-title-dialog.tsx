"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUpdateTitleForm } from "@/hooks/useUpdateTitleForm";
import { Controller } from "react-hook-form";

interface EditTitleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTitle: string;
  onSubmit: (data: { title: string }) => Promise<void>;
}

export default function EditTitleDialog({
  open,
  onOpenChange,
  initialTitle,
  onSubmit,
}: EditTitleDialogProps) {
  const form = useUpdateTitleForm(initialTitle);

  const handleSubmit = async (data: { title: string }) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>제목 변경</AlertDialogTitle>
        </AlertDialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
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
  );
}

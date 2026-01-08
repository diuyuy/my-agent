"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2Icon, TrashIcon } from "lucide-react";
import { useState } from "react";

type Embedding = {
  id: string;
  content: string;
  tag: string | null;
  createdAt: Date;
};

type Props = {
  embeddings: Embedding[];
  resourceId: string;
  resourceName: string;
};

type SortBy = "createdAt" | "content";
type SortOrder = "asc" | "desc";

export function EmbeddingsList({
  embeddings,
  resourceId,
  resourceName,
}: Props) {
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedEmbedding, setSelectedEmbedding] = useState<Embedding | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "resource" | "embedding";
    id: string;
    name: string;
  } | null>(null);

  const sortedEmbeddings = [...embeddings].sort((a, b) => {
    let comparison = 0;

    if (sortBy === "createdAt") {
      comparison =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else {
      comparison = a.content[0].localeCompare(b.content[0]);
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  const handleDelete = (
    type: "resource" | "embedding",
    id: string,
    name: string
  ) => {
    setDeleteTarget({ type, id, name });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    // TODO: Implement server-side deletion logic
    console.log(`Deleting ${deleteTarget.type}:`, deleteTarget.id);

    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">정렬 기준:</span>
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as SortBy)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">생성일</SelectItem>
              <SelectItem value="content">첫 글자</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value as SortOrder)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">오름차순</SelectItem>
              <SelectItem value="desc">내림차순</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDelete("resource", resourceId, resourceName)}
        >
          <TrashIcon />
          리소스 삭제
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedEmbeddings.map((embedding) => (
          <div
            key={embedding.id}
            className="group relative flex flex-col rounded-lg border bg-card p-4 transition-colors hover:bg-accent cursor-pointer"
            onClick={() => setSelectedEmbedding(embedding)}
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <p className="line-clamp-3 flex-1 text-sm">{embedding.content}</p>
              <Button
                variant="ghost"
                size="icon-sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(
                    "embedding",
                    embedding.id,
                    embedding.content.substring(0, 30) + "..."
                  );
                }}
              >
                <Trash2Icon className="size-4 text-destructive" />
              </Button>
            </div>

            <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
              <span>{new Date(embedding.createdAt).toLocaleDateString()}</span>
              {embedding.tag && (
                <span className="rounded-full bg-primary/10 px-2 py-1">
                  {embedding.tag}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <EmbeddingDetailsDialog
        embedding={selectedEmbedding}
        onClose={() => setSelectedEmbedding(null)}
      />

      <DeleteConfirmDialog
        deleteTarget={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

type EmbeddingDetailsDialogProps = {
  embedding: Embedding | null;
  onClose: () => void;
};

function EmbeddingDetailsDialog({
  embedding,
  onClose,
}: EmbeddingDetailsDialogProps) {
  return (
    <Dialog open={!!embedding} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>임베딩 상세 내용</DialogTitle>
          <DialogDescription>
            생성일 {embedding && new Date(embedding.createdAt).toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 ">
          <div>
            <h3 className="mb-2 text-sm font-medium">ID</h3>
            <code className="text-xs text-muted-foreground">
              {embedding?.id}
            </code>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium">내용</h3>
            <p className="whitespace-pre-wrap text-sm border border-muted p-2 max-h-72 overflow-y-auto rounded-md">
              {embedding?.content}
            </p>
          </div>
          {embedding?.tag && (
            <div>
              <h3 className="mb-2 text-sm font-medium">태그</h3>
              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm">
                {embedding.tag}
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

type DeleteConfirmDialogProps = {
  deleteTarget: {
    type: "resource" | "embedding";
    id: string;
    name: string;
  } | null;
  onClose: () => void;
  onConfirm: () => void;
};

function DeleteConfirmDialog({
  deleteTarget,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog
      open={!!deleteTarget}
      onOpenChange={(open) => !open && onClose()}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>확실합니까?</AlertDialogTitle>
          <AlertDialogDescription>
            다음 항목이 영구적으로 삭제됩니다:{" "}
            {deleteTarget?.type === "resource"
              ? "이 리소스와 모든 임베딩"
              : "이 임베딩"}
            .
            <br />
            <span className="font-medium">{deleteTarget?.name}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <Button variant={"destructive"} onClick={onConfirm}>
            삭제
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

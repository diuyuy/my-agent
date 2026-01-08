"use client"

import { FileText, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock 데이터
const mockResources = [
  { id: "1", name: "document1.pdf", type: "pdf", uploadedAt: "2024-01-15", size: "2.5 MB" },
  { id: "2", name: "notes.txt", type: "txt", uploadedAt: "2024-01-14", size: "45 KB" },
  { id: "3", name: "research.pdf", type: "pdf", uploadedAt: "2024-01-13", size: "1.8 MB" },
]

const mockEmbeddings = [
  { id: "1", content: "This is embedded content from document1...", source: "document1.pdf", createdAt: "2024-01-15" },
  { id: "2", content: "Important notes about the project...", source: "notes.txt", createdAt: "2024-01-14" },
  { id: "3", content: "Research findings and conclusions...", source: "research.pdf", createdAt: "2024-01-13" },
  { id: "4", content: "Additional context and information...", source: "document1.pdf", createdAt: "2024-01-15" },
]

export function DataListSection() {
  const handleDelete = (id: string, type: "resource" | "embedding") => {
    // TODO: 서버에서 데이터 삭제 로직
    console.log(`Deleting ${type}:`, id)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>데이터 목록</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="resources" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="resources" className="flex-1">
              Resource 목록
            </TabsTrigger>
            <TabsTrigger value="embeddings" className="flex-1">
              Embedding 데이터
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resources" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              {mockResources.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                  <FileText className="size-12 mb-2" />
                  <p className="text-sm">업로드된 리소스가 없습니다</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mockResources.map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="size-5 text-primary shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{resource.name}</p>
                          <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                            <span>{resource.uploadedAt}</span>
                            <span>•</span>
                            <span>{resource.size}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(resource.id, "resource")}
                        className="hover:bg-destructive/10 hover:text-destructive shrink-0"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="embeddings" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              {mockEmbeddings.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                  <FileText className="size-12 mb-2" />
                  <p className="text-sm">임베딩된 데이터가 없습니다</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mockEmbeddings.map((embedding) => (
                    <div
                      key={embedding.id}
                      className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0 space-y-2">
                        <p className="text-sm line-clamp-2">{embedding.content}</p>
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <span className="font-medium">{embedding.source}</span>
                          <span>•</span>
                          <span>{embedding.createdAt}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(embedding.id, "embedding")}
                        className="hover:bg-destructive/10 hover:text-destructive shrink-0 ml-2"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

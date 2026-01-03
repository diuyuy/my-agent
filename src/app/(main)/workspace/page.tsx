import { FileUploadSection } from "./components/file-upload-section"
import { TextInputSection } from "./components/text-input-section"
import { DataListSection } from "./components/data-list-section"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function WorkspacePage() {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b px-6 py-4">
        <h1 className="text-2xl font-semibold">RAG 설정</h1>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Tabs defaultValue="file">
            <TabsList>
              <TabsTrigger value="file">파일 업로드</TabsTrigger>
              <TabsTrigger value="text">텍스트 입력</TabsTrigger>
            </TabsList>

            <TabsContent value="file">
              <FileUploadSection />
            </TabsContent>

            <TabsContent value="text">
              <TextInputSection />
            </TabsContent>
          </Tabs>

          <DataListSection />
        </div>
      </div>
    </div>
  )
}

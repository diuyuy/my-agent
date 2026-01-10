"use client";

import { createEmbedding } from "@/client-services/rag.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  ExtractedTextData,
  extractTextFromPdf,
  extractTextFromTxtFile,
} from "@/lib/text-extraction";
import { FileText, Upload, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

export function FileUploadSection() {
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const removeFile = () => {
    setFile(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsExtracting(true);

    try {
      let extractedData: ExtractedTextData;

      // .txt 파일인 경우 텍스트 추출
      if (file.type.includes("text/plain") || file.name.endsWith(".txt")) {
        extractedData = await extractTextFromTxtFile(file);
      }
      // .pdf 파일인 경우 텍스트 추출
      else if (
        file.type.includes("application/pdf") ||
        file.name.endsWith(".pdf")
      ) {
        extractedData = await extractTextFromPdf(file);
      } else {
        throw new Error("지원하지 않는 파일 형식입니다.");
      }

      console.log("Extracted text data:", extractedData);

      await createEmbedding(extractedData);

      toast.success(`${file.name} 텍스트 추출 완료`);
    } catch (error) {
      console.error("File processing error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "파일 처리 중 오류가 발생했습니다."
      );
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>파일 업로드</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <Upload className="size-10 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-sm text-muted-foreground">
                파일을 여기에 드롭하세요...
              </p>
            ) : (
              <>
                <p className="text-sm font-medium">
                  파일을 드래그 앤 드롭하거나 클릭하여 선택하세요
                </p>
                <p className="text-xs text-muted-foreground">
                  .txt 또는 .pdf 파일만 업로드 가능
                </p>
              </>
            )}
          </div>
        </div>

        {file && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              <span className="text-sm font-medium">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                ({(file.size / 1024).toFixed(2)} KB)
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={removeFile}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="size-4" />
            </Button>
          </div>
        )}

        {isExtracting && (
          <div className="flex items-center justify-center gap-2 p-3 bg-primary/10 rounded-lg">
            <Spinner className="size-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              텍스트 추출 중...
            </span>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || isExtracting}
          className="w-full"
        >
          업로드
        </Button>
      </CardContent>
    </Card>
  );
}

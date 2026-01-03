"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileText, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function FileUploadSection() {
  const [file, setFile] = useState<File | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    multiple: false,
  })

  const removeFile = () => {
    setFile(null)
  }

  const handleUpload = () => {
    if (file) {
      // TODO: 서버에 파일 업로드 로직
      console.log("Uploading file:", file.name)
    }
  }

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

        <Button onClick={handleUpload} disabled={!file} className="w-full">
          업로드
        </Button>
      </CardContent>
    </Card>
  )
}

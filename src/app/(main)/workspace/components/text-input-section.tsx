"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DOCS_LANGUAGE } from "@/constants/docs-language";
import { SelectGroup } from "@radix-ui/react-select";
import { useState } from "react";
import { useCreateEmbeddingMutation } from "../hooks/use-create-embedding-mutation";

export function TextInputSection() {
  const [text, setText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("none");

  const createEmbeddingMutation = useCreateEmbeddingMutation();

  const handleSubmit = () => {
    if (text.trim()) {
      createEmbeddingMutation.mutate({
        content: text,
        docsLanguage: selectedLanguage as (typeof DOCS_LANGUAGE)[number],
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>텍스트 입력</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="language-select">언어</Label>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger id="language-select" className="w-full">
              <SelectValue placeholder="언어를 선택하세요" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup className="max-h-60">
                {DOCS_LANGUAGE.map((language) => (
                  <SelectItem key={language} value={language}>
                    {language}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="text-input">내용</Label>
          <Textarea
            id="text-input"
            placeholder="텍스트를 입력하세요..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="max-h-75 min-h-37.5"
          />
          <p className="text-xs text-muted-foreground">{text.length} 글자</p>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!text.trim() || createEmbeddingMutation.isPending}
          className="w-full"
        >
          {createEmbeddingMutation.isPending ? "제출 중..." : "제출"}
        </Button>
      </CardContent>
    </Card>
  );
}

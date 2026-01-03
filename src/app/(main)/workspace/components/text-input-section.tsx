"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export function TextInputSection() {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) {
      // TODO: 서버에 텍스트 전송 로직
      console.log("Submitting text:", text);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>텍스트 입력</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
          disabled={!text.trim()}
          className="w-full"
        >
          제출
        </Button>
      </CardContent>
    </Card>
  );
}

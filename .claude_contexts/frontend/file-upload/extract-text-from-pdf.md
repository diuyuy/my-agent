# PDF 파일에서 텍스트 추출 작업

Mozilla PDF.js 라이브러리의 CDN을 사용해서 `src\app\(main)\workspace\components\file-upload-section.tsx`에서 사용자가 업로드한 PDF 파일에서 텍스트를 추출해서 다음과 같은 형식으로 반환하는 함수를 `src\lib` 디렉토리에 구현해주세요.

```ts
{
  content: string;
  resourceName: string;
}
```
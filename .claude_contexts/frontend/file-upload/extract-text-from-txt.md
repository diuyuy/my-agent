# .txt 파일에서 텍스트 추출 작업

`src\app\(main)\workspace\components\file-upload-section.tsx` 여기에서 사용자가 업로드한 .txt 파일의 텍스트를 추출해서 아래와 같은 형식의 데이터로 변환하는 함수를 `src\lib` 디렉토리에 작성해줘.

```ts
{
  content: string;
  resourceName: string;
}
```
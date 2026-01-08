# ResourcePage 생성 작업

`src\app\(main)\workspace\resource\[resourceId]\page.tsx`에 ResourcePage 생성해 주세요. Resource는 ResourcePage 컴포넌트에서 바로 가져오게 구현을 이미 했습니다.

**요구 사항**:
1. 헤더: Resource의 이름을 타이틀로 하고 `fileType` 및 `createdAt`을 적절하게 배치해주세요.
2. `embeddings` 배열을 별도의 클라이언트 컴포넌트로 grid 형태로 배치해줘. 각 Embedidng 클릭 시, `src\components\ui\dialog.tsx`를 사용해서 embedding 상세 내용 확인할 수 있게 해주세요.
3. Embedding 리스트를 createdAt과 content의 첫 번째 글자 기준으로 sorting 가능하게 만들어주세요.
4. Resource와 Embedding 을 삭제 가능하게 만들어주세요. 삭제 시, `src\components\ui\alert-dialog.tsx` 사용해서 confirm 가능하게 해주세요.
5. 서버로 Resource와 Embedding 삭제 요청을 보내는 로직은 아직은 구현하지 말아주세요. 

**Reference**:

```ts
const resource: {
    embeddings: {
        id: string;
        content: string;
        tag: string | null;
        createdAt: Date;
    }[];
    id: string;
    userId: string;
    name: string;
    fileType: "text" | "txt" | "pdf";
    createdAt: Date;
}
```
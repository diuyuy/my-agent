# SearchPage 구현 작업

`src\app\(main)\search\page.tsx`에 있는 `SearchPage` 구현해주세요.

**요구 사항**:
1. 제일 상단에는 "검색" 이라는 타이틀
2. "검색" 밑에 검색할 단어 입력할 수 있는 `input` 컴포넌트. 안에 `SearchIcon` 추가.
  - 사용자 입력 시 바로 데이터 요청하게 하고, `src\lib\utils.ts`에 `debounce` 함수 사용하여 debounce 처리.
3. 그 밑에 conversation List Component.
4. 각 Conversation Component 요구사항:
  - 상단에 title 표시, 그 밑에 updatedAt 작게 표시
  - `hover:` 일 시 오른쪽에 Icon으로 해당 페이지로 이동, 수정, 삭제 버튼 구현
5. `src\app\(main)\search\hooks\use-conversation-infinite-query.ts` 사용해서 무한 스크롤 기능 구현.
6. `IntersectionObserver` 사용해서 사용자가 밑으로 스크롤 시 자동으로 데이터 불러오게끔 구현.


**참고 사항**:
```ts
export const ConversationSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isFavorite: z.boolean(),
});
```
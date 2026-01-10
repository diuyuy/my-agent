# DataListSection 리팩토링 작업

`src\app\(main)\workspace\components\data-list-section.tsx`를 다음 요구사항에 맞게 리팩토링 해주세요.

**요구 사항**:
1. 기존 `Tab` Conponent를 제거하고, Embedding 리소스 목록만 보여주도록 수정해주세요.
2. `src\client-services\rag.api.ts`에 `fetchResources()` 함수 사용해서 리소스 목록 불러오도록 구현해주세요.
3. `.claude_contexts\frontend\tasks\use-query.md` 참고해서 useInfiniteQuery 사용해서 무한 스크롤 구현해주세요.
4. `IntersectionObserver` 사용해서, 자동으로 스크롤되게 구현해주세요.
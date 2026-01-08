# TextInputSection에 DocsLanguage 선택하는 Select Component 추가 작업

`src\components\ui\select.tsx` 컴포넌트를 사용하여, `src\app\(main)\workspace\components\text-input-section.tsx`에 `DocsLanguage`를 선택하는 Select Component 구현해주세요. `DocsLanguage` 배열은 `src\constants\docs-language.ts`에 있습니다.

구현이 완료되면 `src\client-services\rag.api.ts`에 있는 `createEmbedding()` 함수 및 useMutation을 사용하여, `src\app\(main)\workspace\components\text-input-section.tsx`에 서버로 데이터 전송하는 로직 구현해주세요.

`.claude_contexts\frontend\tasks\use-mutation.md` 참고해서 useMutation 사용해주세요.

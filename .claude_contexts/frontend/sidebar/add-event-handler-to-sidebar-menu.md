# AppSidebarMenuItem에 이벤트 핸들러 추가 작업

`AppSidebarMenuItem`에 `src\client-services\conversation.ts` 파일에 있는 함수들을 사용해서 `DropdownMenu`에 이벤트 핸들러 추가해주세요.

**요구 사항**:
1. Button의 `onClick`에 바로 함수를 사용하지 말고, 먼저 Component 내에서 선언한 다음에 이벤트 핸들러의 해당 콜백을 연결해주세요.
2. 만약 코드가 너무 길어진다고 판단되면 `DropdownMenu`를 별도의 컴포넌트로 분리해주세요.
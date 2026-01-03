# WorkspacePage 구현

`src\app\(main)\workspaces\page.tsx` 페이지 구현해주세요.

**요구 사항**:
1. 헤더: "RAG 설정" 이라는 텍스트
2. 업로드 섹션: 파일 업로드 및 텍스트 입력 두 가지 형식 제공.
3. 파일 업로드 시 요구 사항:
  - `react-dropzon` 라이브러리 사용해서 구현
  - 파일: .txt 파일 혹은 pdf 파일만 가능.
  - 파일 업로드 시, 데스크톱에서 drag & drop 으로 업로드 가능.
  - 동시에 하나의 파일만 업로드 가능.
4. 텍스트 입력 시, Textarea max height 적절히 설정. (본인 판단에 맞게 설정해주세요.)
5. 데이터 리스트 섹션
  - Resource 목록 / Embedding 된 데이터 목록 두 가지 목록을 볼 수 있습니다.
  - Tab으로 전환되게 해주세요. (`src\components\ui\tabs.tsx`)
6. 서버에 데이터 요청하는 로직은 우선 구현하지 말아주세요. Mock data 필요 시 Mock data로 구현해주세요.
7. 만약 파일이 너무 커질 시, `src\app\(main)\workspaces\components`에 컴포넌트 생성해주세요.
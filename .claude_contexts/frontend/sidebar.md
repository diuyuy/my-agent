# App Sidebar 구현 작업

(main) 폴더 아래에 있는 페이지 들에서 사용할 Left Sidebar 구현해주세요.

**요구 사항**:

1. **Sidebar Header**: 
   - 상단: "My Agent" 로고. 그 옆에 사이드 바를 open/close 할 수 있는 버튼. 하단: 
   - 하단: "새 채팅" 버튼
2. **Sidebar Footer**:
  - 좌측: 사용자 프로필 아바타
  - 중앙: 사용자 이름 그 하단에 사용자 이메일
3. **Sidebar Content**: Scroll 가능한 영역.
  - First Group: 좌측에 아이콘 있는 버튼 리스트
    - 채팅 목록 확인할 수 있는 버튼.
    - Workspace 버튼.
  - Second Group: 즐겨찾기 목록 (무한 스크롤 X).
  - Third Group: 채팅 기록 목록 (무한 스크롤 X). 상위 20개 목록 보여주고 그 밑에 모든 채팅 보기 버튼.
4. Sidebar를 close 했을 시, 사이드바에서 보여줄 요소 목록: Open/close 버튼, 새 채팅 버튼, 채팅 목록 확인 버튼, Workspace 버튼, 사용자 아바타.

우선 UI 요소들만 구현. 채팅 목록을 가져오는 데이터 페칭 로직은 구현 불필요 X.
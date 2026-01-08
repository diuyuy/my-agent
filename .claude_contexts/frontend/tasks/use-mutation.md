# useQuery를 사용한 서버 상태 관리 구현 작업

`useMutation`을 사용할 시 다음과 같이 구현해주세요:

1. 가장 가까운 `hooks` 디렉토리에 `use{NAME}Mutation`라는 custom hook 만들어주세요.
2. `queryKey`는 `src\constants\query-keys.ts`에 있는 `QUERY_KEYS` 사용해주세요.
3. File 이름은 모두 소문자로 작성하고, 하이픈('-')으로 단어 구분해주세요.
4. `import { toast } from "sonner"`을 사용하여, onSuccess와 onError일 시 메시지 보여주세요.
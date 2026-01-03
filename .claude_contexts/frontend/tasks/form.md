# Form 생성 작업

Form을 구현할 때 다음과 같은 방법으로 구현해주세요:

1. 현재 속한 `components` 폴더와 같은 위치에 있는 `hooks` 폴더에 `use{NAME}Form`이라는 react-hook-form 라이브러리의 `useForm`을 사용한 custom hook 구현.
**Example**:

```ts
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const useLoginForm = () => {
  return useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
};
```

2. `src\schemas\` 폴더에서 정의된 schema 사용해주세요.
2. `src\components\ui\field.tsx` Component 사용해서 Form 구현해주세요.
**Example**:
```tsx
 <form
      onSubmit={form.handleSubmit(onSubmit)}
    >
        <Controller
          control={form.control}
          name='email'
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor='form-input-email'
              >
                <MailIcon /> 이메일
              </FieldLabel>
              <Input
                id='form-input-email'
                autoComplete='email'
                placeholder='이메일을 입력하세요...'
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      <Button type='submit'>
        로그인
      </Button>
    </form>
```

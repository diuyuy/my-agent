import { z } from "@hono/zod-openapi";

export const SuccessReponseSchema = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: "요청이 성공적으로 처리되었습니다." }),
});

export type SuccessResponse<T> = z.infer<typeof SuccessReponseSchema> & {
  data?: T;
};

export const ErrorResponseSchema = z.object({
  success: z.boolean().openapi({ example: false }),
  code: z.string(),
  message: z.string(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

export const ValidationErrorSchema = z.object({
  success: z.boolean().openapi({ example: false }),
  code: z.string().openapi({ example: "REQUEST_VALIDATION_ERROR" }),
  message: z.string().openapi({ example: "유효하지 않은 요청 형식입니다." }),
});

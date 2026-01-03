import { RESPONSE_STATUS } from "@/constants/response-status";
import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { CommonHttpException } from "../errors/common-http-exception";

export const globalExceptionHandler = (
  error: HTTPException | Error,
  c: Context
) => {
  if (error instanceof CommonHttpException) {
    console.error(error.message);
    return c.json(
      {
        success: false,
        code: error.code,
        message: error.message,
      },
      error.status
    );
  }

  console.error(error);

  return c.json(
    {
      success: false,
      code: 500,
      message: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.message,
    },
    500
  );
};

import { RESPONSE_STATUS } from "./response-status";

export const SUCCESS_RESPONSE = {
  success: true,
  message: RESPONSE_STATUS.OK.message,
} as const;

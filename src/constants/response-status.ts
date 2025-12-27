export const RESPONSE_STATUS = {
  OK: {
    status: 200,
    code: "OK",
    message: "요청이 성공적으로 처리되었습니다.",
  },

  // 401
  INVALID_SESSION: {
    status: 401,
    code: "INVALID_SESSION",
    message: "유효하지 않은 세션입니다.",
  },

  // 404
  NOT_FOUND: {
    status: 404,
    code: "NOT_FOUND",
    message: "해당 자원이 존재하지 않습니다.",
  },

  INTERNAL_SERVER_ERROR: {
    status: 500,
    code: "INTERNAL_SERVER_ERROR",
    message: "서버 내부에 오류가 발생했습니다.",
  },
} as const;

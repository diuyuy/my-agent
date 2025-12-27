import { RESPONSE_STATUS } from "@/constants/response-status";
import { auth } from "@/lib/auth";
import { createMiddleware } from "hono/factory";
import { CommonHttpException } from "../errors/common-http-exception";
import { Env } from "../types/types";

export const sessionMiddleware = createMiddleware<Env>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    throw new CommonHttpException(RESPONSE_STATUS.INVALID_SESSION);
  }

  c.set("user", session.user);
  c.set("session", session.session);

  await next();
});
